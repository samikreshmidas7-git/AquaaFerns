import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Container
} from '@mui/material';
import InstagramFeed from '../components/InstagramFeed';
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from 'react-router-dom';

const PublicHome = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Aquarium Fish',
      description: 'Discover our vibrant collection of freshwater and marine fish. From colorful tetras to elegant angelfish, find the perfect addition to your aquatic ecosystem.',
      image: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?ixlib=rb-4.0.3',
      items: [
        'Tropical Freshwater Fish',
        'Marine Fish',
        'Cold Water Fish',
        'Breeding Pairs'
      ]
    },
    {
      title: 'Aquatic Plants',
      description: 'Transform your aquarium into a lush underwater garden with our selection of live aquatic plants. Perfect for creating natural habitats and maintaining water quality.',
      image: 'https://images.unsplash.com/photo-1584135135867-9037c3ec1d04?ixlib=rb-4.0.3',
      items: [
        'Foreground Plants',
        'Background Plants',
        'Floating Plants',
        'Easy-care Plants'
      ]
    },
    {
      title: 'Aquarium Accessories',
      description: 'Everything you need to create and maintain the perfect aquatic environment. From filters to decorations, we have all your aquarium essentials.',
      image: 'https://images.unsplash.com/photo-1612095935072-6e15e1331b8c?ixlib=rb-4.0.3',
      items: [
        'Filters & Pumps',
        'Lighting Systems',
        'Substrates',
        'Decorations'
      ]
    },
    {
      title: 'Maintenance & Care',
      description: 'Keep your aquarium thriving with our range of maintenance products and expert care supplies. Quality products for optimal aquatic health.',
      image: 'https://images.unsplash.com/photo-1622038492514-c40322742757?ixlib=rb-4.0.3',
      items: [
        'Water Treatments',
        'Test Kits',
        'Cleaning Tools',
        'Fish Food'
      ]
    }
  ];

  return (
    <PublicLayout>
      <Box sx={{ 
        padding: "24px",
        height: "100%",
        overflowY: "auto"
      }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.9) 30%, rgba(67, 160, 71, 0.9) 90%)',
            color: 'white',
            borderRadius: 2,
            padding: { xs: 3, md: 8 },
            marginBottom: 4,
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: '2rem',
                sm: '2.5rem',
                md: '3rem'
              }
            }}
          >
            Welcome to AquaaFerns
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Your one-stop destination for all things aquatic
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => navigate('/product-list')}
            sx={{ 
              backgroundColor: 'white',
              color: '#1976d2',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Explore Our Products
          </Button>
        </Box>

        {/* Categories Section */}
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {categories.map((category, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image}
                    alt={category.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                      {category.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {category.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Featured Items:
                      </Typography>
                      {category.items.map((item, i) => (
                        <Typography key={i} variant="body2" color="text.secondary">
                          • {item}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Instagram Feed Section */}
          <Box sx={{ mt: 6, mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
              Follow Us on Instagram
            </Typography>
            <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
              <InstagramFeed accessToken={process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN} />
            </Box>
          </Box>

          {/* About Section */}
          <Box sx={{ 
            mt: 6, 
            mb: 4, 
            textAlign: 'center',
            padding: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Why Choose AquaaFerns?
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Expert Guidance
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our team of aquarium enthusiasts provides personalized advice for your aquatic needs.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Quality Products
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  We source only the healthiest fish and plants, and the most reliable equipment.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Customer Support
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Dedicated support for all your aquarium-related questions and concerns.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </PublicLayout>
  );
};

export default PublicHome;
