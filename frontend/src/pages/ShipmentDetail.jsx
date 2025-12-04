import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { FaMapMarkerAlt, FaBox, FaTruck, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import './ShipmentDetail.css';

export default function ShipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchShipment();
  }, [id]);

  const fetchShipment = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/shipments/${id}`);
      setShipment(res.data.shipment || res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load shipment');
    } finally {
      setLoading(false);
    }
  };

  const cancelShipment = async () => {
    if (!window.confirm('Cancel this shipment?')) return;
    try {
      await axios.post(`/api/shipments/${id}/cancel`);
      toast.success('Shipment canceled');
      navigate('/shipments');
    } catch (err) {
      toast.error('Unable to cancel shipment');
    }
  };

  if (loading) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <div className="shipment-detail">
        {!shipment ? (
          <p>Shipment not found.</p>
        ) : (
          <>
            <div className="shipment-header">
              <h1 className="shipment-title">Shipment #{shipment.trackingNumber || shipment.shipmentId || shipment._id}</h1>
              <span className={`status-badge ${shipment.status?.toLowerCase().replace('_', '-') || 'pending'}`}>
                {shipment.status?.replace('_', ' ') || 'Pending'}
              </span>
            </div>

            <div className="detail-grid">
              <div className="detail-card">
                <h3><FaMapMarkerAlt /> Addresses</h3>
                <div className="address-section">
                  <div className="address-card">
                    <div className="address-label">Pickup Address</div>
                    <div className="address-text">
                      {shipment.pickupAddress?.line1}<br />
                      {shipment.pickupAddress?.city}, {shipment.pickupAddress?.state}
                    </div>
                  </div>
                  <div className="address-card">
                    <div className="address-label">Delivery Address</div>
                    <div className="address-text">
                      {shipment.deliveryAddress?.line1}<br />
                      {shipment.deliveryAddress?.city}, {shipment.deliveryAddress?.state}
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-card">
                <h3><FaBox /> Parcel Details</h3>
                <div className="parcel-section">
                  <div className="parcel-items">
                    {shipment.parcel?.items?.map((item, i) => (
                      <div key={i} className="parcel-item">
                        <div className="parcel-item-name">{item.name} × {item.quantity}</div>
                        <div className="parcel-item-details">{item.weight}kg • {item.currency} {item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {shipment.carrier && (
                <div className="detail-card">
                  <h3><FaTruck /> Carrier Information</h3>
                  <div className="carrier-info">
                    <div>
                      <div className="carrier-name">{shipment.carrier?.name || shipment.carrierName}</div>
                      <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
                        Professional delivery service
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="detail-card">
                <h3><FaClock /> Shipment Timeline</h3>
                <div className="timeline">
                  <div className={`timeline-item ${shipment.status === 'pending' ? 'active' : 'completed'}`}>
                    <div className="timeline-content">
                      <div className="timeline-title">Order Placed</div>
                      <div className="timeline-date">{new Date(shipment.createdAt || shipment.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className={`timeline-item ${['confirmed', 'in_transit', 'delivered'].includes(shipment.status) ? 'completed' : ''} ${shipment.status === 'confirmed' ? 'active' : ''}`}>
                    <div className="timeline-content">
                      <div className="timeline-title">Order Confirmed</div>
                      <div className="timeline-date">{shipment.status !== 'pending' ? 'Completed' : 'Pending'}</div>
                    </div>
                  </div>
                  <div className={`timeline-item ${['in_transit', 'delivered'].includes(shipment.status) ? 'completed' : ''} ${shipment.status === 'in_transit' ? 'active' : ''}`}>
                    <div className="timeline-content">
                      <div className="timeline-title">In Transit</div>
                      <div className="timeline-date">{['in_transit', 'delivered'].includes(shipment.status) ? 'In Progress' : 'Pending'}</div>
                    </div>
                  </div>
                  <div className={`timeline-item ${shipment.status === 'delivered' ? 'completed' : ''}`}>
                    <div className="timeline-content">
                      <div className="timeline-title">Delivered</div>
                      <div className="timeline-date">{shipment.status === 'delivered' ? 'Completed' : 'Pending'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="actions-section">
              <div className="actions">
                {shipment.status !== 'cancelled' && shipment.status !== 'delivered' && (
                  <button className="btn btn-danger" onClick={cancelShipment}>
                    <FaTimesCircle style={{ marginRight: '0.5rem' }} />
                    Cancel Shipment
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
