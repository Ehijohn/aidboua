const express = require('express');
const TerminalAfrica = require('terminal-africa').default;
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/carriers
// @desc    Get available carriers
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const queryParams = req.query.page ? `?page=${req.query.page}&perPage=${req.query.perPage || 20}` : '';
    const carriers = await TerminalAfrica.getCarriers(queryParams);
    res.json({ success: true, carriers: carriers.data || carriers });
  } catch (error) {
    console.error('Get Carriers Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get carriers' });
  }
});

// @route   GET /api/carriers/:id
// @desc    Get single carrier
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const carrier = await TerminalAfrica.getCarrier(req.params.id);
    res.json({ success: true, carrier: carrier.data || carrier });
  } catch (error) {
    console.error('Get Carrier Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get carrier' });
  }
});

module.exports = router;