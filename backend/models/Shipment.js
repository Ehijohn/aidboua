const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shipmentId: {
    type: String,
    unique: true,
  },
  trackingNumber: String,
  status: {
    type: String,
    enum: ['draft', 'pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'],
    default: 'draft',
  },
  pickupAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    country: String,
    zip: String,
  },
  deliveryAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    country: String,
    zip: String,
  },
  parcel: {
    description: String,
    weight: Number,
    weightUnit: String,
    items: [{
      name: String,
      description: String,
      quantity: Number,
      value: Number,
      currency: String,
      weight: Number,
    }],
  },
  carrier: {
    name: String,
    carrierId: String,
  },
  rate: {
    rateId: String,
    amount: Number,
    currency: String,
  },
  cost: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  terminalShipmentId: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  notes: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Shipment', shipmentSchema);
