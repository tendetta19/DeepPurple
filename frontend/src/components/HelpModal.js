// src/components/HelpModal.js
import React from 'react';
import { Modal, Box, Typography, IconButton, List, ListItem, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  bgcolor: 'background.paper',
  border: '2px solid #6A1B9A',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

function HelpModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="help-modal-title"
      aria-describedby="help-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="help-modal-title" variant="h6" component="h2">
            Help & Instructions
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography id="help-modal-description" sx={{ mt: 2 }}>
            Welcome to DeepPurple! Here's how you can use the Emotion and Sentiment Analyzer:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Upload a File"
                secondary="Click on the 'Upload File' section to upload a text file (.txt, .md) or a PDF document (.pdf). Once uploaded, click 'Analyze File' to process the contents."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Enter Text"
                secondary="If you prefer, you can directly type or paste your text into the 'Enter Text' section. After entering your text, click 'Analyze Text' to see the sentiment and emotion analysis."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="View Results"
                secondary="After analysis, the results will appear below the input sections. You can review the primary and secondary emotions, along with a summary and actionable key takeaways."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Help & Support"
                secondary="If you encounter any issues or have questions, feel free to reach out to our support team via the contact information provided in the footer."
              />
            </ListItem>
          </List>
          <Typography sx={{ mt: 2 }}>
            For further assistance, please refer to our{' '}
            <a href="#" style={{ color: '#6A1B9A' }}>
              Privacy Policy
            </a>{' '}
            or{' '}
            <a href="#" style={{ color: '#6A1B9A' }}>
              Terms of Service
            </a>
            .
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}

export default HelpModal;
