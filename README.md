
# KisanAI: Empowering Farmers with AI

This is a Next.js web application for KisanAI, designed to provide farmers with AI-powered tools and agricultural information.

## Core Features

- **Dashboard**: At-a-glance view of weather, crop tips, and quick access to all tools.
- **AI Tools**: A suite of tools including a Disease Detector, AI Chatbot, and Voice Assistant powered by Google Gemini.
- **Farm Management**: Tools like Crop Advisory, Farm Planner, and Soil Health analysis.
- **Market & Data**: Real-time market prices and satellite imagery for farm monitoring.
- **Community**: A place for farmers to connect and share knowledge.

## Getting Started

To get started, run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`. The main page is located at `src/app/page.tsx`.

## Generative AI Configuration

The application uses Google's Generative AI models. To configure it, you need to set environment variables.

1.  **Create a `.env` file** in the root of the project.
2.  **Add your Authentication Credentials**:
    You must provide either an API key or a Bearer token.
    ```env
    # Required: Your Google AI API key.
    GENAI_API_KEY="your-google-ai-api-key"

    # Optional: If you use a service account or OAuth, provide a bearer token.
    # If GENAI_BEARER is set, it will be used instead of the API key.
    # GENAI_BEARER="ya29.a0.Abc..."
    ```
3.  **Specify the Model (Required)**:
    You must specify which model to use.
    ```env
    # Required: Set the model ID to use for generative features.
    # The app will fail to start if this is not set.
    GENAI_MODEL="gemini-1.5-flash"
    ```

### Listing Available Models

To find out which models are available for your API key and region, run the following command. This is useful for finding a valid ID for `GENAI_MODEL`.

```bash
npm run list-genai-models
```

### Testing the Image Flow

A dedicated script allows you to test the AI disease detection flow directly from your terminal. This is useful for debugging and checking model responses without running the full web application.

The `sharp` library is required for image processing. Install it if you haven't already:
```bash
npm install sharp
```

Then, run the script with a path to a sample image:
```bash
# Ensure GENAI_API_KEY and GENAI_MODEL are set in your .env file
npm run test-image-flow ./path/to/your/leaf-image.jpg
```

**Simulating a Model Not Found (404) Error:**

To see how the application handles an unavailable model, set `GENAI_MODEL` to a non-existent ID and run the test script:
```bash
GENAI_MODEL="bogus-model-id" npm run test-image-flow ./path/to/your/leaf-image.jpg
```
The script will fail but will print a list of available models from your project, helping you choose a valid one.

```