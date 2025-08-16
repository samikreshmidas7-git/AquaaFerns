
import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Paper
} from '@mui/material';
import { fetchApi } from '../utils/api';
const DamageEntry = () => {
  const [productOptions, setProductOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [autoAdjust, setAutoAdjust] = useState(true);
  const [damageEntries, setDamageEntries] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');

  // Fetch product options from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchApi('/products');
        setProductOptions(data.map(p => ({
          label: p.name,
          productId: p.productId || p.id,
          quantity: p.quantity
        })));
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch all damage entries from backend
  useEffect(() => {
    const fetchDamages = async () => {
      try {
        const data = await fetchApi('/damage');
        setDamageEntries(data);
      } catch (err) {
        console.error('Failed to fetch damages:', err);
      }
    };
    fetchDamages();
  }, []);

  // Submit damage entry to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const selectedProduct = productOptions.find(p => p.label === product);
      if (!selectedProduct) throw new Error('Product not selected');
      if (Number(quantity) > selectedProduct.quantity) {
        alert(`Quantity is not that much available. Available: ${selectedProduct.quantity}`);
        setLoading(false);
        return;
      }
      const payload = {
        productId: selectedProduct.productId,
        damagedQuantity: Number(quantity),
        autoAdjust,
      };
      await fetchApi('/damage', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      alert('Damage entry saved successfully!');
      setProduct('');
      setQuantity('');
      setNotes('');
      setAutoAdjust(true);
      // Refresh damage entries
      const updated = await fetchApi('/damage');
      setDamageEntries(updated);
    } catch (err) {
      alert('Error saving damage entry: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtering logic
  const filterByDate = (entry) => {
    if (!dateFilter) return true;
    const entryDate = new Date(entry.createdAt || entry.date || entry._id?.getTimestamp?.() || 0);
    const filterDate = new Date(dateFilter);
    return (
      entryDate.getFullYear() === filterDate.getFullYear() &&
      entryDate.getMonth() === filterDate.getMonth() &&
      entryDate.getDate() === filterDate.getDate()
    );
  };
  const filterByPeriod = (entry) => {
    if (periodFilter === 'all') return true;
    const entryDate = new Date(entry.createdAt || entry.date || entry._id?.getTimestamp?.() || 0);
    const now = new Date();
    if (periodFilter === 'weekly') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return entryDate >= weekAgo && entryDate <= now;
    }
    if (periodFilter === 'monthly') {
      return (
        entryDate.getFullYear() === now.getFullYear() &&
        entryDate.getMonth() === now.getMonth()
      );
    }
    if (periodFilter === 'yearly') {
      return entryDate.getFullYear() === now.getFullYear();
    }
    return true;
  };

  return (
    <MainLayout>
      <Box component="form" onSubmit={handleSubmit} sx={{ 
          maxWidth: 500, 
          mx: 'auto', 
          mt: 6, 
          mb: 4, 
          borderRadius: 2, 
          boxShadow: 2, 
          p: { xs: 2, md: 4 },
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Damage Entry
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              label="Select Product"
              value={product}
              onChange={e => setProduct(e.target.value)}
              SelectProps={{ native: true }}
              fullWidth
              size="small"
              required
              disabled={loading}
            >
              <option value="">Select</option>
              {productOptions.map(opt => (
                <option key={opt.productId || opt.label} value={opt.label}>{opt.label} (Stock: {opt.quantity})</option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Quantity Damaged"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              fullWidth
              size="small"
              type="number"
              required
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={3}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={autoAdjust}
                  onChange={e => setAutoAdjust(e.target.checked)}
                  color="primary"
                  disabled={loading}
                />
              }
              label="Auto-adjust selling price to recover loss"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ fontWeight: 600 }}
              type="submit"
              disabled={loading}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
      {/* Table of damage entries */}
      <Box sx={{ 
          maxWidth: 900, 
          mx: 'auto', 
          mt: 4, 
          mb: 4, 
          borderRadius: 2, 
          boxShadow: 2, 
          p: { xs: 2, md: 4 },
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Damage Entries
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            type="date"
            label="Filter by Date"
            InputLabelProps={{ shrink: true }}
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            size="small"
          />
          <TextField
            select
            label="Period"
            value={periodFilter}
            onChange={e => setPeriodFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <option value="all">All</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </TextField>
        </Box>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Product</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Quantity</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Notes</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Auto Adjust</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {damageEntries
                .filter(filterByDate)
                .filter(filterByPeriod)
                .map((entry) => (
                  <tr key={entry._id}>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{entry.productName}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{entry.damagedQuantity || entry.quantity}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{entry.notes || ''}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{entry.autoAdjust ? 'Yes' : 'No'}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{
                      entry.createdAt
                        ? new Date(entry.createdAt).toLocaleString()
                        : entry._id && entry._id.getTimestamp
                        ? new Date(entry._id.getTimestamp()).toLocaleString()
                        : ''
                    }</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default DamageEntry;
