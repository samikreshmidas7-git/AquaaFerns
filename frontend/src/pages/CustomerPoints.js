import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchApi } from "../utils/api";

const CustomerPoints = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ id: "", name: "", phone: "", points: 0 });

  const fetchCustomers = async () => {
    try {
      const data = await fetchApi(`/customer-points?q=${search}`);
      setCustomers(data);
    } catch (err) {
      setCustomers([]);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [search]);

  const handleEdit = (customer) => {
    setEditData({ 
      id: customer._id,
      name: customer.name, 
      phone: customer.phone, 
      points: customer.points 
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await fetchApi(`/customer-points/${editData.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editData.name,
          phone: editData.phone,
          points: editData.points
        })
      });
      setEditDialogOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditData({ id: "", name: "", phone: "", points: 0 });
  };

  const handleRemove = async (id) => {
    await fetchApi(`/customer-points/${id}`, { method: "DELETE" });
    fetchCustomers();
  };

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 6, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Customer Points
        </Typography>
        <TextField
          label="Search by Name or Phone"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Points Collected</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.points}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(customer)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleRemove(customer._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={handleEditCancel}>
          <DialogTitle>Edit Customer Points</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, pb: 2 }}>
              <TextField
                label="Name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Phone Number"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Points"
                type="number"
                value={editData.points}
                onChange={(e) => setEditData({ ...editData, points: Number(e.target.value) })}
                fullWidth
                margin="dense"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditCancel}>Cancel</Button>
            <Button onClick={handleEditSave} variant="contained" color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default CustomerPoints;
