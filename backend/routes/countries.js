// routes/countries.js
const express = require('express');
const router = express.Router();

// A simple in-memory list of countries for demonstration
const countryList = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'IE', name: 'Ireland' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'RU', name: 'Russia' },
  { code: 'BR', name: 'Brazil' },
  { code: 'AR', name: 'Argentina' },
  { code: 'MX', name: 'Mexico' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'TR', name: 'Turkey' },
  { code: 'IT', name: 'Italy'},
  { code: 'ES', name: 'Spain'},
  { code: 'NL', name: 'Netherlands'},
  { code: 'BE', name: 'Belgium'},
  { code: 'CH', name: 'Switzerland'},
  { code: 'SE', name: 'Sweden'},
  { code: 'NO', name: 'Norway'},
  { code: 'DK', name: 'Denmark'},
  { code: 'FI', name: 'Finland'},
  { code: 'PL', name: 'Poland'},
  { code: 'PT', name: 'Portugal'},
  { code: 'GR', name: 'Greece'},
  { code: 'KR', name: 'South Korea' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  // Add all other countries your app needs here
];

router.get('/', (req, res) => {
  // This route handles GET requests to the base path it is mounted on
  res.status(200).json(countryList);
});

module.exports = router;
