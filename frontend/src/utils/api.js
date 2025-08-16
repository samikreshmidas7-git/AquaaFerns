const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchApi = async (endpoint, options = {}) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    
    // Add auth token only for protected routes
    const token = localStorage.getItem('token');
    if (token && (
      endpoint.includes('/manage') || 
      endpoint.includes('/sales') || 
      options.method !== 'GET'
    )) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export const uploadFile = async (endpoint, formData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
