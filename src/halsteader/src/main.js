// Import required modules
const express = require('express');
const escomplex = require('escomplex');
const cors = require("cors");


// Initialize the Express app
const app = express();

app.use(cors(
  {
    origin: "*"
  }
));

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Function to calculate Halstead metrics
const analyzeHalstead = (code) => {
  const report = escomplex.analyse(code);
  return report.aggregate.halstead;
};

// API endpoint to analyze code and return Halstead metrics
app.post('/analyze', (req, res) => {
  const { code } = req.body;

  // Validate input
  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      error: 'Invalid input. Please provide a valid JavaScript code string in the request body.'
    });
  }

  try {
    // Calculate Halstead metrics
    const halsteadMetrics = analyzeHalstead(code);

    // Format the result to match the required structure
    const result = {
      total_operands: halsteadMetrics.operands.total,
      distinct_operands: halsteadMetrics.operands.distinct,
      total_operators: halsteadMetrics.operators.total,
      distinct_operators: halsteadMetrics.operators.distinct,
      time: halsteadMetrics.time,
      bugs: halsteadMetrics.bugs,
      effort: halsteadMetrics.effort,
      volume: halsteadMetrics.volume,
      difficulty: halsteadMetrics.difficulty,
      vocabulary: halsteadMetrics.vocabulary,
      length: halsteadMetrics.length      
    };

    res.json(result);
  } catch (error) {
    console.error('Error analyzing code:', error);
    res.status(500).json({ error: 'An error occurred while analyzing the code.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Halstead Metrics API is running on port ${PORT}`);
});