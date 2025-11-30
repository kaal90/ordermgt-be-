const { Sequelize } = require('sequelize');
const { validationResult } = require("express-validator");
const { Order, OrderProductMap, Product } = require('../models');

const handleValidation = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

//GET
exports.getOrders = async (req, res) => {
    try {
        handleValidation(req, res);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;

        const offset = (page - 1) * limit;
        const where = {};
        if (search.trim() !== "") {

            const orderId = parseInt(search);
            where[Sequelize.Op.or] = [];

            if (!isNaN(orderId)) {
                where[Sequelize.Op.or].push({ id: orderId });
            }

            where[Sequelize.Op.or].push({
                orderDescription: { [Sequelize.Op.iLike]: `%${search.trim()}%` }
            });
        }

        const { count, rows } = await Order.findAndCountAll({
            where,
            limit,
            offset,
            order: [['id', 'ASC']],
            include: {
                model: OrderProductMap,
                include: [Product]
            }
        });

        return res.json({
            data: rows,
            total: count,
            page,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

//GET BY ID
exports.getOrdersById = async (req, res) => {
    try {
        handleValidation(req, res);

        const { id } = req.params;
        const order = await Order.findByPk(id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//CREATE
exports.createOrder = async (req, res) => {

    const t = await Order.sequelize.transaction();

    const { orderDescription, productIds } = req.body;

    try {

        handleValidation(req, res);

        const newOrder = await Order.create(
            { orderDescription },
            { transaction: t }
        );

        if (Array.isArray(productIds) && productIds.length > 0) {
            const mappingRows = productIds.map(pid => ({
                orderId: newOrder.id,
                productId: pid
            }));
            await OrderProductMap.bulkCreate(mappingRows, { transaction: t });
        }

        await t.commit();
        res.status(201).json(newOrder);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

//UPDATE BY ID
exports.updateOrder = async (req, res) => {
    const t = await Order.sequelize.transaction();

    try {

        handleValidation(req, res);

        const { id } = req.params;
        const { orderDescription, productIds } = req.body;

        const order = await Order.findByPk(id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.orderDescription = orderDescription;
        await order.save({ transaction: t });

        if (Array.isArray(productIds)) {
            await OrderProductMap.destroy({
                where: { orderId: id },
                transaction: t
            });

            const rows = productIds.map(
                pid => ({
                    orderId: id, productId: pid
                })
            );

            await OrderProductMap.bulkCreate(rows, { transaction: t });
        }

        await t.commit();
        res.json(order);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

//DELETE BY ID
exports.deleteOrder = async (req, res) => {
    try {

        handleValidation(req, res);

        const { id } = req.params;
        const deleted = await Order.destroy({ where: { id } });

        if (!deleted) return res.status(404).json({ message: 'Order not found' });

        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};