import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import './AdminDashboard.css';
import { FaUsers, FaTruck, FaMoneyBillWave, FaUserCheck } from 'react-icons/fa';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';


export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/stats');
      setStats(res.data?.stats || null);
    } catch (err) {
      console.error('Fetch admin stats failed', err);
    } finally {
      setLoading(false);
    }
  };

  const monthlyData = useMemo(() => {
    if (!stats?.monthlyRevenue) return [];
    return stats.monthlyRevenue.map((m) => {
      const yy = String(m._id?.year ?? '');
      const mm = String(m._id?.month ?? '');
      const label = yy && mm ? `${yy}-${mm.padStart(2, '0')}` : '';
      return { name: label, revenue: m.revenue || 0, count: m.count || 0 };
    });
  }, [stats]);

  const statusCounts = useMemo(() => {
    const map = {};
    (stats?.shipmentsByStatus || []).forEach((s) => {
      map[s._id] = s.count;
    });
    return map;
  }, [stats]);

  const currency = (value) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'NGN' }).format(
      Number(value || 0)
    );

  return (
    <Layout>
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>

        {loading && <p>Loading...</p>}

        {!loading && stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon users"><FaUsers /></div>
                <div className="stat-content">
                  <div className="stat-label">Total Users</div>
                  <div className="stat-value">{stats.totalUsers ?? 0}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon active"><FaUserCheck /></div>
                <div className="stat-content">
                  <div className="stat-label">Active Users</div>
                  <div className="stat-value">{stats.activeUsers ?? 0}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon shipments"><FaTruck /></div>
                <div className="stat-content">
                  <div className="stat-label">Total Shipments</div>
                  <div className="stat-value">{stats.totalShipments ?? 0}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon revenue"><FaMoneyBillWave /></div>
                <div className="stat-content">
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-value">{currency(stats.totalRevenue)}</div>
                </div>
              </div>
            </div>

            <div className="status-row">
              {['draft', 'pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'].map(
                (st) => (
                  <div key={st} className={`status-badge ${st}`}>
                    <span className="name">{st.replace('_', ' ')}</span>
                    <span className="count">{statusCounts[st] || 0}</span>
                  </div>
                )
              )}
            </div>

            <div className="chart-card">
              <div className="chart-header">Revenue (last 6 months)</div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(val) => currency(val)} />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid-2">
              <div className="panel">
                <div className="panel-header">Recent Users</div>
                <div className="panel-body list">
                  {(stats.recentUsers || []).slice(0, 5).map((u) => (
                    <div key={u._id} className="list-row">
                      <div className="primary">{u.firstName} {u.lastName}</div>
                      <div className="secondary">{u.email}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel">
                <div className="panel-header">Recent Shipments</div>
                <div className="panel-body list">
                  {(stats.recentShipments || []).slice(0, 5).map((s) => (
                    <div key={s._id} className="list-row">
                      <div className="primary">#{s.trackingNumber || s.shipmentId}</div>
                      <div className={`badge ${s.status}`}>{s.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
