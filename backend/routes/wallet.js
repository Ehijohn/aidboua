const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/wallet/initialize-payment
// @desc    Initialize Paystack payment
// @access  Private
router.post('/initialize-payment', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum amount is NGN 100' });
    }

    const reference = `WF-${Date.now()}-${req.user.id}`;

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: req.user.email,
        amount: amount * 100, // Convert to kobo
        reference,
        callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/wallet/verify`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_API_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Create pending transaction
    await Transaction.create({
      user: req.user.id,
      type: 'credit',
      amount,
      reference,
      description: 'Wallet funding',
      status: 'pending',
      paymentMethod: 'paystack',
      balanceBefore: req.user.wallet.balance,
    });

    res.json({
      success: true,
      data: response.data.data,
    });
  } catch (error) {
    console.error('Payment Initialization Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to initialize payment' });
  }
});

// @route   GET /api/wallet/verify-payment/:reference
// @desc    Verify Paystack payment
// @access  Private
router.get('/verify-payment/:reference', protect, async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_API_SECRET_KEY}`,
        },
      }
    );

    if (response.data.data.status === 'success') {
      const transaction = await Transaction.findOne({ reference });
      
      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      if (transaction.status === 'success') {
        return res.json({ success: true, message: 'Payment already verified' });
      }

      const user = await User.findById(transaction.user);
      const newBalance = user.wallet.balance + transaction.amount;

      user.wallet.balance = newBalance;
      await user.save();

      transaction.status = 'success';
      transaction.balanceAfter = newBalance;
      transaction.metadata = response.data.data;
      await transaction.save();

      res.json({
        success: true,
        message: 'Payment verified successfully',
        balance: newBalance,
      });
    } else {
      const transaction = await Transaction.findOne({ reference });
      if (transaction) {
        transaction.status = 'failed';
        await transaction.save();
      }

      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
});

// @route   GET /api/wallet/balance
// @desc    Get wallet balance
// @access  Private
router.get('/balance', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      wallet: user.wallet,
    });
  } catch (error) {
    console.error('Get Balance Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/wallet/transactions
// @desc    Get wallet transactions
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('shipment', 'shipmentId trackingNumber');

    const total = await Transaction.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get Transactions Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
