
'use client';

import { useState, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Upload, X, Loader2, Microscope, Stethoscope, Pill, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiDiseaseDetection } from '@/ai/flows/ai-disease-detection';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { AIDiseaseDetectionOutput } from '@/ai/schemas/disease-detection';


export function DiseaseDetectorClient() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [result, setResult] = useState<AIDiseaseDetectionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: 'destructive',
          title: 'Image too large',
          description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setImageData(base64String);
      };
      reader.readAsDataURL(file);
      setResult(null); // Reset previous result
    }
  };

  const handleAnalyze = async () => {
    if (!imageData) {
      toast({
        variant: 'destructive',
        title: 'No image selected',
        description: 'Please upload an image to analyze.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await aiDiseaseDetection({ plantImage: imageData });
      setResult(response);
       if (response.status === 'error') {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: response.message,
        });
      }
    } catch (error) {
      console.error('AI Disease Detection Error:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the image. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageData(null);
    setResult(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (result.status === 'error') {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      );
    }

    const { diagnosis } = result;

    return (
      <>
        <Card className="rounded-2xl shadow-lg border-primary border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Microscope />
              Analysis Result
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-gray-800 pt-2">
              {diagnosis.diseaseName}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader><CardTitle className="flex items-center gap-2"><Stethoscope /> Symptoms</CardTitle></CardHeader>
          <CardContent><p>{diagnosis.symptoms.join(', ')}</p></CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-md">
          <CardHeader><CardTitle className="flex items-center gap-2"><Pill /> Solution</CardTitle></CardHeader>
          <CardContent><p>{diagnosis.solution}</p></CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck /> Pesticide & Prevention</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Pesticide Recommendation</h3>
              <p>{diagnosis.pesticideRecommendation}</p>
            </div>
            <div>
              <h3 className="font-semibold">Preventive Measures</h3>
              <p>{diagnosis.preventiveMeasures.join(', ')}</p>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="AI Disease Detector"
        subtitle="Upload a plant image to identify diseases and get solutions"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Upload Plant Image</CardTitle>
            <CardDescription>Select a clear photo of the affected plant part.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <div className="relative group">
                  <Image
                    src={imagePreview}
                    alt="Plant preview"
                    width={500}
                    height={300}
                    className="rounded-md object-contain max-h-64 w-full"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); clearImage(); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-10 w-10" />
                  <p>Click to upload or drag and drop</p>
                  <p className="text-xs">PNG, JPG, or WEBP (Max 4MB)</p>
                </div>
              )}
            </div>
            <Button
              className="w-full"
              onClick={handleAnalyze}
              disabled={!imageData || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Plant Health'
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {isLoading && (
            <Card className="rounded-2xl shadow-lg animate-pulse">
                <CardHeader><div className="h-6 w-1/2 bg-muted rounded"></div></CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-4 w-3/4 bg-muted rounded"></div>
                </CardContent>
            </Card>
          )}

          {renderResult()}
        </div>
      </div>
    </div>
  );
}
