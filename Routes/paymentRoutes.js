const express = require('express');
const router = express.Router();

const { createPaymentIntent } = require('../Controllers/paymentController');

router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;