// src/components/LoadingOverlay.js
import React from 'react';
import { Backdrop, CircularProgress, Typography } from '@mui/material';

function LoadingOverlay() {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 2, // Ensures it sits above the sidebar
        flexDirection: 'column',
      }}
      open={true}
    >
      <CircularProgress color="inherit" />
      <Typography variant="h6" sx={{ mt: 2 }}>
        The analysis is in progress, please wait...
      </Typography>
    </Backdrop>
  );
}

export default LoadingOverlay;
