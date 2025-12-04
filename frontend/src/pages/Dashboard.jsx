import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaWallet, FaBox, FaClock, FaCheckCircle } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/dashboard/stats');
      setStats(res.data.stats);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      in_transit: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading dashboard...</div>
      </Layout>
    );
  }

  const chartData = stats?.monthlyStats?.map(item => ({
    month: `${item._id.month}/${item._id.year}`,
    shipments: item.count,
    spent: item.totalCost,
  })) || [];

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <Link to="/book-shipment" className="btn btn-primary">
            Book New Shipment
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#3b82f6' }}><FaWallet /></div>
            <div className="stat-content">
              <p className="stat-label">Wallet Balance</p>
              <h3 className="stat-value">{formatCurrency(stats?.walletBalance || 0)}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#6366f1' }}><FaBox /></div>
            <div className="stat-content">
              <p className="stat-label">Total Shipments</p>
              <h3 className="stat-value">{stats?.totalShipments || 0}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f59e0b' }}><FaClock /></div>
            <div className="stat-content">
              <p className="stat-label">Pending</p>
              <h3 className="stat-value">{stats?.pendingShipments || 0}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#10b981' }}><FaCheckCircle /></div>
            <div className="stat-content">
              <p className="stat-label">Delivered</p>
              <h3 className="stat-value">{stats?.deliveredShipments || 0}</h3>
            </div>
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="card chart-card">
            <h2>Shipment Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="shipments" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h2>Recent Shipments</h2>
              <Link to="/shipments" className="view-all">View All</Link>
            </div>
            {stats?.recentShipments?.length > 0 ? (
              <div className="shipments-list">
                {stats.recentShipments.map((shipment) => (
                  <Link
                    key={shipment._id}
                    to={`/shipments/${shipment._id}`}
                    className="shipment-item"
                  >
                    <div>
                      <p className="shipment-id">{shipment.shipmentId}</p>
                      <p className="shipment-route">
                        {shipment.pickupAddress.city} → {shipment.deliveryAddress.city}
                      </p>
                    </div>
                    <div className="shipment-right">
                      <span className={`badge badge-${shipment.status}`}>
                        {shipment.status.replace('_', ' ')}
                      </span>
                      <p className="shipment-amount">{formatCurrency(shipment.cost)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="empty-state">No shipments yet</p>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Recent Transactions</h2>
              <Link to="/wallet" className="view-all">View All</Link>
            </div>
            {stats?.recentTransactions?.length > 0 ? (
              <div className="transactions-list">
                {stats.recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="transaction-item">
                    <div>
                      <p className="transaction-desc">{transaction.description}</p>
                      <p className="transaction-date">{formatDate(transaction.createdAt)}</p>
                    </div>
                    <div className="transaction-right">
                      <span className={`badge badge-${transaction.type}`}>
                        {transaction.type}
                      </span>
                      <p className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === 'credit' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
