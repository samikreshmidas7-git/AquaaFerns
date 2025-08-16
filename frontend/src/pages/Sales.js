
import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  Divider,
  Autocomplete
} from '@mui/material';
import { fetchApi } from '../utils/api';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const initialProduct = {
  productName: '',
  defaultSellingPrice: '',
  actualSellingPrice: '',
  quantity: '',
  stock: '',
  productId: '',
};

const Sales = () => {
  const [productOptions, setProductOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([{ ...initialProduct }]);
  const [customerName, setCustomerName] = useState('');
  const [saleDate, setSaleDate] = useState(new Date());

  // Fetch product options from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchApi('/products');
        setProductOptions(data.map(p => ({
          label: `${p.productId ? p.productId : ''} - ${p.name}`,
          name: p.name,
          defaultPrice: p.sellingPrice,
          buyingPrice: p.buyingPrice,
          productId: p.productId || p.id,
          stock: p.quantity || 0,
        })));
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Calculate total
  const totalAmount = products.reduce((sum, p) => {
    const price = parseFloat(p.actualSellingPrice || p.defaultSellingPrice || 0);
    const qty = parseFloat(p.quantity || 0);
    return sum + price * qty;
  }, 0);

  // Add new product row
  const handleAddProduct = () => {
    setProducts([...products, { ...initialProduct }]);
  };

  // Remove product row
  const handleRemoveProduct = (idx) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  // Update product field
  const handleProductChange = (idx, field, value) => {
    setProducts(products.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    ));
  };

  // When product is selected, auto-fill default price
  const handleProductSelect = (idx, value) => {
    const found = productOptions.find(opt => (opt.productId === value?.productId));
    setProducts(products.map((p, i) =>
      i === idx
        ? {
            ...p,
            productName: found ? found.name : '',
            defaultSellingPrice: found ? found.defaultPrice : '',
            actualSellingPrice: found ? found.defaultPrice : '',
            stock: found ? found.stock : '',
            productId: found ? found.productId : '',
          }
        : p
    ));
  };

  // Submit sale to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const salePayload = {
        customerName,
        saleDate: saleDate ? new Date(saleDate).toISOString() : new Date().toISOString(),
        products: products.map(p => {
          const found = productOptions.find(opt => opt.productId === p.productId);
          return {
            productId: p.productId || (found ? found.productId : ''),
            productName: p.productName,
            actualSellingPrice: Number(p.actualSellingPrice),
            quantity: Number(p.quantity),
            defaultSellingPrice: found ? found.defaultPrice : '',
            buyingPrice: found && typeof found.buyingPrice !== 'undefined' ? Number(found.buyingPrice) : '',
          };
        }),
        totalAmount,
      };
      await fetchApi('/sales', {
        method: 'POST',
        body: JSON.stringify(salePayload)
      });
      alert('Sale saved successfully!');
      // Optionally clear form
      setProducts([{ ...initialProduct }]);
      setCustomerName('');
      setSaleDate(new Date());
    } catch (err) {
      alert('Error saving sale: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <MainLayout>
      <Box component="form" onSubmit={handleSubmit} sx={{ 
          maxWidth: 700, 
          mx: 'auto', 
          mt: 4, 
          mb: 4, 
          borderRadius: 2, 
          boxShadow: 2, 
          p: { xs: 2, md: 4 },
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Sell Item
        </Typography>
        {products.map((product, idx) => (
          <Grid container spacing={2} alignItems="center" key={idx} sx={{ mb: 1 }}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={productOptions}
                getOptionLabel={option => option.label || ''}
                value={productOptions.find(opt => opt.productId === product.productId) || null}
                onChange={(_, value) => handleProductSelect(idx, value)}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Product"
                    required
                    fullWidth
                    size="small"
                  />
                )}
                isOptionEqualToValue={(option, value) => option.name === value.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Default Selling Price"
                value={product.defaultSellingPrice}
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Actual Selling Price"
                value={product.actualSellingPrice}
                onChange={e => handleProductChange(idx, 'actualSellingPrice', e.target.value)}
                fullWidth
                size="small"
                type="number"
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  value={(() => {
                    const found = productOptions.find(opt => opt.productId === product.productId);
                    return found ? `Current stock: ${found.stock}` : '';
                  })()}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true, style: { color: '#1976d2', fontWeight: 600 } }}
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Quantity Sold"
                  value={product.quantity}
                  onChange={e => {
                    const val = e.target.value;
                    if (val && Number(val) > Number(product.stock)) {
                      alert('Cannot sell more than available stock!');
                      return;
                    }
                    handleProductChange(idx, 'quantity', val);
                  }}
                  fullWidth
                  size="small"
                  type="number"
                  required
                  disabled={loading}
                />
              </Box>
            </Grid>
            {products.length > 1 && (
              <Grid item xs={12}>
                <IconButton color="error" onClick={() => handleRemoveProduct(idx)} disabled={loading}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddProduct} sx={{ mb: 2 }} disabled={loading}>
          Add Another Product
        </Button>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Customer Name"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              fullWidth
              size="small"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Sale Date"
                value={saleDate}
                onChange={setSaleDate}
                slotProps={{ textField: { size: 'small', fullWidth: true, disabled: loading } }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Total Amount to Pay
          <span style={{ float: 'right', fontWeight: 700, color: '#1976d2' }}>₹{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </Typography>
        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
          Product-wise Breakdown
        </Typography>
        <Box sx={{ mb: 2 }}>
          {products.map((p, idx) => {
            const price = parseFloat(p.actualSellingPrice || p.defaultSellingPrice || 0);
            const qty = parseFloat(p.quantity || 0);
            if (!p.productName) return null;
            return (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <span>{qty} × {p.productName}</span>
                <span>₹{(price * qty).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </Box>
            );
          })}
        </Box>
        <Button variant="contained" color="primary" fullWidth size="large" type="submit" disabled={loading}>
          Submit
        </Button>
      </Box>
    </MainLayout>
  );
};

// ...existing code...
export default Sales;
