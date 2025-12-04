import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { FaWallet, FaPlus, FaHistory } from 'react-icons/fa';
import './Wallet.css';

export default function Wallet() {
  const { user, updateUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/wallet/transactions');
      setTransactions(res.data.transactions || res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const fund = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return toast.error('Enter a valid amount');
    setLoading(true);
    try {
      const res = await axios.post('/api/wallet/initialize-payment', { amount: amt });
      // redirect to payment
      window.location.href = res.data.data.authorization_url;
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  return (
    <Layout>
      <div className="wallet-container">
        {/* Header Section */}
        <div className="wallet-header">
          <div className="header-content">
            <div className="header-icon">
              <FaWallet />
            </div>
            <div className="header-text">
              <h1>Wallet</h1>
              <p>Manage your funds and view transaction history</p>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="balance-card">
          <div className="card-content">
            <div className="balance-icon">
              <FaWallet />
            </div>
            <div className="balance-details">
              <span className="balance-label">Available Balance</span>
              <span className="balance-amount">{formatCurrency(user?.wallet?.balance)}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="action-card">
            <div className="action-icon">
              <FaPlus />
            </div>
            <div className="action-content">
              <h3>Add Funds</h3>
              <p>Top up your wallet instantly</p>
              <div className="action-form">
                <div className="input-wrapper">
                  <span className="currency-symbol">₦</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                  />
                </div>
                <button
                  className="action-btn"
                  onClick={fund}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Add Funds'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="transactions-section">
          <div className="section-header">
            <FaHistory />
            <h2>Recent Transactions</h2>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaHistory />
              </div>
              <h3>No transactions yet</h3>
              <p>Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.slice(0, 10).map(t => (
                <div key={t._id || t.reference} className="transaction-row">
                  <div className="transaction-main">
                    <div className="transaction-icon">
                      {t.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-title">
                        {t.type === 'credit' ? 'Money Received' : 'Money Sent'}
                      </div>
                      <div className="transaction-meta">
                        {t.description || 'Wallet transaction'} • {new Date(t.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="transaction-amount">
                    <span className={`amount ${t.type}`}>
                      {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                    <span className={`status-badge ${t.status}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
