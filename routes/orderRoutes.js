const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateOrder, validateGetOrders, validateOrderId } = require('../middlewares/validateOrder');

router.get('/', validateGetOrders, orderController.getOrders);
router.get('/:id', validateOrderId, orderController.getOrdersById);
router.post('/', validateOrder('create'), orderController.createOrder);
router.put('/:id', validateOrder('update'), orderController.updateOrder);
router.delete('/:id', validateOrderId, orderController.deleteOrder);

module.exports = router;