const Order = require('../Models/orderModel');
const Product = require('../Models/productModel');

// Create new order
const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Use userId from request body if available (useful for testing without auth token)
        const userId = req.user ? req.user._id : req.body.userId;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required to create an order' });
        }

        const order = new Order({
            user: userId,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch order', error: error.message });
    }
};

// Get logged in user orders
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.params.userId; // fallback if no auth middleware
        const orders = await Order.find({ user: userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user orders', error: error.message });
    }
};

// Get all orders (Admin only ideally)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch all orders', error: error.message });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = req.body.status || order.orderStatus;

            if (req.body.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            if (req.body.isPaid) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentStatus = 'Completed';
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus
};
