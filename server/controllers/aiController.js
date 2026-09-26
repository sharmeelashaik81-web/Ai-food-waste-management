const geminiService = require('../services/geminiService');

exports.predictSurplus = async (req, res) => {
  try {
    const result = await geminiService.predictSurplus(req.body);
    return res.json({
      success: true,
      prediction: result
    });
  } catch (error) {
    console.error('AI Surplus Prediction Error:', error);
    return res.status(500).json({ success: false, message: 'AI prediction model error.' });
  }
};

exports.analyzeFreshness = async (req, res) => {
  try {
    const result = await geminiService.analyzeFoodFreshness(req.body);
    return res.json({
      success: true,
      analysis: result
    });
  } catch (error) {
    console.error('AI Freshness Analysis Error:', error);
    return res.status(500).json({ success: false, message: 'AI freshness analysis error.' });
  }
};
