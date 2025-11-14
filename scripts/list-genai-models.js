// To run: node -r dotenv/config scripts/list-genai-models.js
// Make sure to have a .env file with GENAI_API_KEY or GENAI_BEARER.

const fetch = require('node-fetch');

async function listModels() {
  const apiKey = process.env.GENAI_API_KEY;
  const bearerToken = process.env.GENAI_BEARER || (apiKey && apiKey.startsWith('ya29.') ? apiKey : null);

  if (!apiKey && !bearerToken) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: GENAI_API_KEY or GENAI_BEARER is not set.');
    console.error('Please set one in your environment or a .env file.');
    process.exit(1);
  }

  let url;
  let options = { method: 'GET', headers: {} };

  if (bearerToken) {
    console.log('[INFO] Using Authorization: Bearer token for authentication.');
    url = 'https://generativelanguage.googleapis.com/v1beta/models';
    options.headers['Authorization'] = `Bearer ${bearerToken}`;
  } else {
    console.log('[INFO] Using API Key for authentication.');
    url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  }

  try {
    const response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
        console.error('\x1b[31m%s\x1b[0m', `Authentication failed (Status: ${response.status}).`);
        console.error('Please check that your GENAI_API_KEY or GENAI_BEARER is correct and has the necessary permissions.');
        process.exit(1);
    }
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log('\n✅ Available Models:\n');
    console.log(JSON.stringify(data.models, null, 2));

  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Failed to retrieve models:');
    console.error(error.message);
    process.exit(1);
  }
}

listModels();
