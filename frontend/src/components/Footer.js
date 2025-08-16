import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import logo from "../assets/LOGOAquaaFerns.jpg";
import backgroundImg from "../assets/background.jpeg";

const Footer = () => {
  return (
    <Box
      sx={{
  position: 'relative',
  color: '#0a2a2f',
  py: 2,
  width: '100%',
  marginLeft: '0',
  backgroundImage: `url(${backgroundImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  textShadow: '0 1px 4px #fff',
      }}
    >
      <Box sx={{ maxWidth: '100%', px: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {/* Contact Information and Social Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 1, fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }} />
              <Link href="mailto:contact@aquaaferns.com" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>
                contact@aquaaferns.com
              </Link>
            </Box>
            
            {/* Social Media Icons */}
            <Box sx={{ display: 'flex', gap: 1, mx: 2 }}>
              <IconButton 
                href="#" 
                size="small"
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s'
                  }
                }}
              >
                <InstagramIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
              <IconButton 
                href="#" 
                size="small"
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s'
                  }
                }}
              >
                <FacebookIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
              <IconButton 
                href="#" 
                size="small"
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s'
                  }
                }}
              >
                <WhatsAppIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalPhoneIcon sx={{ mr: 1, fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }} />
              <Link href="tel:+919863300704" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>
                +91 98633 00704
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box sx={{ 
          width: '100%',
          mt: 1, 
          pt: 1, 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          textAlign: 'center'
        }}>
          <Typography variant="caption" color="rgba(255,255,255,0.7)">
            © {new Date().getFullYear()} AquaaFerns. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
