const Order = require('../Models/orderModel');
const Product = require('../Models/productModel');

// Create new order
const createOrder = async (req, res) => {
    try {
        console.log('Order request body:', req.body);

        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            stripePaymentIntentId
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Validate shipping address
        if (
            !shippingAddress ||
            !shippingAddress.fullName ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.postalCode ||
            !shippingAddress.country ||
            !shippingAddress.phone
        ) {
            return res.status(400).json({ message: 'Complete shipping address is required' });
        }

        const userId = req.user ? req.user._id : req.body.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required to create an order' });
        }

        // Transform order items
        const transformedOrderItems = orderItems.map(item => {
            if (!item.id) {
                throw new Error(`Product ID is required for item: ${item.name}`);
            }

            if (typeof item.id === 'string' && item.id.length === 24 && /^[0-9a-fA-F]{24}$/.test(item.id)) {
                return {
                    product: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    variant: item.variant || null
                };
            } else {
                throw new Error(`Invalid Product ID format for "${item.name}". Expected 24-character ObjectId, got: ${item.id}`);
            }
        });

        // -----------------------------
        // Payment Logic
        // -----------------------------
        let isPaid = false;
        let paidAt = null;
        let paymentStatus = "Pending";

        if (paymentMethod && paymentMethod.toLowerCase().trim() === "stripe") {
            isPaid = true;
            paidAt = Date.now();
            paymentStatus = "Completed";
        }

        console.log("Payment Method:", paymentMethod);
        console.log("isPaid will be set to:", isPaid);

        const order = new Order({
            user: userId,
            orderItems: transformedOrderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            stripePaymentIntentId,
            isPaid,
            paidAt,
            paymentStatus
        });

        console.log('Order to be created:', order);

        const createdOrder = await order.save();

        console.log('Created order:', createdOrder);

        res.status(201).json(createdOrder);

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            message: 'Failed to create order',
            error: error.message
        });
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
        res.status(500).json({
            message: 'Failed to fetch order',
            error: error.message
        });
    }
};

// Get logged in user orders
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.params.userId;
        const orders = await Order.find({ user: userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch user orders',
            error: error.message
        });
    }
};

// Get all orders (Admin only ideally)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch all orders',
            error: error.message
        });
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
        res.status(500).json({
            message: 'Failed to update order status',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus
};