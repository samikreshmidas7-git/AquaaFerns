const express = require('express');
const app = express();

// Import test auth routes
const testAuth = require('./routes/test-auth');

// Mount routes
app.use('/api/auth', testAuth);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
