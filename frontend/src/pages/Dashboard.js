import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { useAuth } from "../context/AuthContext";
import { fetchApi } from "../utils/api";
import { 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Card,
  CardContent,
  Grid,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('day');
  const [dateRange, setDateRange] = useState(() => new Date());
  const [salesDate, setSalesDate] = useState(() => new Date());
  const [filteredStats, setFilteredStats] = useState({ sales: 0, profit: 0 });
  const [sales, setSales] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch sales and products from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!dateRange) return;

        // Format date in ISO string
        const formattedDate = dateRange.toISOString();
        const salesData = await fetchApi(`/sales/byDay?date=${formattedDate}`);
        
        setSales(salesData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        // If unauthorized, logout and redirect to login
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          logout();
          navigate('/');
        }
        // Clear sales data if there's an error
        setSales([]);
      }
    };
    fetchData();
  }, [dateRange]);

  useEffect(() => {
    const stats = calculateTotalStats();
    setFilteredStats(stats);
  }, [dateRange, timeFilter, sales]);


  // Calculate total stats based on sales from backend
  const filterSalesByDateRange = (salesArr = []) => {
    if (!dateRange || !Array.isArray(salesArr)) return [];
    
    // For daily view, return all sales as they're already filtered by the API
    if (timeFilter === 'day') {
      return salesArr;
    }
    
    return salesArr.filter(sale => {
      if (!sale?.saleDate) return false;
      const saleDate = new Date(sale.saleDate);
      
      if (timeFilter === 'week') {
        const weekStart = new Date(dateRange);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        return saleDate >= weekStart && saleDate < weekEnd;
      }
      
      if (timeFilter === 'month') {
        const monthStart = new Date(dateRange.getFullYear(), dateRange.getMonth(), 1);
        const monthEnd = new Date(dateRange.getFullYear(), dateRange.getMonth() + 1, 0, 23, 59, 59);
        return saleDate >= monthStart && saleDate <= monthEnd;
      }
      
      if (timeFilter === 'year') {
        const yearStart = new Date(dateRange.getFullYear(), 0, 1);
        const yearEnd = new Date(dateRange.getFullYear(), 11, 31, 23, 59, 59);
        return saleDate >= yearStart && saleDate <= yearEnd;
      }
      
      return false;
    });
  };

  const calculateTotalStats = () => {
    const filteredSales = filterSalesByDateRange(sales);
    let totalSales = 0;
    let totalProfit = 0;
    
    filteredSales.forEach(sale => {
      // Use the stored totals from the sale document
      totalSales += sale.totalAmount || 0;
      totalProfit += sale.totalProfit || 0;
    });
    return { sales: totalSales, profit: totalProfit };
  };

  return (
    <MainLayout>
      <Box sx={{ 
        padding: "24px",
        height: "100%",
        overflowY: "auto"
      }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Sales & Profit Dashboard
        </Typography>

        {/* Total Sales and Profit Card */}
        <Card sx={{ 
            mb: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)'
          }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Total Sales & Profit Overview
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Date"
                    value={dateRange}
                    onChange={(newValue) => setDateRange(newValue)}
                    slotProps={{ textField: { size: 'small' } }}
                  />
                </LocalizationProvider>
                <Select
                  size="small"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="day">Daily</MenuItem>
                  <MenuItem value="week">Weekly</MenuItem>
                  <MenuItem value="month">Monthly</MenuItem>
                  <MenuItem value="year">Yearly</MenuItem>
                </Select>
              </Box>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                  <Typography variant="subtitle1" color="textSecondary">Total Sales</Typography>
                  <Typography variant="h4">₹{filteredStats.sales.toLocaleString()}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                  <Typography variant="subtitle1" color="textSecondary">Total Profit</Typography>
                  <Typography variant="h4">₹{filteredStats.profit.toLocaleString()}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>





        {/* Daily Sales Table */}
        <Card sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)'
          }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Daily Sales Details
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={dateRange}
                  onChange={(newValue) => {
                    setDateRange(newValue);
                    setSalesDate(newValue);
                  }}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </LocalizationProvider>
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Item ID</TableCell>
                    <TableCell>Item Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Sold At (₹)</TableCell>
                    <TableCell align="right">Total Sales (₹)</TableCell>
                    <TableCell align="right">Total Profit (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(filterSalesByDateRange(sales || []) || []).reduce((rows, sale) => {
                    if (!sale?.products) return rows;
                    
                    const productRows = sale.products.map((p, idx) => (
                      <TableRow key={`${sale._id}-${idx}`}>
                        <TableCell>
                          {sale.saleDate ? 
                            new Date(sale.saleDate).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZone: 'Asia/Kolkata'
                            })
                            : 'N/A'}
                        </TableCell>
                        <TableCell>{sale.customerName || ''}</TableCell>
                        <TableCell>{p.productId || ''}</TableCell>
                        <TableCell>{p.productName || ''}</TableCell>
                        <TableCell align="right">{p.quantity || 0}</TableCell>
                        <TableCell align="right">₹{p.actualSellingPrice || 0}</TableCell>
                        <TableCell align="right">₹{((p.quantity || 0) * (p.actualSellingPrice || 0)).toLocaleString()}</TableCell>
                        <TableCell align="right">₹{((p.actualSellingPrice || 0) - (p.buyingPrice || 0)) * (p.quantity || 0).toLocaleString()}</TableCell>
                      </TableRow>
                    ));
                    
                    return [...rows, ...productRows];
                  }, [])}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
