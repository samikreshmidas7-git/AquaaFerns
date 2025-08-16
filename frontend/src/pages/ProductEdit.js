import React, { useState, useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

const DEFAULT_CATEGORY_OPTIONS = [
  'Fish',
  'Dog',
  'Cat',
  'Aquarium accessories',
  'Dog accessories',
  'Cat Accessories',
];

const ProductEdit = ({ product, open, onClose, onUpdated }) => {
  const [categoryOptions, setCategoryOptions] = useState(DEFAULT_CATEGORY_OPTIONS);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  // Remove the batch handling states and calculations

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setCategory(product.category || "");
      setBuyingPrice(product.buyingPrice !== undefined ? product.buyingPrice : "");
      setSellingPrice(product.sellingPrice !== undefined ? product.sellingPrice : "");
      setQuantity(product.quantity !== undefined ? product.quantity : "");
      setDescription(product.description || product.notes || "");
      setPreview(product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`) : (product?.image || null));
      setImage(null);
      // Fetch all categories from backend for better options
      fetch('http://localhost:5000/api/products')
        .then(res => res.json())
        .then(data => {
          const cats = Array.from(new Set([
            ...DEFAULT_CATEGORY_OPTIONS,
            ...data.map(p => p.category).filter(Boolean)
          ]));
          setCategoryOptions(cats.length > 0 ? cats : DEFAULT_CATEGORY_OPTIONS);
        })
        .catch(() => {
          setCategoryOptions(DEFAULT_CATEGORY_OPTIONS);
        });
    }
  }, [product]);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(image);
    }
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleCapture = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
      };
      input.click();
    } catch (err) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("buyingPrice", buyingPrice);
      formData.append("sellingPrice", sellingPrice);
      formData.append("quantity", quantity);
      formData.append("description", description);
      if (image) formData.append("image", image);
      // Use the same logic as Add Product, but pass an 'edit' flag so backend sets stock
      formData.append("productId", product.productId || product._id || product.id);
      formData.append("editMode", "true");
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update product");
      setSnackbar({ open: true, message: 'Product updated successfully!', severity: 'success' });
      onUpdated && onUpdated();
      setTimeout(() => {
        setSnackbar({ open: false, message: '', severity: 'success' });
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || "Error updating product");
      setSnackbar({ open: true, message: err.message || 'Error updating product', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      bgcolor: 'rgba(0,0,0,0.25)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
  <Paper sx={{ 
            p: 3, 
            minWidth: 340, 
            maxWidth: 400, 
            position: 'relative', 
            zIndex: 3000,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" mb={2} fontWeight={700}>Edit Product</Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
              {preview && (
                <img src={preview} alt="Current" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12, marginBottom: 8, border: '2px solid #e0e0e0' }} />
              )}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  size="small"
                >
                  Upload
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  size="small"
                  onClick={handleCapture}
                >
                  Capture
                </Button>
              </Box>
            </Box>
            <TextField label="Product Name" value={name} InputProps={{ readOnly: true }} required fullWidth size="small" />
              <TextField
                label="Category"
                value={category || ''}
                InputProps={{ readOnly: true }}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
            <TextField 
              label="Buying Price" 
              value={buyingPrice} 
              onChange={(e) => setBuyingPrice(e.target.value)} 
              required 
              fullWidth 
              size="small" 
              type="number" 
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} 
            />
            
            <TextField 
              label="Stock Quantity" 
              value={quantity} 
              onChange={e => setQuantity(e.target.value)} 
              required 
              fullWidth 
              size="small" 
              type="number" 
            />
            <TextField 
              label="Selling Price" 
              value={sellingPrice} 
              onChange={(e) => setSellingPrice(e.target.value)} 
              required 
              fullWidth 
              size="small" 
              type="number" 
              InputProps={{ 
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }} 
            />
            <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth size="small" multiline minRows={2} />
            {error && <Typography color="error" fontSize={13}>{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ fontWeight: 700 }}>
              {loading ? <CircularProgress size={22} /> : 'Update Product'}
            </Button>
          </Box>
        </form>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default ProductEdit;
