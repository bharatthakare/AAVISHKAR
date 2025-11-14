// To run: node -r dotenv/config scripts/list-genai-models.js
// Make sure to have a .env file with GENAI_API_KEY="your-api-key"
const fetch = require('node-fetch');

async function listModels() {
  const apiKey = process.env.GENAI_API_KEY;
  if (!apiKey) {
    console.error('Error: GENAI_API_KEY is not set in your environment or .env file.');
    process.exit(1);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    console.log('Available Models:');
    console.log(JSON.stringify(data.models, null, 2));
  } catch (error) {
    console.error('Failed to retrieve models:', error.message);
  }
}

listModels();
