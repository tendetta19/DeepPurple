// src/App.js
import React, { useState } from 'react';
import { Box, Grid, Container, Alert, Toolbar } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import HelpModal from './components/HelpModal';
import Upload from './components/Upload';
import TextInput from './components/TextInput';
import Results from './components/Results';
import LoadingOverlay from './components/LoadingOverlay';

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 60;

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Sidebar collapsed state

  const handleAnalysis = (data) => {
    setAnalysis(data.analysis);
    setError(null);
    setLoading(false); // Stop loading when analysis is done
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setAnalysis(null);
    setLoading(false); // Stop loading on error
  };

  const handleHelpOpen = () => {
    setIsHelpOpen(true);
  };

  const handleHelpClose = () => {
    setIsHelpOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Header */}
      <Header
        onHelpOpen={handleHelpOpen}
        onDrawerToggle={toggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        drawerWidthExpanded={drawerWidthExpanded}
        drawerWidthCollapsed={drawerWidthCollapsed}
      />

      {/* Main Content Wrapper */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          drawerWidthExpanded={drawerWidthExpanded}
          drawerWidthCollapsed={drawerWidthCollapsed}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: isSidebarCollapsed ? `${drawerWidthCollapsed}px` : `${drawerWidthExpanded}px`,
            transition: 'margin-left 0.3s ease',
            width: { sm: `calc(100% - ${isSidebarCollapsed ? drawerWidthCollapsed : drawerWidthExpanded}px)` },
          }}
        >
          <Toolbar /> {/* To account for fixed Header */}
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={6} id="upload-section">
                <Upload onAnalyze={handleAnalysis} onError={handleError} setLoading={setLoading} />
              </Grid>
              <Grid item xs={12} md={6} id="textinput-section">
                <TextInput onAnalyze={handleAnalysis} onError={handleError} setLoading={setLoading} />
              </Grid>
            </Grid>
            <Box sx={{ marginTop: '2rem' }} id="results-section">
              {error && (
                <Box sx={{ marginBottom: '1rem' }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              )}
              {analysis && <Results analysis={analysis} />}
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Help Modal */}
      <HelpModal open={isHelpOpen} onClose={handleHelpClose} />

      {/* Loading Overlay */}
      {loading && <LoadingOverlay />}
    </Box>
  );
}

export default App;
