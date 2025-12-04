import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function WalletVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const reference = searchParams.get('reference');
      
      if (!reference) {
        setStatus('error');
        toast.error('No payment reference found');
        setTimeout(() => navigate('/wallet'), 3000);
        return;
      }

      const res = await axios.get(`/api/wallet/verify-payment/${reference}`);
      
      if (res.data.success) {
        setStatus('success');
        toast.success('Payment verified successfully!');
        
        // Refresh user data to get updated balance
        setTimeout(() => {
          // Optionally fetch updated user here
          navigate('/wallet');
        }, 2000);
      } else {
        setStatus('error');
        toast.error(res.data.message || 'Payment verification failed');
        setTimeout(() => navigate('/wallet'), 3000);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      toast.error(error.response?.data?.message || 'Failed to verify payment');
      setTimeout(() => navigate('/wallet'), 3000);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Layout>
      <div className="verify-page" style={{ padding: '40px', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {verifying ? (
          <div>
            <h2>Verifying Payment...</h2>
            <p style={{ fontSize: '14px', color: '#666' }}>Please wait while we confirm your payment</p>
            <div className="spinner" style={{ margin: '20px auto', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0366d6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : status === 'success' ? (
          <div>
            <h2 style={{ color: '#28a745' }}>✓ Payment Verified!</h2>
            <p>Your wallet has been funded successfully.</p>
            <p style={{ fontSize: '14px', color: '#666' }}>Redirecting to wallet...</p>
          </div>
        ) : (
          <div>
            <h2 style={{ color: '#dc3545' }}>✗ Payment Failed</h2>
            <p>We could not verify your payment. Please try again.</p>
            <p style={{ fontSize: '14px', color: '#666' }}>Redirecting to wallet...</p>
          </div>
        )}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Layout>
  );
}
