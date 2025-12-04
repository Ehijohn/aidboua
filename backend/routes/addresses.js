const express = require('express');
const TerminalAfrica = require('terminal-africa').default;
const Address = require('../models/Address');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/addresses/countries
// @desc    Get countries
// @access  Private
router.get('/countries', protect, async (req, res) => {
  try {
    const countries = await terminal.countries();
    res.json({ success: true, countries: countries.data || countries });
  } catch (error) {
    console.error('Get Countries Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get countries' });
  }
});


// @route   GET /api/addresses/states/:country
// @desc    Get states in a country
// @access  Private
router.get('/states/:country', protect, async (req, res) => {
  try {
    const states = await terminal.states(req.params.country);
    res.json({ success: true, states: states.data || states });
  } catch (error) {
    console.error('Get States Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get states' });
  }
});


// @route   GET /api/addresses/cities/:country
// @desc    Get cities in a country
// @access  Private
router.get('/cities/:country', protect, async (req, res) => {
  try {
    const state = req.query.state;
    const cities = state 
      ? await TerminalAfrica.cities(req.params.country, state)
      : await TerminalAfrica.cities(req.params.country);
    res.json({ success: true, cities: cities.data || cities });
  } catch (error) {
    console.error('Get Cities Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get cities' });
  }
});

// @route   POST /api/addresses
// @desc    Create new address
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const addressPayload = {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      is_residential: req.body.isResidential || true,
      line1: req.body.line1,
      line2: req.body.line2 || '',
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zip: req.body.zip || '',
    };

    let terminalAddressId = null;
    try {
      const terminalAddress = await TerminalAfrica.createAddress(addressPayload);
      terminalAddressId = terminalAddress.data.address_id;
    } catch (err) {
      console.error('Terminal address creation error:', err.response?.data);
      // Continue without Terminal address ID
    }

    const address = await Address.create({
      user: req.user.id,
      terminalAddressId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      line1: req.body.line1,
      line2: req.body.line2 || '',
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zip: req.body.zip || '',
      isResidential: req.body.isResidential || true,
      label: req.body.label || 'home',
    });

    res.status(201).json({ success: true, address });
  } catch (error) {
    console.error('Create Address Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to create address' });
  }
});

// @route   GET /api/addresses
// @desc    Get user addresses
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, addresses });
  } catch (error) {
    console.error('Get Addresses Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/addresses/:id
// @desc    Get single address
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    res.json({ success: true, address });
  } catch (error) {
    console.error('Get Address Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/addresses/:id
// @desc    Update address
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const addressPayload = {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      is_residential: req.body.isResidential || true,
      line1: req.body.line1,
      line2: req.body.line2 || '',
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zip: req.body.zip || '',
    };

    if (address.terminalAddressId) {
      try {
        await TerminalAfrica.updateAddress(address.terminalAddressId, addressPayload);
      } catch (err) {
        console.error('Terminal update error:', err.response?.data);
        // Continue even if Terminal update fails
      }
    }

    address = await Address.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        line1: req.body.line1,
        line2: req.body.line2 || '',
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        zip: req.body.zip || '',
        isResidential: req.body.isResidential || true,
        label: req.body.label || address.label,
      },
      { new: true }
    );

    res.json({ success: true, address });
  } catch (error) {
    console.error('Update Address Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to update address' });
  }
});

// @route   DELETE /api/addresses/:id
// @desc    Delete address
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    await address.deleteOne();

    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    console.error('Delete Address Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/addresses/:id/set-default
// @desc    Set default address
// @access  Private
router.put('/:id/set-default', protect, async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    await Address.updateMany({ user: req.user.id }, { isDefault: false });
    address.isDefault = true;
    await address.save();

    res.json({ success: true, address });
  } catch (error) {
    console.error('Set Default Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
