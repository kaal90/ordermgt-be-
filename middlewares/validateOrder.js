const { body, validationResult, param, query } = require('express-validator');

const validateOrder = (mode = 'create') => [
  body('orderDescription')
    .if(() => mode === 'create') 
    .notEmpty().withMessage('Cannot be empty')
    .isString().withMessage('Must be a string')
    .isLength({ max: 100 }).withMessage('Max 100 characters')
    .if(() => mode === 'update')
    .optional()
    .isString().withMessage('Must be a string')
    .isLength({ max: 100 }).withMessage('Max 100 characters'),

  body('productIds')
    .if(() => mode === 'create')
    .isArray({ min: 1 }).withMessage('Must be an array and not empty')
    .if(() => mode === 'update')
    .optional()
    .isArray().withMessage('Must be an array'),

  body('productIds.*')
    .optional()
    .isInt({ min: 1 }).withMessage('Must be a positive integers'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

const validateGetOrders = [
  query('page').optional().isInt({ min: 1 }).withMessage('Must be positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Must be positive integer'),
  query('search').optional().isString().isLength({ max: 100 }).withMessage('Must be positive integer with maximum of 100 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

const validateOrderId = [
  param('id')
    .exists().withMessage('Order ID is required')
    .isInt({ min: 1 }).withMessage('Must be a positive integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];


module.exports = { validateOrder, validateGetOrders, validateOrderId };
