// src/components/TextInput.js
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, TextField, CircularProgress, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

function TextInput({ onAnalyze, onError, setLoading }) {
  const [text, setText] = useState('');
  const [error, setLocalError] = useState(null); // Local error state
  const API_URL = process.env.REACT_APP_API_URL // || 'http://localhost:5000';
  const handleAnalyze = async () => { 
    if (!text.trim()) {
      setLocalError('Please enter some text to analyze.');
      onError('Please enter some text to analyze.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('text', text);

    try {
      const response = await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onAnalyze(response.data);
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || 'An error occurred during analysis.';
      setLocalError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        border: '1px solid #6A1B9A',
        borderRadius: '8px',
        padding: '2rem',
        backgroundColor: '#fff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <EditIcon color="secondary" sx={{ fontSize: 50, marginBottom: '1rem' }} />
      <Typography variant="h6" gutterBottom>
        Enter Text
      </Typography>
      <TextField
        multiline
        rows={6}
        variant="outlined"
        placeholder="Type or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ marginBottom: '1rem' }}
      />
      <Button variant="contained" color="secondary" onClick={handleAnalyze}>
        Analyze Text
      </Button>
      {/* Display local error if any */}
      {error && (
        <Alert severity="error" sx={{ marginTop: '1rem' }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default TextInput;
