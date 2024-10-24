// src/components/LandingPage.js
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';

function LandingPage() {
  const history = useHistory();

  const navigateTo = (path) => {
    history.push(path);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to DeepPurple
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigateTo('/webpage-analysis')}
        >
          Web Page Analysis
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigateTo('/file-analysis')}
        >
          File Analysis
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigateTo('/input-analysis')}
        >
          Input Analysis
        </Button>
      </Box>
    </Box>
  );
}

export default LandingPage;
