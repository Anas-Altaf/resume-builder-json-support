import { getSuggestions } from '../../utils/gemini';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are accepted' 
    });
  }

  const { section, content } = req.body;

  if (!section || !content) {
    return res.status(400).json({ 
      error: 'VALIDATION_ERROR',
      message: 'Missing required fields: section and content' 
    });
  }

  try {
    const suggestions = await getSuggestions(section, content);
    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific error types
    if (error.message.startsWith('CONTENT_ERROR:')) {
      return res.status(400).json({
        error: 'CONTENT_ERROR',
        message: error.message.replace('CONTENT_ERROR: ', '')
      });
    }
    
    if (error.message.startsWith('QUOTA_ERROR:')) {
      return res.status(429).json({
        error: 'QUOTA_ERROR',
        message: error.message.replace('QUOTA_ERROR: ', '')
      });
    }
    
    if (error.message.startsWith('API_ERROR:')) {
      return res.status(500).json({
        error: 'API_ERROR',
        message: error.message.replace('API_ERROR: ', '')
      });
    }

    if (error.message.startsWith('RATE_ERROR:')) {
      return res.status(429).json({
        error: 'RATE_ERROR',
        message: error.message.replace('RATE_ERROR: ', '')
      });
    }

    // Generic error fallback
    return res.status(500).json({
      error: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred. Please try again.'
    });
  }
} 