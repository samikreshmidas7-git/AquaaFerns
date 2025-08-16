import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const InstagramFeed = ({ accessToken }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load of posts
    fetchPosts();

    // Set up auto-scrolling
    const scrollContainer = document.getElementById('instagram-feed-container');
    let scrollInterval;

    if (scrollContainer) {
      scrollInterval = setInterval(() => {
        if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
          // Reset to top when reached bottom
          scrollContainer.scrollTop = 0;
        } else {
          // Smooth scroll by 1 pixel
          scrollContainer.scrollTop += 1;
        }
      }, 50); // Adjust speed by changing this value
    }

    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, []);

  const fetchPosts = async () => {
    try {
      // Replace this with your actual Instagram API endpoint
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${accessToken}`
      );
      const data = await response.json();
      setPosts(data.data || []);
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      id="instagram-feed-container"
      sx={{
        height: '400px',
        overflowY: 'hidden',
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        '&:hover': {
          overflowY: 'auto'
        }
      }}
    >
      <Box sx={{ padding: '16px' }}>
        {posts.map((post) => (
          <Box
            key={post.id}
            sx={{
              marginBottom: '20px',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            {post.media_type === 'VIDEO' ? (
              <video
                src={post.media_url}
                controls
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <img
                src={post.media_url}
                alt={post.caption}
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover'
                }}
              />
            )}
            <Box sx={{ padding: '12px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                {post.caption}
              </p>
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontSize: '0.8rem'
                }}
              >
                View on Instagram
              </a>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default InstagramFeed;
