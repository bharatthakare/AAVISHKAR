
// To run: node -r dotenv/config scripts/test-image-flow.js <path_to_image>
// Example: GENAI_API_KEY="..." NEXT_PUBLIC_GENAI_MODEL="gemini-1.5-flash-latest" node scripts/test-image-flow.js ./samples/healthy-leaf.jpg

const fs = require('fs');
const path = require('path');
const {
  generateContentWithDiagnostics,
} = require('../dist/ai/lib/genai-utils');
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

const modelId = process.env.NEXT_PUBLIC_GENAI_MODEL || 'gemini-1.5-flash-latest';
const promptTemplate = `You are an expert AI botanist. Analyze the following image of a plant leaf. Identify any diseases, list its symptoms, and provide a comprehensive treatment plan.
Respond in a valid JSON format. If no disease is detected, state that the plant appears healthy.

Output JSON Schema:
{
  "diseaseName": "string",
  "symptoms": ["string"],
  "confidence": "number (0.0 to 1.0)",
  "solution": "string",
  "pesticideRecommendation": "string",
  "preventiveMeasures": ["string"]
}`;

async function runTest() {
  console.log(`[INFO] Testing with image: ${imagePath}`);
  console.log(`[INFO] Using model: ${modelId}\n`);

  try {
    // 1. Read and preprocess the image
    const initialBuffer = fs.readFileSync(imagePath);
    const { buffer: processedBuffer } = await preprocessImage(initialBuffer);
    console.log(
      `[INFO] Image preprocessed successfully. New size: ${Math.round(
        processedBuffer.length / 1024
      )} KB`
    );

    // 2. Prepare payload for the model
    const payload = {
      contents: [
        {
          parts: [
            { text: promptTemplate },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: processedBuffer.toString('base64'),
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    };

    // 3. Call the model
    const { response, diagnostics } = await generateContentWithDiagnostics(
      modelId,
      payload
    );

    // 4. Print results
    console.log('\n--- EXECUTION FINISHED ---');
    if (diagnostics) {
      console.log('🔴 STATUS: FAILED');
      console.log('\n--- DIAGNOSTICS ---');
      console.log(JSON.stringify(diagnostics, null, 2));
    } else {
      console.log('✅ STATUS: SUCCESS');
      console.log('\n--- MODEL RESPONSE ---');
      const rawJson = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawJson) {
        try {
          console.log(JSON.stringify(JSON.parse(rawJson), null, 2));
        } catch {
          console.log('--- Raw (non-JSON) Response ---');
          console.log(rawJson);
        }
      } else {
        console.log('Model returned an empty response body.');
      }
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
