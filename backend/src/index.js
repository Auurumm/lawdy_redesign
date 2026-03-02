const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ContractInsight API is running',
    timestamp: new Date().toISOString()
  });
});

// Statistics endpoint
app.get('/api/statistics', (req, res) => {
  res.json({
    totalAnalysis: 0,
    monthlyAnalysis: 0,
    averageRisk: null,
    averageTime: '0분'
  });
});

// Contract analysis endpoint (placeholder)
app.post('/api/analyze', (req, res) => {
  const { file } = req.body;

  if (!file) {
    return res.status(400).json({
      error: 'No file provided'
    });
  }

  // Placeholder response
  res.json({
    success: true,
    message: 'Contract analysis started',
    analysisId: Date.now().toString(),
  });
});

// Get analysis result (placeholder)
app.get('/api/analysis/:id', (req, res) => {
  const { id } = req.params;

  // Placeholder response
  res.json({
    id,
    status: 'completed',
    risks: [],
    summary: '분석 결과가 여기에 표시됩니다.',
    createdAt: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ContractInsight API Server running on http://localhost:${PORT}`);
});
