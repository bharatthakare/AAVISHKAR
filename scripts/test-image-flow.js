
// To run: node -r dotenv/config scripts/test-image-flow.js <path_to_image>
// Example: GENAI_API_KEY="..." NEXT_PUBLIC_GENAI_MODEL="gemini-pro" node scripts/test-image-flow.js ./samples/healthy-leaf.jpg

const fs = require('fs');
const path = require('path');
const {
  aiDiseaseDetection
} = require('../dist/ai/flows/ai-disease-detection');
const { preprocessImage } = require('../dist/ai/lib/imageUtils');

const imagePath = process.argv[2];
if (!imagePath) {
  console.error('Error: Please provide a path to an image file.');
  process.exit(1);
}

if (!process.env.GENAI_API_KEY) {
  console.error(
    'Error: GENAI_API_KEY is not set. Please set it in your .env file or environment.'
  );
  process.exit(1);
}

async function runTest() {
  console.log(`[INFO] Testing with image: ${imagePath}`);
  console.log(`[INFO] Using model: ${process.env.NEXT_PUBLIC_GENAI_MODEL || 'gemini-pro'}\n`);

  try {
    // 1. Read and preprocess the image
    const initialBuffer = fs.readFileSync(imagePath);
    const dataUri = `data:image/jpeg;base64,${initialBuffer.toString('base64')}`;

    // 2. Call the flow
    const result = await aiDiseaseDetection({ plantImage: dataUri });


    // 3. Print results
    console.log('\n--- EXECUTION FINISHED ---');
    if (result.status === 'error') {
      console.log('🔴 STATUS: FAILED');
      console.log('\n--- DIAGNOSTICS ---');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('✅ STATUS: SUCCESS');
      console.log('\n--- MODEL RESPONSE ---');
      console.log(JSON.stringify(result.diagnosis, null, 2));
    }
  } catch (error) {
    console.error('\n--- UNHANDLED SCRIPT ERROR ---');
    console.error(error);
    process.exit(1);
  }
}

// Compile TypeScript files before running if not already done
const { exec } = require('child_process');
exec('npx tsc', (err, stdout, stderr) => {
  if (err) {
    console.error('TypeScript compilation failed:');
    console.error(stderr);
    process.exit(1);
  }
  runTest();
});
