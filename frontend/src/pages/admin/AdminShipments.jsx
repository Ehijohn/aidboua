import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import './AdminShipments.css';
import { Link } from 'react-router-dom';

const STATUSES = ['draft', 'pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'];

export default function AdminShipments() {
  const [shipments, setShipments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments(1, status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchShipments = async (page = 1, stat = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(pagination.limit || 20));
      if (stat) params.set('status', stat);
      const res = await axios.get(`/api/admin/shipments?${params.toString()}`);
      setShipments(res.data?.shipments || []);
      setPagination(res.data?.pagination || { page, pages: 1, total: 0, limit: 20 });
    } catch (e) {
      console.error('Fetch shipments failed', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return shipments;
    return shipments.filter((s) => {
      const id = (s.trackingNumber || s.shipmentId || '').toLowerCase();
      const email = (s.user?.email || '').toLowerCase();
      return id.includes(q) || email.includes(q);
    });
  }, [shipments, search]);

  const currency = (value) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'NGN' }).format(
      Number(value || 0)
    );

  const goPage = (p) => {
    const next = Math.min(Math.max(1, p), pagination.pages || 1);
    if (next !== pagination.page) fetchShipments(next, status);
  };

  return (
    <Layout>
      <div className="admin-shipments">
        <h1>Shipments</h1>

        <div className="controls">
          <div className="control-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="control-group grow">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by tracking number or user email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table className="ship-table">
            <thead>
              <tr>
                <th>Tracking</th>
                <th>User</th>
                <th>From → To</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>Loading...</td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No shipments</td>
                </tr>
              )}
              {!loading &&
                filtered.map((s) => {
                  const tracking = s.trackingNumber || s.shipmentId || '';
                  const user = s.user ? `${s.user.firstName || ''} ${s.user.lastName || ''}`.trim() : '';
                  const email = s.user?.email || '';
                  const from = `${s.pickupAddress?.city || ''}, ${s.pickupAddress?.country || ''}`;
                  const to = `${s.deliveryAddress?.city || ''}, ${s.deliveryAddress?.country || ''}`;
                  const created = s.createdAt ? new Date(s.createdAt).toLocaleString() : '';
                  return (
                    <tr key={s._id}>
                      <td className="mono">#{tracking}</td>
                      <td>
                        <div className="cell-main">{user || '—'}</div>
                        <div className="cell-sub">{email}</div>
                      </td>
                      <td>
                        <div className="cell-main">{from}</div>
                        <div className="cell-sub">→ {to}</div>
                      </td>
                      <td>
                        <span className={`badge ${s.status}`}>{s.status}</span>
                      </td>
                      <td className="mono">{currency(s.cost)}</td>
                      <td className="mono">{created}</td>
                      <td>
                        <Link className="btn-link" to={`/shipments/${s._id}`}>View</Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="pager">
          <button className="btn" disabled={pagination.page <= 1} onClick={() => goPage((pagination.page || 1) - 1)}>
            Prev
          </button>
          <div className="pager-info">
            Page {pagination.page || 1} of {pagination.pages || 1}
          </div>
          <button
            className="btn"
            disabled={(pagination.page || 1) >= (pagination.pages || 1)}
            onClick={() => goPage((pagination.page || 1) + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}
