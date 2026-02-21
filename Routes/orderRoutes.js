const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus
} = require('../Controllers/orderController');

// Define Routes
router.post('/', createOrder);
router.get('/', getOrders); // get all orders
router.get('/myorders', getMyOrders); // get my orders
router.get('/myorders/:userId', getMyOrders); // get my orders with userId
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
