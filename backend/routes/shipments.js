const express = require('express');
const TerminalAfrica = require('terminal-africa').default;
const Shipment = require('../models/Shipment');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/shipments/get-rates
// @desc    Get shipping rates
// @access  Private
router.post('/get-rates', protect, async (req, res) => {
  try {
    const { pickupAddress, deliveryAddress, parcel } = req.body;

    const quotesPayload = {
      pickup_address: {
        first_name: pickupAddress.firstName,
        last_name: pickupAddress.lastName,
        email: pickupAddress.email,
        phone: pickupAddress.phone,
        is_residential: pickupAddress.isResidential || true,
        line1: pickupAddress.line1,
        line2: pickupAddress.line2 || '',
        city: pickupAddress.city,
        state: pickupAddress.state,
        country: pickupAddress.country,
        zip: pickupAddress.zip || '',
      },
      delivery_address: {
        first_name: deliveryAddress.firstName,
        last_name: deliveryAddress.lastName,
        email: deliveryAddress.email,
        phone: deliveryAddress.phone,
        is_residential: deliveryAddress.isResidential || true,
        line1: deliveryAddress.line1,
        line2: deliveryAddress.line2 || '',
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        country: deliveryAddress.country,
        zip: deliveryAddress.zip || '',
      },
      parcel: {
        description: parcel.description,
        weight_unit: parcel.weightUnit || 'kg',
        items: parcel.items.map(item => ({
          description: item.description,
          name: item.name,
          currency: item.currency || 'NGN',
          value: item.value,
          quantity: item.quantity,
          weight: item.weight,
        })),
      },
    };

    const quotes = await TerminalAfrica.getQuotesForShipment(quotesPayload);

    res.json({
      success: true,
      rates: quotes.data || quotes,
    });
  } catch (error) {
    console.error('Get Rates Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Failed to get rates',
      error: error.response?.data || error.message 
    });
  }
});

// @route   POST /api/shipments/create
// @desc    Create new shipment
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const { pickupAddress, deliveryAddress, parcel, rate } = req.body;

    // Check wallet balance
    const user = await User.findById(req.user.id);
    if (user.wallet.balance < rate.amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance',
      });
    }

    // Create shipment in Terminal Africa
    const quickShipmentPayload = {
      pickup_address: {
        first_name: pickupAddress.firstName,
        last_name: pickupAddress.lastName,
        email: pickupAddress.email,
        phone: pickupAddress.phone,
        is_residential: pickupAddress.isResidential || true,
        line1: pickupAddress.line1,
        line2: pickupAddress.line2 || '',
        city: pickupAddress.city,
        state: pickupAddress.state,
        country: pickupAddress.country,
        zip: pickupAddress.zip || '',
      },
      delivery_address: {
        first_name: deliveryAddress.firstName,
        last_name: deliveryAddress.lastName,
        email: deliveryAddress.email,
        phone: deliveryAddress.phone,
        is_residential: deliveryAddress.isResidential || true,
        line1: deliveryAddress.line1,
        line2: deliveryAddress.line2 || '',
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        country: deliveryAddress.country,
        zip: deliveryAddress.zip || '',
      },
      parcel: {
        description: parcel.description,
        weight_unit: parcel.weightUnit || 'kg',
        items: parcel.items.map(item => ({
          description: item.description,
          name: item.name,
          currency: item.currency || 'NGN',
          value: item.value,
          quantity: item.quantity,
          weight: item.weight,
        })),
      },
    };

    const terminalShipment = await TerminalAfrica.createQuickShipment(quickShipmentPayload);

    // Arrange pickup
    const pickupPayload = {
      rate_id: rate.rateId,
      shipment_id: terminalShipment.data.shipment_id,
    };

    await TerminalAfrica.arrangePickup(pickupPayload);

    // Create shipment in database
    const shipment = await Shipment.create({
      user: req.user.id,
      shipmentId: terminalShipment.data.shipment_id,
      trackingNumber: terminalShipment.data.tracking_id || terminalShipment.data.shipment_id,
      status: 'pending',
      pickupAddress,
      deliveryAddress,
      parcel,
      carrier: {
        name: rate.carrierName,
        carrierId: rate.carrierId,
      },
      rate: {
        rateId: rate.rateId,
        amount: rate.amount,
        currency: rate.currency || 'NGN',
      },
      cost: rate.amount,
      isPaid: true,
      terminalShipmentId: terminalShipment.data.shipment_id,
    });

    // Deduct from wallet
    const newBalance = user.wallet.balance - rate.amount;
    user.wallet.balance = newBalance;
    await user.save();

    // Create transaction
    await Transaction.create({
      user: req.user.id,
      type: 'debit',
      amount: rate.amount,
      reference: `SHP-${Date.now()}`,
      description: `Payment for shipment ${shipment.shipmentId}`,
      status: 'success',
      paymentMethod: 'wallet',
      shipment: shipment._id,
      balanceBefore: user.wallet.balance + rate.amount,
      balanceAfter: newBalance,
    });

    res.status(201).json({
      success: true,
      shipment,
      newBalance,
    });
  } catch (error) {
    console.error('Create Shipment Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Failed to create shipment',
      error: error.response?.data || error.message
    });
  }
});

// @route   GET /api/shipments
// @desc    Get user shipments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const shipments = await Shipment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Shipment.countDocuments(query);

    res.json({
      success: true,
      shipments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get Shipments Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/shipments/:id
// @desc    Get single shipment
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    res.json({ success: true, shipment });
  } catch (error) {
    console.error('Get Shipment Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/shipments/:id/track
// @desc    Track shipment
// @access  Private
router.get('/:id/track', protect, async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    const tracking = await TerminalAfrica.trackShipment(shipment.terminalShipmentId);

    res.json({
      success: true,
      tracking: tracking.data || tracking,
    });
  } catch (error) {
    console.error('Track Shipment Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Failed to track shipment' 
    });
  }
});

// @route   PUT /api/shipments/:id/cancel
// @desc    Cancel shipment
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (shipment.status === 'delivered' || shipment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this shipment',
      });
    }

    try {
      await TerminalAfrica.cancelShipment(shipment.terminalShipmentId);
    } catch (err) {
      console.error('Terminal cancel error:', err.response?.data);
      // Continue even if Terminal Africa cancel fails
    }

    shipment.status = 'cancelled';
    await shipment.save();

    // Refund to wallet
    const user = await User.findById(req.user.id);
    const newBalance = user.wallet.balance + shipment.cost;
    user.wallet.balance = newBalance;
    await user.save();

    await Transaction.create({
      user: req.user.id,
      type: 'credit',
      amount: shipment.cost,
      reference: `REF-${Date.now()}`,
      description: `Refund for cancelled shipment ${shipment.shipmentId}`,
      status: 'success',
      paymentMethod: 'wallet',
      shipment: shipment._id,
      balanceBefore: user.wallet.balance - shipment.cost,
      balanceAfter: newBalance,
    });

    res.json({
      success: true,
      message: 'Shipment cancelled and refunded',
      shipment,
    });
  } catch (error) {
    console.error('Cancel Shipment Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to cancel shipment' });
  }
});

module.exports = router;