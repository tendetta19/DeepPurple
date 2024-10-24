// src/components/UrlInput.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function UrlInput({ onAnalyze, onError, setLoading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      onError('Please enter a valid URL.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (response.ok) {
        onAnalyze(data);
      } else {
        onError(data.error || 'An error occurred while analyzing the URL.');
      }
    } catch (error) {
      onError('Failed to connect to the server.');
    }
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Enter Web Page URL"
        variant="outlined"
        fullWidth
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Analyze URL
      </Button>
    </Box>
  );
}

export default UrlInput;
