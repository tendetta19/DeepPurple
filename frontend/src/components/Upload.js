// src/components/Upload.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Input,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function Upload({ onAnalyze, onError, setLoading }) {
  const [files, setFiles] = useState([]);
  const [error, setLocalError] = useState(null); // Local error state
  const API_URL = process.env.REACT_APP_API_URL // || 'http://localhost:5000';

  const handleFileChange = (e) => {
    setFiles(e.target.files);
    setLocalError(null); // Reset local error on new file selection
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setLocalError('Please select at least one file to upload.');
      onError('Please select at least one file to upload.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]); // 'files' should match backend expectation
    }

    try {
      const response = await axios.post(`${API_URL}/api/analyze-files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onAnalyze(response.data);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'An error occurred during analysis.';
      setLocalError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        border: '2px dashed #6A1B9A',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#fafafa',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <CloudUploadIcon color="primary" sx={{ fontSize: 50, marginBottom: '1rem' }} />
      <Typography variant="h6" gutterBottom>
        Upload Files
      </Typography>
      <Input
        type="file"
        inputProps={{ accept: '.pdf,.txt,.docx,.xlsx', multiple: true }}
        onChange={handleFileChange}
        sx={{ marginBottom: '1rem' }}
      />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Analyze Files
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

export default Upload;
