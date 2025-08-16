import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AccessDeniedDialog = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Access Denied</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleGoHome} color="primary" variant="contained">
          Go to Home
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccessDeniedDialog;
