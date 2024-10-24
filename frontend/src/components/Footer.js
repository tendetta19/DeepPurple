// src/components/Footer.js
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        textAlign: 'center',
        width: '100%', // Ensures full width
      }}
    >
      <Typography variant="body1">
        &copy; {new Date().getFullYear()} DeepPurple. All rights reserved.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <Link href="#" color="inherit">
          Privacy Policy
        </Link>{' '}
        |{' '}
        <Link href="#" color="inherit">
          Terms of Service
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer;
