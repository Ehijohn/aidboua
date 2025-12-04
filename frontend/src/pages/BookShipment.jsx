
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import './BookShipment.css';
import 

function BookShipment() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [rates, setRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [country, setCountry] = useState([]);

  // Location data
  const [countries, setCountries] = useState([]);
  const [pickupStates, setPickupStates] = useState([]);
  const [pickupCities, setPickupCities] = useState([]);
  const [deliveryStates, setDeliveryStates] = useState([]);
  const [deliveryCities, setDeliveryCities] = useState([]);

  const [formData, setFormData] = useState({
    pickupAddress: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      phoneDialMode: 'list',
      phoneDialCustom: '',
      phoneDial: '',
      phoneNumber: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      zip: '',
      isResidential: true,
    },
    deliveryAddress: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      phoneDialMode: 'list',
      phoneDialCustom: '',
      phoneDial: '+234',
      phoneNumber: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      zip: '',
      isResidential: true,
    },
    parcel: {
      description: '',
      weightUnit: 'kg',
      items: [{
        name: '',
        description: '',
        quantity: '',
        value: '',
        currency: 'NGN',
        weight: '',
      }],
    },
  });
  // const fetchCountries = async () => {
  //   try {
  //     const res = await axios.get("/countries",);
  //     setCountries(res.data.countries || []);
  //     console.log(res);
  //   } catch (error) {
  //     console.error("Fetch countries error:", error);
  //   }
  // };

  const { data: Countries } = useFetch("/countries");
  console.log(Countries);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const token = import.meta.env.VITE_TERMINAL_SK;

  const fetchStates = async (countryCode, type) => {
    try {
      const res = await axios.get("/states", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { country_code: countryCode },
      });
      const states = res.data;
      console.log("states", states, countryCode, typeof countryCode);
      if (type === "pickup") {
        setPickupStates(states?.data);
        setPickupCities([]); // Reset cities when country changes
      } else {
        setDeliveryStates(states?.data);
        console.log("DeliveryStates", deliveryStates);
        setDeliveryCities([]);
      }
    } catch (error) {
      console.error("Fetch states error:", error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, [Countries]);

  const fetchCities = async (countryCode, stateCode, type) => {
    try {
      const res = await axios.get(`/cities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          country_code: countryCode,
          state_code: stateCode,
        },
      });
      const cities = res.data || [];

      console.log(res.data);
      if (type === "pickup") {
        setPickupCities(cities?.data);
      } else {
        setDeliveryCities(cities?.data);
      }
    } catch (error) {
      console.error('Fetch cities error:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get('/api/addresses');
      setAddresses(res.data.addresses);
    } catch (error) {
      console.error('Fetch addresses error:', error);
    }
  };

  const handleAddressChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));

    // Handle country/state changes to fetch dependent data
    if (field === 'country') {
      fetchStates(value, type === 'pickupAddress' ? 'pickup' : 'delivery');
      // Reset state and city when country changes
      setFormData(prev => ({
        ...prev,
        [type]: { ...prev[type], state: '', city: '' },
      }));
    } else if (field === 'state') {
      const country = formData[type].country;
      fetchCities(country, value, type === 'pickupAddress' ? 'pickup' : 'delivery');
      // Reset city when state changes
      setFormData(prev => ({
        ...prev,
        [type]: { ...prev[type], city: '' },
      }));
    }
  };

  const handlePhoneField = (type, part, value) => {
    setFormData(prev => {
      const updated = { ...prev };
      const next = { ...updated[type], [part]: value };
      const dial = next.phoneDialMode === 'custom' ? (next.phoneDialCustom || '') : (next.phoneDial || '');
      const num = next.phoneNumber || '';
      next.phone = dial && num ? `${dial}${num}` : num || '';
      updated[type] = next;
      return updated;
    });
  };

  const handleDialSelect = (type, value) => {
    setFormData(prev => {
      const updated = { ...prev };
      const next = { ...updated[type] };
      if (value === 'custom') {
        next.phoneDialMode = 'custom';
      } else {
        next.phoneDialMode = 'list';
        next.phoneDial = value;
      }
      const dial = next.phoneDialMode === 'custom' ? (next.phoneDialCustom || '') : (next.phoneDial || '');
      const num = next.phoneNumber || '';
      next.phone = dial && num ? `${dial}${num}` : num || '';
      updated[type] = next;
      return updated;
    });
  };

  const handleParcelChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      parcel: { ...prev.parcel, [field]: value },
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.parcel.items];
    newItems[index][field] = value;
    setFormData(prev => ({
      ...prev,
      parcel: { ...prev.parcel, items: newItems },
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      parcel: {
        ...prev.parcel,
        items: [...prev.parcel.items, {
          name: '',
          description: '',
          quantity: '',
          value: '',
          currency: 'NGN',
          weight: '',
        }],
      },
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      parcel: {
        ...prev.parcel,
        items: prev.parcel.items.filter((_, i) => i !== index),
      },
    }));
  };

  const useAddressTemplate = (type, addressId) => {
    const address = addresses.find(a => a._id === addressId);
    if (address) {
      // try to split phone into dial and number parts
      const phoneRaw = address.phone || '';
      let dial = '+234';
      let number = '';
      const m = phoneRaw.match(/^(\+\d{1,4})(\d+)$/);
      if (m) {
        dial = m[1];
        number = m[2];
      } else {
        number = phoneRaw;
      }
      const inList = phoneDialCodes.some(c => c.dial === dial);

      setFormData(prev => ({
        ...prev,
        [type]: {
          firstName: address.firstName,
          lastName: address.lastName,
          email: address.email,
          phone: address.phone,
          phoneDialMode: inList ? 'list' : 'custom',
          phoneDialCustom: inList ? '' : dial,
          phoneDial: inList ? dial : '',
          phoneNumber: number,
          line1: address.line1,
          line2: address.line2 || '',
          city: address.city,
          state: address.state,
          country: address.country,
          zip: address.zip || '',
          isResidential: address.isResidential,
        },
      }));
    }
  };

  const getRates = async () => {
    setLoading(true);
    try {
      const payload = buildRatePayload();
      const res = await axios.post('/api/shipments/get-rates', payload);
      setRates(res.data.rates || res.data);
      setStep(3);
      toast.success('Rates fetched successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to get rates');
    } finally {
      setLoading(false);
    }
  };

  const createShipment = async () => {
    if (!selectedRate) {
      toast.error('Please select a shipping rate');
      return;
    }

    if (user.wallet.balance < selectedRate.amount) {
      toast.error('Insufficient wallet balance. Please fund your wallet.');
      return;
    }

    setLoading(true);
    try {
      const payload = buildRatePayload();
      const res = await axios.post('/api/shipments/create', {
        ...payload,
        rate: selectedRate,
      });

      updateUser({ wallet: { balance: res.data.newBalance } });
      toast.success('Shipment created successfully!');
      navigate(`/shipments/${res.data.shipment._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  // Build payload for rate/creation endpoints — replace state codes with state names
  const buildRatePayload = () => {
    const payload = JSON.parse(JSON.stringify(formData));

    const getStateName = (countryCode, stateCode, type) => {
      const list = type === 'pickupAddress' ? pickupStates : deliveryStates;
      const found = list.find(s => s.isoCode === stateCode || s.code === stateCode || s.name === stateCode);
      return found ? found.name : stateCode;
    };

    // normalize pickup
    if (payload.pickupAddress) {
      const p = payload.pickupAddress;
      p.state = getStateName(p.country, p.state, 'pickupAddress');
      const dial = p.phoneDialMode === 'custom' ? (p.phoneDialCustom || '') : (p.phoneDial || '');
      if (dial || p.phoneNumber) {
        p.phone = `${dial}${p.phoneNumber || ''}`.trim();
      }
    }

    // normalize delivery
    if (payload.deliveryAddress) {
      const d = payload.deliveryAddress;
      d.state = getStateName(d.country, d.state, 'deliveryAddress');
      const dial = d.phoneDialMode === 'custom' ? (d.phoneDialCustom || '') : (d.phoneDial || '');
      if (dial || d.phoneNumber) {
        d.phone = `${dial}${d.phoneNumber || ''}`.trim();
      }
    }

    return payload;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <Layout>
      <div className="book-shipment">
        <div className="book-header">
          <h1>Book a Shipment</h1>
          <div className="steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Addresses</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Parcel Details</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Select Rate</div>
          </div>
        </div>

        {step === 1 && (
          <div className="step-content">
            <div className="address-grid">
              <div className="card">
                <h2>Pickup Address</h2>
                {addresses.length > 0 && (
                  <div className="address-select">
                    <label>Use saved address:</label>
                    <select onChange={(e) => useAddressTemplate('pickupAddress', e.target.value)}>
                      <option value="">Select an address</option>
                      {addresses.map(addr => (
                        <option key={addr._id} value={addr._1d}>
                          {addr.firstName} {addr.lastName} - {addr.city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-grid">
                  <input
                    type="text"
                    className="input"
                    placeholder="First Name"
                    value={formData.pickupAddress.firstName}
                    onChange={(e) => handleAddressChange('pickupAddress', 'firstName', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Last Name"
                    value={formData.pickupAddress.lastName}
                    onChange={(e) => handleAddressChange('pickupAddress', 'lastName', e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={formData.pickupAddress.email}
                    onChange={(e) => handleAddressChange('pickupAddress', 'email', e.target.value)}
                    required
                  />
                  <div className="phone-input">
                    <div className="dial-mode-group">
                      <select
                        className="input dial-select"
                        value={formData.pickupAddress.phoneDialMode === 'custom' ? 'custom' : formData.pickupAddress.phoneDial}
                        onChange={(e) => handleDialSelect('pickupAddress', e.target.value)}
                      >
                        <option value="">Select Code</option>
                        {phoneDialCodes.map(code => (
                          <option key={code.dial} value={code.dial}>{code.label} {code.dial}</option>
                        ))}
                        <option value="custom">Custom code…</option>
                      </select>
                      {formData.pickupAddress.phoneDialMode === 'custom' && (
                        <input
                          type="text"
                          className="input custom-dial-input"
                          placeholder="e.g. +900"
                          value={formData.pickupAddress.phoneDialCustom}
                          onChange={(e) => handlePhoneField('pickupAddress', 'phoneDialCustom', e.target.value)}
                        />
                      )}
                    </div>
                    <input
                      type="tel"
                      className="input"
                      placeholder="Phone number"
                      value={formData.pickupAddress.phoneNumber}
                      onChange={(e) => handlePhoneField('pickupAddress', 'phoneNumber', e.target.value)}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    className="input full-width"
                    placeholder="Address Line 1"
                    value={formData.pickupAddress.line1}
                    onChange={(e) => handleAddressChange('pickupAddress', 'line1', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="input full-width"
                    placeholder="Address Line 2 (Optional)"
                    value={formData.pickupAddress.line2}
                    onChange={(e) => handleAddressChange('pickupAddress', 'line2', e.target.value)}
                  />
                  
                  <select
                    className="input"
                    value={formData.pickupAddress.country}
                    onChange={(e) => handleAddressChange('pickupAddress', 'country', e.target.value)}
                    required
                  >
                    <option value="">Select Country</option>
                    {/* Use Array.isArray() for robust type checking */}
                    {Array.isArray(Countries) &&
                      Countries.map((country) => (
                        <option
                          key={country.country_id || country.code}
                          value={country.isoCode || country.code}
                        >
                          {country.label || country.name}
                        </option>
                      ))}
                  </select>

                  <select
                    className="input"
                    value={formData.pickupAddress.state}
                    onChange={(e) => handleAddressChange('pickupAddress', 'state', e.target.value)}
                    required
                    disabled={!pickupStates.length}
                  >
                    <option value="">Select State</option>
                    {pickupStates.map(state => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="input"
                    value={formData.pickupAddress.city}
                    onChange={(e) => handleAddressChange('pickupAddress', 'city', e.target.value)}
                    required
                    disabled={!pickupCities.length}
                  >
                    <option value="">Select City</option>
                    {pickupCities.map(city => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    className="input"
                    placeholder="ZIP/Postal Code (Optional)"
                    value={formData.pickupAddress.zip}
                    onChange={(e) => handleAddressChange('pickupAddress', 'zip', e.target.value)}
                  />
                </div>
              </div>

              <div className="card">
                <h2>Delivery Address</h2>
                {addresses.length > 0 && (
                  <div className="address-select">
                    <label>Use saved address:</label>
                    <select onChange={(e) => useAddressTemplate('deliveryAddress', e.target.value)}>
                      <option value="">Select an address</option>
                      {addresses.map(addr => (
                        <option key={addr._id} value={addr._id}>
                          {addr.firstName} {addr.lastName} - {addr.city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-grid">
                  <input
                    type="text"
                    className="input"
                    placeholder="First Name"
                    value={formData.deliveryAddress.firstName}
                    onChange={(e) => handleAddressChange('deliveryAddress', 'firstName', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Last Name"
                    value={formData.deliveryAddress.lastName}
                    onChange={(e) => handleAddressChange('deliveryAddress', 'lastName', e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={formData.deliveryAddress.email}
                    onChange={(e) => handleAddressChange('deliveryAddress', 'email', e.target.value)}
                    required
                  />
                  <div className="phone-input">
                    <div className="dial-mode-group">
                      <select
                        className="input dial-select"
                        value={formData.deliveryAddress.phoneDialMode === 'custom' ? 'custom' : formData.deliveryAddress.phoneDial}
                        onChange={(e) => handleDialSelect('deliveryAddress', e.target.value)}
                      >
                        <option value="">Select Code</option>
                        {phoneDialCodes.map(code => (
                          <option key={code.dial} value={code.dial}>{code.label} {code.dial}</option>
                        ))}
                        <option value="custom">Custom code…</option>
                      </select>
                      {formData.deliveryAddress.phoneDialMode === 'custom' && (
                        <input
                          type="text"
                          className="input custom-dial-input"
                          placeholder="e.g. +900"
                          value={formData.deliveryAddress.phoneDialCustom}
                          onChange={(e) => handlePhoneField('deliveryAddress', 'phoneDialCustom', e.target.value)}
                        />
                      )}
                    </div>
                    <input
                      type="tel"
                      className="input"
                      placeholder="Phone number"
                      value={formData.deliveryAddress.phoneNumber}
                      onChange={(e) => handlePhoneField('deliveryAddress', 'phoneNumber', e.target.value)}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    className="input full-width"
                    placeholder="Address Line 1"
                    value={formData.deliveryAddress.line1}
                    onChange={(e) => handleAddressChange('deliveryAddress', 'line1', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="input full-width"
                    placeholder="Address Line 2 (Optional)"
                    value={formData.deliveryAddress.line2}
                    onChange={(e) => handleAddressChange('deliveryAddress', 'line2', e.target.value)}
                  />
                  
                  <select
                    className="input"
                    value={formData.deliveryAddress.country}
                    onChange={(e) => handleAddressChange('deliveryAddress', 'country', e.target.value)}
                    required
                  >
                    <option value="">Select Country</option>
                    {Array.isArray(countries) &&
                     countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="input"
                    value={formData.deliveryAddress.state}
                    onChange={(e) => handleAddressChange('deliveryAddress', 'state', e.target.value)}
                    required
                    disabled={!deliveryStates?.length}
                  >
                    <option value="">Select State</option>
                    {deliveryStates.map(state => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="input"
                    value={formData.deliveryAddress.city}
                    onChange={(e) => handleAddressChange('deliveryAddress', 'city', e.target.value)}
                    required
                    disabled={!deliveryCities.length}
                  >
                    <option value="">Select City</option>
                    {deliveryCities.map(city => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    className="input"
                    placeholder="ZIP/Postal Code (Optional)"
                    value={formData.deliveryAddress.zip}
                    onChange={(e) => handleAddressChange('deliveryAddress', 'zip', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="step-actions">
              <button className="btn btn-primary" onClick={() => setStep(2)}>
                Next: Parcel Details
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <div className="card">
              <h2>Parcel Information</h2>
              <div className="form-group">
                <label>Package Description</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Electronics, Clothing, Documents"
                  value={formData.parcel.description}
                  onChange={(e) => handleParcelChange('description', e.target.value)}
                  required
                />
              </div>

              <h3>Items</h3>
              {formData.parcel.items.map((item, index) => (
                <div key={index} className="item-card">
                  <div className="item-header">
                    <h4>Item {index + 1}</h4>
                    {formData.parcel.items.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="form-grid">
                    <input
                      type="text"
                      className="input"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="input"
                      placeholder="Item Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      className="input"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                      min="0"
                      required
                    />
                    <input
                      type="number"
                      className="input"
                      placeholder="Value (NGN)"
                      value={item.value}
                      onChange={(e) => handleItemChange(index, 'value', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                      min="0"
                      required
                    />
                    <input
                      type="number"
                      className="input"
                      placeholder="Weight (kg)"
                      value={item.weight}
                      onChange={(e) => handleItemChange(index, 'weight', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                      min="0.1"
                      step="0.1"
                      required
                    />
                  </div>
                </div>
              ))}

              <button type="button" className="btn btn-secondary" onClick={addItem}>
                + Add Another Item
              </button>
            </div>

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={getRates} disabled={loading}>
                {loading ? 'Getting Rates...' : 'Get Shipping Rates'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <div className="card">
              <h2>Select Shipping Rate</h2>
              <div className="wallet-balance">
                <span>Your Wallet Balance:</span>
                <strong>{formatCurrency(user?.wallet?.balance || 0)}</strong>
              </div>

              {rates.length > 0 ? (
                <div className="rates-list">
                  {rates.map((rate, index) => (
                    <div
                      key={rate.id || index}
                      className={`rate-card ${selectedRate?.id === rate.id ? 'selected' : ''}`}
                      onClick={() => setSelectedRate({
                        id: rate.id,
                        amount: rate.amount,
                        currency: rate.currency,
                        carrierName: rate.carrier_name,
                        carrierSlug: rate.carrier_slug,
                        carrierId: rate.carrier_reference,
                        deliveryTime: rate.delivery_time,
                        pickupTime: rate.pickup_time,
                      })}
                    >
                      <div className="rate-info">
                        {rate.carrier_logo && (
                          <img src={rate.carrier_logo} alt={rate.carrier_name} className="carrier-logo" />
                        )}
                        <h3>{rate.carrier_name}</h3>
                        <p className="rate-duration">{rate.carrier_rate_description || 'Standard Delivery'}</p>
                        <p className="rate-eta">Pickup: {rate.pickup_time} | Delivery: {rate.delivery_time}</p>
                      </div>
                      <div className="rate-price">
                        <span className="amount">{formatCurrency(rate.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No rates available</p>
              )}
            </div>

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button
                className="btn btn-success"
                onClick={createShipment}
                disabled={!selectedRate || loading}
              >
                {loading ? 'Creating Shipment...' : 'Confirm & Book Shipment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BookShipment;
