
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Bot, Send, User, Paperclip, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// --- Types for direct Gemini API call ---
type GeminiPart =
  | { text: string; inline_data?: never }
  | { text?: never; inline_data: { mime_type: string; data: string } };

type GeminiRequest = {
  contents: [{ role: 'user'; parts: GeminiPart[] }];
};

type GeminiCandidate = {
  content: {
    parts: [{ text: string }];
  };
  finishReason: string;
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
  error?: { message: string; code: number };
};

// --- Our app's internal types ---
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isThinking?: boolean;
  image?: string;
  isError?: boolean;
};

type AIError = {
    status: 'error';
    code: string;
    message: string;
    diagnostics?: any;
}


export function ChatbotClient() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your KisanAI assistant. Ask me anything about farming, or upload an image for analysis.",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // --- Environment Variables ---
  const API_KEY = "AIzaSyBwQc2U_2xQJ3eR9vXmY1Zz-8jF7kL4w0s";
  const MODEL_NAME = 'gemini-1.5-flash'; // Must be a model that supports multimodal input

  useEffect(() => {
    // Only add the error message if the key is missing AND the error isn't already shown
    if (!API_KEY && !messages.some((m) => m.id === 'env-error')) {
      const errorMessage: Message = {
        id: 'env-error',
        text: "Configuration error: The `NEXT_PUBLIC_GEMINI_API_KEY` is missing. Please add it to your .env.local file.",
        sender: 'bot',
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  }, [API_KEY]);


  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageData(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleAiError = (error: AIError) => {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: `${error.message} (Code: ${error.code})`,
        sender: 'bot',
        isError: true,
      };
      setMessages((prev) => [
        ...prev.filter((m) => !m.isThinking),
        errorMessage,
      ]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !imageData) || isLoading) return;
     if (!API_KEY) {
      handleAiError({status: 'error', code: "NOT_CONFIGURED", message: "The application is not configured correctly. Missing API Key."});
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input || "Please analyze this image.",
      sender: 'user',
      image: imagePreview || undefined,
    };
    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '...',
      sender: 'bot',
      isThinking: true,
    };

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);

    // --- Store current inputs and clear UI ---
    const currentInput = input;
    const currentImageData = imageData; // This is a data URI: "data:image/jpeg;base64,..."
    setInput('');
    clearImage();
    setIsLoading(true);

    // --- Direct-to-Gemini API Call ---
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    // --- Build Gemini Request Body ---
    const parts: GeminiPart[] = [];
    if (currentInput.trim()) {
        parts.push({ text: `You are a helpful agriculture assistant. Question: ${currentInput}` });
    } else {
        parts.push({ text: "You are a helpful agriculture assistant. Please analyze the attached image."})
    }

    if (currentImageData) {
      const [meta, base64Data] = currentImageData.split(',');
      const mimeType = meta.split(':')[1].split(';')[0];
      parts.push({
        inline_data: { mime_type: mimeType, data: base64Data },
      });
    }

    const requestBody: GeminiRequest = {
      contents: [{ role: 'user', parts: parts }],
    };

    // --- Make fetch request and handle response safely ---
    try {
      const apiResponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const responseText = await apiResponse.text();
      let responseJson: GeminiResponse;

      try {
        responseJson = JSON.parse(responseText);
      } catch (e) {
        // The server returned a non-JSON response (e.g., HTML error page)
        handleAiError({
            status: 'error',
            code: `INVALID_RESPONSE_FROM_SERVER (HTTP ${apiResponse.status})`,
            message: 'The AI service returned an unreadable response.',
            diagnostics: { rawResponse: responseText.substring(0, 500) }
        });
        return;
      }
      
      if (responseJson.error) {
        handleAiError({
            status: 'error',
            code: `GEMINI_API_ERROR_${responseJson.error.code}`,
            message: responseJson.error.message
        });
        return;
      }

      const answer = responseJson.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (answer) {
        const botMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: answer,
          sender: 'bot',
        };
        setMessages((prev) => [
          ...prev.filter((m) => !m.isThinking),
          botMessage,
        ]);
      } else {
        handleAiError({
            status: 'error',
            code: 'NO_ANSWER_IN_RESPONSE',
            message: 'The AI model returned a valid response but it contained no answer.',
            diagnostics: responseJson
        });
      }

    } catch (error: any) {
      handleAiError({
        status: 'error',
        code: 'CLIENT_FETCH_ERROR',
        message: 'An error occurred while trying to contact the AI service.',
        diagnostics: { message: error.message }
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-8 h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="AI Chatbot"
        subtitle="Ask any question in any language"
      />
      <Card className="flex-grow flex flex-col rounded-2xl shadow-lg">
        <CardContent className="flex-grow p-0">
          <ScrollArea className="h-[calc(100vh-22rem)] p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-3',
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender === 'bot' && (
                    <Avatar>
                      <AvatarFallback className={cn("bg-primary text-primary-foreground", message.isError && "bg-destructive text-destructive-foreground")}>
                        {message.isError ? <AlertTriangle /> : <Bot />}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  { message.isError ? (
                    <Alert variant="destructive" className="max-w-md">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Assistant Error</AlertTitle>
                        <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  ) : (
                    <div
                      className={cn(
                        'max-w-md rounded-2xl px-4 py-3 text-sm md:text-base',
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none',
                        message.isThinking && 'animate-pulse'
                      )}
                    >
                      {message.image && <Image src={message.image} alt="user upload" width={200} height={200} className="rounded-md mb-2" />}
                      {message.text}
                    </div>
                  )}
                  {message.sender === 'user' && (
                    <Avatar>
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <Button variant="ghost" size="icon" type="button" className='shrink-0' onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="w-5 h-5" />
                <span className="sr-only">Attach image</span>
            </Button>
            <div className='relative flex-grow'>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={imagePreview ? "Add a comment for the image..." : "Type your message..."}
                  className="flex-grow pr-24"
                  disabled={isLoading}
                />
                {imagePreview && (
                    <div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2'>
                        <Image src={imagePreview} alt="preview" width={24} height={24} className="rounded-sm" />
                        <Button variant="ghost" size="icon" className='h-6 w-6' onClick={clearImage}>
                            <X className='h-4 w-4'/>
                        </Button>
                    </div>
                )}
            </div>
            <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !imageData)} className='shrink-0'>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
