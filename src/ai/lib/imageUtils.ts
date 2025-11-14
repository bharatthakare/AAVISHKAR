
'use server';

/**
 * @fileoverview Image processing and validation utilities for AI flows.
 *
 * This module uses the `sharp` library for high-performance image manipulation.
 * Ensure `sharp` is installed in your project:
 * npm install sharp
 */

import sharp from 'sharp';

const MAX_DIMENSION = 1024; // Max width or height for preprocessing
const SUPPORTED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

// --- Validation ---

interface ValidationResult {
  ok: boolean;
  reason?: 'UNSUPPORTED_MIME' | 'CORRUPTED_IMAGE' | 'EMPTY_IMAGE';
  width?: number;
  height?: number;
  mime?: string;
}

/**
 * Validates an image buffer to ensure it's a supported, valid image format.
 * Does not throw, returns a result object.
 */
export async function validateImage(
  buffer: Buffer,
  filename?: string
): Promise<ValidationResult> {
  if (buffer.length === 0) {
    return { ok: false, reason: 'EMPTY_IMAGE' };
  }

  try {
    const metadata = await sharp(buffer).metadata();
    const mime = `image/${metadata.format}`;

    if (!metadata.format || !SUPPORTED_MIMES.includes(mime)) {
      return { ok: false, reason: 'UNSUPPORTED_MIME' };
    }

    return {
      ok: true,
      width: metadata.width,
      height: metadata.height,
      mime,
    };
  } catch (error) {
    console.error(`Image validation failed for ${filename || 'file'}:`, error);
    return { ok: false, reason: 'CORRUPTED_IMAGE' };
  }
}

// --- Preprocessing ---

interface PreprocessResult {
  buffer: Buffer;
  width: number;
  height: number;
}

/**
 * Preprocesses an image by resizing it to a maximum dimension,
 * ensuring it's in RGB format, and returning a clean JPEG buffer.
 * Throws an error if image is invalid.
 */
export async function preprocessImage(
  buffer: Buffer
): Promise<PreprocessResult> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  let transform = image;

  // Resize if either dimension exceeds the max size
  if (
    metadata.width &&
    metadata.height &&
    (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION)
  ) {
    transform = transform.resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Convert to RGB (strips alpha channel), then to JPEG buffer
  const processedBuffer = await transform.ensureAlpha().toFormat('jpeg').toBuffer();
  const finalMetadata = await sharp(processedBuffer).metadata();

  return {
    buffer: processedBuffer,
    width: finalMetadata.width!,
    height: finalMetadata.height!,
  };
}

// --- Heuristics ---

interface ImageHeuristics {
  isBlurry: boolean;
  isLowContrast: boolean;
}

/**
 * Runs simple heuristics on an image to detect potential quality issues.
 * @param buffer A Buffer containing raw pixel data (e.g., from sharp.raw()).
 * @param width The width of the image.
 * @param height The height of the image.
 */
export async function analyzeImageQuality(
  imageBuffer: Buffer,
): Promise<ImageHeuristics> {
    const image = sharp(imageBuffer);
    const { width, height } = await image.metadata();

    if (!width || !height) {
        throw new Error('Could not determine image dimensions for quality analysis.');
    }
    
    // 1. Blur Detection (Variance of Laplacian)
    // Convolve with Laplacian kernel, then calculate variance of the result.
    // Low variance suggests blurriness.
    const laplacianKernel = [
        [0, 1, 0],
        [1, -4, 1],
        [0, 1, 0],
    ];

    const { data: laplacianBuffer, info: laplacianInfo } = await image
        .greyscale()
        .raw()
        .convolve({
            width: 3,
            height: 3,
            kernel: laplacianKernel.flat(),
        })
        .toBuffer({ resolveWithObject: true });

    let mean = 0;
    for (let i = 0; i < laplacianBuffer.length; i++) {
        mean += laplacianBuffer[i];
    }
    mean /= laplacianBuffer.length;

    let variance = 0;
    for (let i = 0; i < laplacianBuffer.length; i++) {
        variance += Math.pow(laplacianBuffer[i] - mean, 2);
    }
    variance /= laplacianBuffer.length;

    // Threshold can be tuned. Values < 100 are often blurry for photos.
    const isBlurry = variance < 100;

    // 2. Low Contrast Detection
    const stats = await image.stats();
    // Use standard deviation of the most prominent channel as a proxy for contrast
    const maxStdDev = Math.max(...stats.channels.map(c => c.stdev));
    // Threshold can be tuned. Low std dev suggests muted tones.
    const isLowContrast = maxStdDev < 20;

    return {
        isBlurry,
        isLowContrast,
    };
}
