const express = require('express');
const Shipment = require('../models/Shipment');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get shipment counts by status
    const totalShipments = await Shipment.countDocuments({ user: req.user.id });
    const pendingShipments = await Shipment.countDocuments({ user: req.user.id, status: 'pending' });
    const inTransitShipments = await Shipment.countDocuments({ user: req.user.id, status: 'in_transit' });
    const deliveredShipments = await Shipment.countDocuments({ user: req.user.id, status: 'delivered' });

    // Get recent shipments
    const recentShipments = await Shipment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get total spent
    const totalSpent = await Transaction.aggregate([
      { $match: { user: req.user.id, type: 'debit', status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('shipment', 'shipmentId trackingNumber');

    // Get monthly shipment stats
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Shipment.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          totalCost: { $sum: '$cost' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        walletBalance: user.wallet.balance,
        totalShipments,
        pendingShipments,
        inTransitShipments,
        deliveredShipments,
        totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
        recentShipments,
        recentTransactions,
        monthlyStats,
      },
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
