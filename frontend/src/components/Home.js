import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import InstagramFeed from './InstagramFeed';

const Home = () => {
  const [editMode, setEditMode] = useState(false);
  const [instagramToken, setInstagramToken] = useState(process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN || '');
  const [newToken, setNewToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const handleSaveToken = () => {
    setInstagramToken(newToken);
    setShowTokenInput(false);
    // In a real app, you'd want to save this to your backend
    // and update your environment variables
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Instagram Feed Management Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Instagram Feed Management
            </Typography>
            <Box>
              {!showTokenInput ? (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowTokenInput(true)}
                >
                  Update Instagram Token
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    value={newToken}
                    onChange={(e) => setNewToken(e.target.value)}
                    placeholder="Enter new Instagram token"
                  />
                  <IconButton color="primary" onClick={handleSaveToken}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => setShowTokenInput(false)}>
                    <CancelIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>

          {/* Instagram Feed Preview */}
          <Typography variant="subtitle1" gutterBottom>
            Live Feed Preview:
          </Typography>
          <Box sx={{ height: '400px', mb: 2 }}>
            <InstagramFeed accessToken={instagramToken} />
          </Box>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Products</Typography>
              <Typography variant="h4">123</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Sales</Typography>
              <Typography variant="h4">45</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Active Customers</Typography>
              <Typography variant="h4">89</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Instagram Content Management */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Instagram Post Settings
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Auto-scroll Speed (ms)"
                type="number"
                defaultValue="50"
                helperText="Lower value = faster scroll"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Display Duration (sec)"
                type="number"
                defaultValue="5"
                helperText="How long to show each post"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home;
