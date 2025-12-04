import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import './Shipments.css';

export default function Shipments() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/shipments');
      setShipments(res.data.shipments || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="shipments-page">
        <div className="page-header">
          <h1>Your Shipments</h1>
        </div>

        {loading ? (
          <p>Loading shipments...</p>
        ) : shipments.length === 0 ? (
          <p>No shipments yet. <Link to="/book">Book your first shipment</Link></p>
        ) : (
          <div className="shipments-list">
            {shipments.map(s => (
              <Link key={s._id || s.id} to={`/shipments/${s._id || s.id}`} className="shipment-card">
                <div className="meta">
                  <div>
                    <div className="tracking-number">#{s.trackingNumber || s.shipmentId || s._id}</div>
                    <div className="date">{new Date(s.createdAt || s.date).toLocaleDateString()}</div>
                  </div>
                  <span className={`status ${s.status?.toLowerCase().replace('_', '-') || 'pending'}`}>
                    {s.status?.replace('_', ' ') || 'Pending'}
                  </span>
                </div>
                <div className="route">
                  <span className="route-location">{s.pickupAddress?.city || s.pickup?.city || 'Pickup'}</span>
                  <span className="route-arrow">→</span>
                  <span className="route-location">{s.deliveryAddress?.city || s.delivery?.city || 'Delivery'}</span>
                </div>
                <div className="cost">
                  {s.rate ? `${s.rate.currency || 'NGN'} ${s.rate.amount}` : 'Pending'}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
