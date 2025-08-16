import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardMedia,
} from '@mui/material';
import { PhotoCamera, Add } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MainLayout from "../components/MainLayout";



const Input = styled('input')({
  display: 'none',
});

const ProductEntry = () => {

  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    category: '',
    image: null,
    quantityPurchased: '',
    buyingPrice: '',
    sellingPrice: '',
    notes: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [openNewProduct, setOpenNewProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductId, setNewProductId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalCostBuy, setTotalCostBuy] = useState(0);
  const [totalCostSell, setTotalCostSell] = useState(0);
  const [existingProducts, setExistingProducts] = useState([]);
  const CATEGORY_OPTIONS = [
    'Fish',
    'Dog',
    'Cat',
    'Aquarium accessories',
    'Dog accessories',
    'Cat Accessories',
  ];
  const [categories, setCategories] = useState(CATEGORY_OPTIONS);
  const [loading, setLoading] = useState(false);

  // Fetch products and categories from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        setExistingProducts(prev => {
          // Merge new products (those with no _id but have productId) with backend data
          const localNew = prev.filter(p => !p._id && p.productId);
          // Remove any duplicates by productId
          const all = [...localNew, ...data];
          return all.filter((v, i, arr) =>
            arr.findIndex(p => (p.productId || p._id || p.id) === (v.productId || v._id || v.id)) === i
          );
        });
        setCategories(CATEGORY_OPTIONS);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Calculate totals when quantity or prices change
  useEffect(() => {
    const quantity = parseFloat(formData.quantityPurchased) || 0;
    const buyingPrice = parseFloat(formData.buyingPrice) || 0;
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;

    setTotalCostBuy(quantity * buyingPrice);
    setTotalCostSell(quantity * sellingPrice);
  }, [formData.quantityPurchased, formData.buyingPrice, formData.sellingPrice]);

  const handleProductSelect = (event, value) => {
    setSelectedProduct(value);
    if (value) {
      const id = value.productId || value._id || value.id || '';
      setFormData(prev => ({
        ...prev,
        productId: id,
        productName: value.name || '',
        buyingPrice: (value.buyingPrice !== undefined ? value.buyingPrice : '').toString(),
        sellingPrice: (value.sellingPrice !== undefined ? value.sellingPrice : '').toString(),
        category: value.category || '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        productId: '',
        productName: '',
        buyingPrice: '',
        sellingPrice: '',
        category: '',
      }));
    }
  };

  const [newProductCategory, setNewProductCategory] = useState('');
  const handleNewProduct = () => {
    if (newProductName.trim() && newProductId.trim() && newProductCategory.trim()) {
      // Add the new product to the existingProducts list immediately
      const newProduct = {
        productId: newProductId,
        name: newProductName,
        category: newProductCategory,
        buyingPrice: 0,
        sellingPrice: 0,
        quantity: 0,
      };
      setExistingProducts(prev => {
        // Always keep new product in the list until backend refresh
        const exists = prev.some(p => p.productId === newProductId);
        return exists ? prev : [newProduct, ...prev];
      });
      setFormData(prev => ({
        ...prev,
        productName: newProductName,
        productId: newProductId,
        category: newProductCategory,
        buyingPrice: 0,
        sellingPrice: 0,
      }));
      setSelectedProduct(newProduct); // Auto-select the new product in the dropdown
      setOpenNewProduct(false);
      setNewProductName('');
      setNewProductId('');
      setNewProductCategory('');
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Prevent duplicate product by productId only
      const existing = existingProducts.find(
        p => (p.productId === formData.productId)
      );
      // Use FormData for multipart/form-data
      const form = new FormData();
      form.append('productId', formData.productId);
      form.append('name', formData.productName);
      form.append('category', formData.category);
      form.append('quantityPurchased', formData.quantityPurchased);
      form.append('buyingPrice', formData.buyingPrice);
      form.append('sellingPrice', formData.sellingPrice);
      form.append('notes', formData.notes);
      if (formData.image) {
        form.append('image', formData.image);
      }
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Failed to save product');
      const updated = await res.json();
      setExistingProducts(prev => {
        // Always update or replace the product in the list by _id or productId
        const idx = prev.findIndex(p => (p.productId || p._id || p.id) === (updated.productId || updated._id || updated.id));
        if (idx !== -1) {
          const arr = [...prev];
          arr[idx] = {
            ...updated,
            productId: arr[idx].productId || updated.productId || updated._id || updated.id
          };
          return arr;
        } else {
          return [
            {
              ...updated,
              productId: updated.productId || updated._id || updated.id
            },
            ...prev
          ];
        }
      });
      if (!categories.includes(updated.category)) {
        setCategories(prev => [...prev, updated.category]);
      }
      handleClear();
      alert('Product saved successfully!');
    } catch (err) {
      alert('Error saving product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      productName: '',
      category: '',
      image: null,
      quantityPurchased: '',
      buyingPrice: '',
      sellingPrice: '',
      notes: '',
    });
    setImagePreview(null);
    setSelectedProduct(null);
  };

  return (
    <MainLayout>
      <Box sx={{ 
        padding: "24px",
        height: "100%",
        overflowY: "auto"
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Add New Product
          </Typography>
        </Box>
        <Paper sx={{ 
            p: 3, 
            maxWidth: 800, 
            mx: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Make paper slightly transparent
            backdropFilter: 'blur(10px)' // Add a slight blur effect
          }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <Autocomplete
                  options={existingProducts
                    .filter((v, i, arr) => {
                      // Show all products that have a productId (user-set or not)
                      const id = v.productId || v._id || v.id;
                      return id && v.name && String(id).trim() !== '' && String(v.name).trim() !== '' &&
                        arr.findIndex(p => (p.productId || p._id || p.id) === id) === i;
                    })}
                  getOptionLabel={(option) => {
                    if (!option) return '';
                    // Always show the productId set by the user if present
                    return `${option.productId || ''} - ${option.name || ''}`;
                  }}
                  value={selectedProduct}
                  isOptionEqualToValue={(option, value) => {
                    // Compare by productId or _id
                    return (
                      (option.productId && value.productId && option.productId === value.productId) ||
                      (option._id && value._id && option._id === value._id) ||
                      (option.id && value.id && option.id === value.id)
                    );
                  }}
                  onChange={handleProductSelect}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Product Name"
                      required
                      fullWidth
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
                        {option.productId || ''}
                      </Typography>
                      - {option.name}
                    </li>
                  )}
                />
                <Button
                  startIcon={<Add />}
                  onClick={() => setOpenNewProduct(true)}
                  sx={{ mt: 1 }}
                >
                  Add New Product
                </Button>
              </Box>

              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Card>
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <PhotoCamera sx={{ fontSize: 40, color: '#bdbdbd' }} />
                  )}
                </CardMedia>
                <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                  <label htmlFor="capture-photo">
                    <Input
                      accept="image/*"
                      id="capture-photo"
                      type="file"
                      capture="environment"
                      onChange={handleImageChange}
                    />
                    <Button variant="contained" component="span">
                      Capture Photo
                    </Button>
                  </label>
                  <label htmlFor="select-photo">
                    <Input
                      accept="image/*"
                      id="select-photo"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <Button variant="outlined" component="span">
                      Select Photo
                    </Button>
                  </label>
                </Box>
              </Card>

              <TextField
                fullWidth
                required
                type="number"
                label="Quantity Purchased"
                name="quantityPurchased"
                value={formData.quantityPurchased}
                onChange={handleChange}
                inputProps={{ min: "1" }}
              />

              <TextField
                fullWidth
                required
                type="number"
                label="Buying Price (per item)"
                name="buyingPrice"
                value={formData.buyingPrice}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />

              <TextField
                fullWidth
                required
                type="number"
                label="Selling Price (per item)"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1">
                  Total Cost of Buy: ₹{totalCostBuy.toFixed(2)}
                </Typography>
                <Typography variant="subtitle1">
                  Total Cost of Sell: ₹{totalCostSell.toFixed(2)}
                </Typography>
              </Box>

  
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={handleClear}>
                  Clear Form
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save Product
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>

        {/* Dialog for adding new product */}
        <Dialog open={openNewProduct} onClose={() => setOpenNewProduct(false)}>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mb: 2,
                alignItems: 'flex-start',
                '& .MuiFormControl-root, & .MuiTextField-root': {
                  minWidth: 0,
                  flex: 1,
                },
                '@media (max-width: 600px)': {
                  flexDirection: 'column',
                  gap: 1,
                },
              }}
            >
              <TextField
                autoFocus
                margin="dense"
                label={<span>Product ID <span style={{ color: '#d32f2f' }}>*</span></span>}
                value={newProductId}
                onChange={(e) => setNewProductId(e.target.value)}
                required
                error={!newProductId.trim()}
                helperText={!newProductId.trim() ? "Product ID is required" : ""}
                sx={{
                  width: '30%',
                  minWidth: 120,
                  '& .MuiInputBase-root': { height: 48 },
                }}
              />
              <TextField
                margin="dense"
                label={<span>Product Name <span style={{ color: '#d32f2f' }}>*</span></span>}
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                required
                error={!newProductName.trim()}
                helperText={!newProductName.trim() ? "Product Name is required" : ""}
                sx={{
                  width: '40%',
                  minWidth: 140,
                  '& .MuiInputBase-root': { height: 48 },
                }}
              />
              <FormControl
                sx={{
                  width: '30%',
                  minWidth: 120,
                  mt: '8px',
                  '& .MuiInputBase-root': { height: 48 },
                }}
                required
                error={!newProductCategory.trim()}
              >
                <InputLabel>Category <span style={{ color: '#d32f2f' }}>*</span></InputLabel>
                <Select
                  value={newProductCategory}
                  label="Category *"
                  onChange={e => setNewProductCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenNewProduct(false);
              setNewProductId('');
              setNewProductName('');
              setNewProductCategory('');
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleNewProduct}
              variant="contained"
              disabled={!newProductId.trim() || !newProductName.trim() || !newProductCategory.trim()}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
  
};

export default ProductEntry;
