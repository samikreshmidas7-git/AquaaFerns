import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PublicHome from './pages/PublicHome';
import Dashboard from './pages/Dashboard';
import ProductEntry from './pages/ProductEntry';
import DamageEntry from './pages/DamageEntry';
import Products from './pages/Products';
import ProductList from './pages/ProductList';
import Sales from './pages/Sales';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerPoints from './pages/CustomerPoints';
function App() {
  return (
    <AuthProvider>
      <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/public" element={<PublicHome />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/product-entry" element={<ProtectedRoute><ProductEntry /></ProtectedRoute>} />
          <Route path="/damage-entry" element={<ProtectedRoute><DamageEntry /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
          <Route path="/customer-points" element={<ProtectedRoute><CustomerPoints /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
