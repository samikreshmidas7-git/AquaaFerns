import React, { useState, useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ProductEdit from './ProductEdit';
import MainLayout from "../components/MainLayout";
import { fetchApi } from '../utils/api';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Rating,
  Pagination,
  Collapse,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Products = () => {
  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 18;
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const handleEditClick = (product) => {
    // Always pass the MongoDB _id if available
    setEditProduct({ ...product, _id: product._id || product.id || product.productId });
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setEditProduct(null);
  };
  const handleProductUpdated = () => {
    // Refresh products after update
    fetchProducts();
  };
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleAddToCart = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };
  const CATEGORY_OPTIONS = [
    'Fish',
    'Dog',
    'Cat',
    'Aquarium accessories',
    'Dog accessories',
    'Cat Accessories',
  ];
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [expandedId, setExpandedId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const handleExpandClick = (productId) => {
    setExpandedId(expandedId === productId ? null : productId);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/products');
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // Combine filters and sorting
  let filteredProducts = products.filter(product => {
    // Category filter
    if (category !== 'all' && (!product.category || product.category.toLowerCase() !== category.toLowerCase())) {
      return false;
    }
    // Search filter
    if (search && search.trim() !== '' && (!product.name || !product.name.toLowerCase().includes(search.toLowerCase()))) {
      return false;
    }
    return true;
  });
  // Sort
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => (a.sellingPrice || a.price || 0) - (b.sellingPrice || b.price || 0));
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => (b.sellingPrice || b.price || 0) - (a.sellingPrice || a.price || 0));
  }

  // Pagination logic
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [category, sortBy, search]);
  return (
    <MainLayout>
      <Box sx={{ 
        padding: "24px",
        height: "100%",
        overflowY: "auto"
      }}>
        {/* Header Section */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: 2
        }}>
          <Typography variant="h5" fontWeight="bold">
            Our Products
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            component="a"
            href="/product-entry"
            startIcon={<ShoppingCartIcon />}
          >
            Add New Product
          </Button>
        </Box>

        {/* Search and Filter Section */}
        <Paper sx={{ 
            p: 2, 
            mb: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Make paper slightly transparent
            backdropFilter: 'blur(10px)' // Add a slight blur effect
          }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.15)',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Products Grid */}
        <Grid container spacing={1.5}>
          {paginatedProducts.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 6, color: '#888' }}>
                <Typography variant="h6">No items found.</Typography>
                <Typography variant="body2">Try changing your search, category, or sort options.</Typography>
              </Box>
            </Grid>
          ) : (
            paginatedProducts.map((product) => (
              <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={product._id || product.productId || product.id}>
                <Card
                  sx={{
                    height: '100%',
                    minHeight: 320,
                    maxWidth: 210,
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(180deg, #e0f7fa 0%, #fff 100%)',
                    borderRadius: '24px 24px 80px 80px',
                    boxShadow: '0 4px 24px 0 rgba(0, 184, 212, 0.10)',
                    position: 'relative',
                    overflow: 'visible',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-7px) scale(1.03)',
                      boxShadow: '0 8px 32px 0 rgba(0, 184, 212, 0.18)'
                    }
                  }}
                >
                  <Box sx={{
                    position: 'relative',
                    borderTopLeftRadius: '24px',
                    borderTopRightRadius: '24px',
                    overflow: 'hidden',
                    background: 'linear-gradient(90deg, #b2ebf2 0%, #80deea 100%)',
                  }}>
                    <CardMedia
                      component="img"
                      image={
                        product.imageUrl
                          ? (product.imageUrl.startsWith('http')
                              ? product.imageUrl
                              : `http://localhost:5000${product.imageUrl}`)
                          : (product.image || '/logo192.png')
                      }
                      alt={product.name}
                      sx={{
                        height: { xs: '120px', sm: '180px' },
                        objectFit: 'cover',
                        width: '100%',
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        boxShadow: '0 2px 8px 0 rgba(0, 184, 212, 0.10)'
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 1,
                      zIndex: 2
                    }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary" sx={{ background: '#fff', boxShadow: 1, '&:hover': { background: '#e0f7fa' } }}
                          onClick={() => handleEditClick(product)}>
                          <EditIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem' } }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" sx={{ background: '#fff', boxShadow: 1, '&:hover': { background: '#ffcdd2' } }}>
                          <DeleteIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem' } }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      p: { xs: 1, sm: 2 },
                      pb: { xs: 0, sm: 1 },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: 'linear-gradient(180deg, #fff 60%, #e0f7fa 100%)',
                      borderBottomLeftRadius: '48px',
                      borderBottomRightRadius: '48px',
                      minHeight: { xs: 120, sm: 150 },
                      position: 'relative',
                      mt: -2
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h2"
                      noWrap
                      sx={{
                        fontSize: { xs: '1.1rem', sm: '1.15rem' },
                        mb: { xs: 0.5, sm: 0.5 },
                        fontWeight: 700,
                        color: '#00838f',
                        textAlign: 'center',
                        letterSpacing: 0.5
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <b>Stock:</b> {product.quantity || 0}
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                      flexWrap: 'nowrap',
                      width: '100%',
                      justifyContent: 'center'
                    }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 700,
                          color: '#00bcd4',
                          minWidth: 0,
                          flexShrink: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mr: 1
                        }}
                      >
                        ₹{(product.sellingPrice || product.price || 0).toFixed(2)}
                      </Typography>
                      {(() => {
                        const qty = product.quantity || 0;
                        let label = '';
                        let bg = '';
                        let color = '';
                        if (qty === 0) {
                          label = 'Stock Out';
                          bg = '#ffcdd2';
                          color = '#b71c1c';
                        } else if (qty > 0 && qty < 15) {
                          label = 'Running Out';
                          bg = '#ffe0b2';
                          color = '#e65100';
                        } else {
                          label = 'In-stock';
                          bg = '#b2dfdb';
                          color = '#00695c';
                        }
                        return (
                          <Chip
                            label={label}
                            size="small"
                            sx={{
                              flexShrink: 0,
                              maxWidth: { xs: '120px', sm: '140px' },
                              background: bg,
                              color: color,
                              fontWeight: 600,
                              '& .MuiChip-label': {
                                fontSize: { xs: '0.7rem', sm: '0.85rem' },
                                px: { xs: 0.7, sm: 1 }
                              }
                            }}
                          />
                        );
                      })()}
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.95rem' },
                        display: '-webkit-box',
                        WebkitLineClamp: expandedId === (product._id || product.productId || product.id) ? 'unset' : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        textAlign: 'center',
                        px: 1,
                        '&:hover': {
                          color: '#00838f',
                          fontWeight: 600
                        }
                      }}
                      onClick={() => handleExpandClick(product._id || product.productId || product.id)}
                    >
                      {product.notes || product.description || ''}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 0.5,
                        mb: -1
                      }}
                    >
                      <Tooltip title={expandedId === (product._id || product.productId || product.id) ? 'Show less' : 'Read more'}>
                        <IconButton
                          size="small"
                          onClick={() => handleExpandClick(product._id || product.productId || product.id)}
                          sx={{
                            padding: 0.2,
                            color: '#00bcd4',
                            '&:hover': {
                              color: '#00838f',
                              background: '#e0f7fa'
                            }
                          }}
                        >
                          {expandedId === (product._id || product.productId || product.id) ? (
                            <ExpandLessIcon sx={{ fontSize: '1.1rem' }} />
                          ) : (
                            <ExpandMoreIcon sx={{ fontSize: '1.1rem' }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{
                        mt: 1,
                        borderRadius: '20px',
                        fontWeight: 700,
                        fontSize: { xs: '0.8rem', sm: '0.95rem' },
                        px: 2,
                        py: 0.5,
                        background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                        color: '#00695c',
                        boxShadow: '0 2px 8px 0 rgba(67,233,123,0.10)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
                          color: '#004d40'
                        }
                      }}
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                  {/* No CardActions, buttons are now on image */}
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Pagination */}
        <Box sx={{ 
          mt: 4, 
          display: 'flex', 
          justifyContent: 'center',
          mb: { xs: 2, sm: 3 }
        }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            siblingCount={0}
            boundaryCount={1}
            size="small"
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }
            }}
          />
        </Box>
      </Box>
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={4000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <MuiAlert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
        Kindly visit our store to purchase your required items. Here you can check availability and plan your needs in advance.
      </MuiAlert>
    </Snackbar>
    <ProductEdit
      product={editProduct}
      open={editOpen}
      onClose={handleEditClose}
      onUpdated={handleProductUpdated}
    />
    </MainLayout>
  );
};

export default Products;
