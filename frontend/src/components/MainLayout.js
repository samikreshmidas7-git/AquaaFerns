import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem, Divider, useMediaQuery, useTheme, Button, Box, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Footer from "./Footer";
import logo from "../assets/LOGOAquaaFerns.jpg";
import backgroundImg from "../assets/background.jpeg";
import { useAuth } from "../context/AuthContext";
import LoginDialog from "./LoginDialog";
import AccessDeniedDialog from "./AccessDeniedDialog";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [accessDeniedOpen, setAccessDeniedOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
      handleMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMobileMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <div style={{display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f4f6fb", fontFamily: "Segoe UI, Arial, sans-serif"}}>
      {/* Top Header Bar */}
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
            <span style={{fontSize: "0.8rem", color: "#232e3c", fontStyle: "italic", marginTop: "0.1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
              It's not just a store, It's our commitment
            </span>
          </div>
        </div>
        {isMobile ? (
          <>
            <IconButton
              onClick={handleMenuClick}
              style={{
                marginLeft: "auto",
                color: "#232e3c",
                padding: "8px"
              }}
            >
              <MenuIcon style={{ fontSize: "24px" }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={isMobileMenuOpen}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  width: "200px",
                  marginTop: "45px"
                }
              }}
            >
              <MenuItem component={Link} to="/" onClick={handleMenuClose}>Home</MenuItem>
              <MenuItem component={Link} to="/public" onClick={handleMenuClose}>Public View</MenuItem>
              <MenuItem component={Link} to="/product-list" onClick={handleMenuClose}>View Products</MenuItem>
              <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>Dashboard</MenuItem>
              <MenuItem component={Link} to="/product-entry" onClick={handleMenuClose}>Add Product</MenuItem>
              <MenuItem component={Link} to="/products" onClick={handleMenuClose}>Products</MenuItem>
              <MenuItem component={Link} to="/sales" onClick={handleMenuClose}>Sales</MenuItem>
              <MenuItem component={Link} to="/damage-entry" onClick={handleMenuClose}>Damage Entry</MenuItem>
              <MenuItem component={Link} to="/customer-points" onClick={handleMenuClose}>Customer Points</MenuItem>
              <Divider />
              {user ? (
                <>
                  <MenuItem style={{ color: "#666", fontSize: "0.9rem" }}>
                    {user.email}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </>
              ) : (
                <MenuItem onClick={() => {
                  handleMenuClose();
                  setLoginOpen(true);
                }}>
                  Login
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <div style={{
            fontSize: "0.9rem",
            color: "#232e3c",
            fontWeight: "500",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginLeft: "auto",
            paddingRight: "1rem"
          }}>
            {user ? (
              <>
                <span>Welcome, {user.name}</span>
                <Button variant="outlined" size="small" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={() => setLoginOpen(true)}
              >
                Login
              </Button>
            )}
          </div>
        )}
      </div>
      {/* Sidebar - Only visible on desktop, fixed outside main content */}
      {!isMobile && (
        <aside
          style={{
            width: '220px',
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#0a2a2f',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem 0',
            boxShadow: '2px 0 12px rgba(35,46,60,0.12)',
            position: 'fixed',
            top: '55px',
            bottom: 0,
            overflowY: 'auto',
            zIndex: 900,
            textShadow: '0 1px 4px #fff'
          }}
        >
          <div style={{fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '2rem', textShadow: '0 1px 4px #fff'}}>InventoryPro</div>
          <nav style={{width: '100%', marginBottom: 'auto'}}>
            <a
              href="/"
              style={{display: 'block', color: '#0a2a2f', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', marginBottom: '0.5rem', fontWeight: '500', background: location.pathname === '/' ? 'rgba(255,255,255,0.7)' : 'transparent', textShadow: '0 1px 4px #fff'}}
              onClick={e => {
                if (!user) {
                  e.preventDefault();
                  setLoginOpen(true);
                } else {
                  navigate('/');
                }
              }}
            >Home</a>
            <a
              href="/public"
              style={{
                display: 'block',
                color: '#0a2a2f',
                textDecoration: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                fontWeight: '500',
                background: location.pathname === '/public' 
                  ? 'rgba(67, 160, 71, 0.2)' 
                  : 'rgba(67, 160, 71, 0.1)',
                textShadow: '0 1px 4px #fff',
                border: '1px solid rgba(67, 160, 71, 0.3)'
              }}
              onClick={e => {
                e.preventDefault();
                navigate('/public');
              }}
            >Public View</a>
            <a
              href="/product-list"
              style={{
                display: 'block',
                color: '#0a2a2f',
                textDecoration: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                fontWeight: '500',
                background: location.pathname === '/product-list'
                  ? 'rgba(67, 160, 71, 0.2)'
                  : 'rgba(67, 160, 71, 0.1)',
                textShadow: '0 1px 4px #fff',
                border: '1px solid rgba(67, 160, 71, 0.3)'
              }}
              onClick={e => {
                e.preventDefault();
                navigate('/product-list');
              }}
            >View Products</a>
            <a
              href="/dashboard"
              style={{display: 'block', color: '#0a2a2f', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', marginBottom: '0.5rem', fontWeight: '500', background: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.7)' : 'transparent', textShadow: '0 1px 4px #fff'}}
              onClick={e => {
                if (!user) {
                  e.preventDefault();
                  setLoginOpen(true);
                } else {
                  navigate('/dashboard');
                }
              }}
            >Dashboard</a>
            <a
              href="/product-entry"
              style={{display: 'block', color: '#0a2a2f', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', marginBottom: '0.5rem', fontWeight: '500', background: location.pathname === '/product-entry' ? 'rgba(255,255,255,0.7)' : 'transparent', textShadow: '0 1px 4px #fff'}}
              onClick={e => {
                if (!user) {
                  e.preventDefault();
                  setLoginOpen(true);
                } else {
                  navigate('/product-entry');
                }
              }}
            >Add Product</a>
            <a
              href="/products"
              style={{display: 'block', color: '#0a2a2f', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', marginBottom: '0.5rem', fontWeight: '500', background: location.pathname === '/products' ? 'rgba(255,255,255,0.7)' : 'transparent', textShadow: '0 1px 4px #fff'}}
              onClick={e => {
                if (!user) {
                  e.preventDefault();
                  setLoginOpen(true);
                } else {
                  navigate('/products');
                }
              }}
            >Products</a>
            <a
              href="/sales"
              style={{display: 'block', color: '#0a2a2f', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', marginBottom: '0.5rem', fontWeight: '500', background: location.pathname === '/sales' ? 'rgba(255,255,255,0.7)' : 'transparent', textShadow: '0 1px 4px #fff'}}
              onClick={e => {
                if (!user) {
                  e.preventDefault();
                  setLoginOpen(true);
                } else {
                  navigate('/sales');
                }
              }}
            >Sales</a>
            <a
              href="/damage-entry"
              style={{display: 'block', color: '#0a2a2f', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', marginBottom: '0.5rem', fontWeight: '500', background: location.pathname === '/damage-entry' ? 'rgba(255,255,255,0.7)' : 'transparent', textShadow: '0 1px 4px #fff'}}
              onClick={e => {
                if (!user) {
                  e.preventDefault();
                  setLoginOpen(true);
                } else {
                  navigate('/damage-entry');
                }
              }}
            >Damage Entry</a>
            <a
              href="/customer-points"
              style={{display: 'block', color: '#0a2a2f', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', marginBottom: '0.5rem', fontWeight: '500', background: location.pathname === '/customer-points' ? 'rgba(255,255,255,0.7)' : 'transparent', textShadow: '0 1px 4px #fff'}}
              onClick={e => {
                if (!user) {
                  e.preventDefault();
                  setLoginOpen(true);
                } else {
                  navigate('/customer-points');
                }
              }}
            >Customer Points</a>
          </nav>
        </aside>
      )}
      {/* Main Content Area, always full width but offset if sidebar is visible */}
      <main
        style={{
          flex: 1,
          marginLeft: !isMobile ? '220px' : 0,
          minHeight: 'calc(100vh - 55px)',
          width: !isMobile ? 'calc(100% - 220px)' : '100%',
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#0a2a2f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxSizing: 'border-box',
          overflowX: 'hidden'
        }}
      >
        <div
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            padding: '2.5rem',
            background: 'rgba(255,255,255,0.92)',
            borderRadius: '12px',
            margin: '1.5rem auto',
            maxWidth: '1200px',
            boxSizing: 'border-box',
            filter: !user ? 'blur(8px)' : 'none',
            pointerEvents: !user ? 'none' : 'auto',
            transition: 'filter 0.3s ease-in-out'
          }}
        >
          {children}
        </div>
        {!user && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              textAlign: 'center',
              backgroundColor: 'rgba(255,255,255,0.95)',
              padding: '2.5rem 3rem',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              backdropFilter: 'blur(10px)',
              animation: 'fadeIn 0.3s ease-in-out',
              '@keyframes fadeIn': {
                from: {
                  opacity: 0,
                  transform: 'translate(-50%, -45%)'
                },
                to: {
                  opacity: 1,
                  transform: 'translate(-50%, -50%)'
                }
              }
            }}
          >
            <Typography variant="h5" gutterBottom>
              Please Login to Access
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setLoginOpen(true)}
            >
              Login
            </Button>
          </Box>
        )}
        <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      </main>
      {/* Footer spans full width */}
      <Footer />
    </div>
  );
};

export default MainLayout;
