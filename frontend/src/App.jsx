import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import BookShipment from './pages/BookShipment';
import Shipments from './pages/Shipments';
import ShipmentDetail from './pages/ShipmentDetail';
import Wallet from './pages/Wallet';
import WalletVerify from './pages/WalletVerify';
import Article from './pages/Article';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminShipments from './pages/admin/AdminShipments';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }
  return children;
  // return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }
  
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/book-shipment" element={<PrivateRoute><BookShipment /></PrivateRoute>} />
          <Route path="/shipments" element={<PrivateRoute><Shipments /></PrivateRoute>} />
          <Route path="/shipments/:id" element={<PrivateRoute><ShipmentDetail /></PrivateRoute>} />
          <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
          <Route path="/wallet/verify" element={<PrivateRoute><WalletVerify /></PrivateRoute>} />
          <Route path="/article" element={<Article />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/shipments" element={<AdminRoute><AdminShipments /></AdminRoute>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
