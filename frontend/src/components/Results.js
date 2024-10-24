// src/components/Results.js
import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import ReactMarkdown from 'react-markdown';
import { styled } from '@mui/system';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import sanitizeHtml from 'sanitize-html';

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

function Results({ analysis }) {
  // Sanitize the analysis content
  const sanitizedAnalysis = sanitizeHtml(analysis, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'h3', 'pre', 'code']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      code: ['className'],
    },
  });

  return (
    <Box>
      <Paper elevation={3} sx={{ padding: '2rem' }}>
        <Box display="flex" alignItems="center" marginBottom="1rem">
          <DescriptionIcon color="success" sx={{ marginRight: '0.5rem' }} />
          <Typography variant="h6">Analysis Results</Typography>
        </Box>
        <Divider sx={{ marginBottom: '1rem' }} />
        <ReactMarkdown
          children={sanitizedAnalysis}
          components={{
            h1: ({ node, ...props }) => <StyledTypography variant="h4" gutterBottom {...props} />,
            h2: ({ node, ...props }) => <StyledTypography variant="h5" gutterBottom {...props} />,
            h3: ({ node, ...props }) => <StyledTypography variant="h6" gutterBottom {...props} />,
            p: ({ node, ...props }) => <StyledTypography variant="body1" paragraph {...props} />,
            li: ({ node, ...props }) => (
              <li>
                <StyledTypography variant="body1" component="span" {...props} />
              </li>
            ),
            strong: ({ node, ...props }) => (
              <strong style={{ color: '#6A1B9A' }} {...props} />
            ),
            em: ({ node, ...props }) => <em style={{ color: '#FF4081' }} {...props} />,
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={materialDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        />
      </Paper>
    </Box>
  );
}

export default Results;
