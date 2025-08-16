import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem, useMediaQuery, useTheme, Button, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Footer from "./Footer";
import logo from "../assets/LOGOAquaaFerns.jpg";
import backgroundImg from "../assets/background.jpeg";
import { useAuth } from "../context/AuthContext";
import LoginDialog from "./LoginDialog";

const PublicLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const { user } = useAuth();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh", 
      background: "#f4f6fb"
    }}>
      {/* Header */}
      <div style={{
        width: "100%",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        padding: "0 2rem",
        borderBottom: "2px solid #e3f2fd",
        height: "55px",
        position: "fixed",
        top: 0,
        zIndex: 1000
      }}>
        <div style={{display: "flex", alignItems: "center", gap: "1rem", flexGrow: 1}}>
          <div style={{height: "56px", width: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", borderRadius: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)"}}>
            <img src={logo} alt="Brand Logo" style={{maxHeight: "52px", maxWidth: "52px", objectFit: "contain"}} />
          </div>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
            <span style={{fontWeight: "bold", fontSize: "1.2rem", letterSpacing: "1px", display: "flex", flexWrap: "wrap", lineHeight: "1"}}>
              <span style={{
                color: "#1976d2",
                fontFamily: "serif, Georgia, Times New Roman, Times"
              }}>AQUAA</span>
              <span style={{
                color: "#43a047",
                marginLeft: "0.3rem",
                fontFamily: "serif, Georgia, Times New Roman, Times"
              }}> FERNS</span>
            </span>
            <span style={{fontSize: "0.8rem", color: "#232e3c", fontStyle: "italic", marginTop: "0.1rem"}}>
              It's not just a store, It's our commitment
            </span>
          </div>
        </div>

        {isMobile ? (
          <>
            <IconButton onClick={handleMenuClick}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/public" onClick={handleMenuClose}>Home</MenuItem>
              <MenuItem component={Link} to="/product-list" onClick={handleMenuClose}>Products</MenuItem>
              {!user && (
                <MenuItem onClick={() => {
                  handleMenuClose();
                  setLoginOpen(true);
                }}>Login</MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={Link} to="/public" color="inherit">Home</Button>
            <Button component={Link} to="/product-list" color="inherit">Products</Button>
            {!user && (
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => setLoginOpen(true)}
              >
                Login
              </Button>
            )}
          </Box>
        )}
      </div>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <Footer />

      {/* Login Dialog */}
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};

export default PublicLayout;
