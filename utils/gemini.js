import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with API version v1
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeResume(resumeData) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing Gemini API key");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Analyze this resume data and provide feedback on:
  1. Overall strength and weaknesses
  2. ATS optimization suggestions
  3. Content improvement recommendations
  
  Resume Data:
  ${JSON.stringify(resumeData, null, 2)}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return "Error analyzing resume. Please try again.";
  }
}

export async function getSuggestions(section, currentContent) {
  // Check for API key first
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("API_ERROR: Missing or invalid Gemini API key");
  }

  // Validate content
  if (!currentContent || currentContent.trim() === '') {
    throw new Error("CONTENT_ERROR: Please write something first to get suggestions");
  }

  // Check for minimum content length
  if (currentContent.trim().length < 10) {
    throw new Error("CONTENT_ERROR: Please write at least a few words to get meaningful suggestions");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a friendly resume writing assistant. Look at this ${section} content and suggest 2 slightly improved versions. 
    Keep the same meaning and information, but make it flow better. Use natural, conversational language - no complex jargon.
    Make it sound like a real person wrote it.

    Important guidelines:
    - Keep the same key points and achievements
    - Use simple, clear language
    - Make it sound natural and conversational
    - Keep a similar length
    - Don't add new information
    
    Current content:
    ${currentContent}

    Format your response as:
    Option 1:
    [first natural improvement]

    Option 2:
    [second natural improvement]`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);

    // Handle specific API errors
    if (error.message?.includes('quota')) {
      throw new Error("QUOTA_ERROR: API quota exceeded. Please try again later");
    }
    if (error.message?.includes('invalid')) {
      throw new Error("API_ERROR: Invalid API key");
    }
    if (error.message?.includes('rate')) {
      throw new Error("RATE_ERROR: Too many requests. Please wait a moment");
    }

    // Generic error fallback
    throw new Error(`API_ERROR: ${error.message || 'Failed to generate suggestions'}`);
  }
} 