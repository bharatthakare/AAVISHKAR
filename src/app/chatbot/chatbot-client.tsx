
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

// Matches the expected JSON response from our /api/ai-chat route
type AIChatbotAssistanceOutput =
  | {
      status: 'ok';
      answer: string;
    }
  | {
      status: 'error';
      code: string;
      message: string;
      diagnostics?: any;
      availableModels?: string[];
    };

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isThinking?: boolean;
  image?: string;
  isError?: boolean;
};

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
  
  const handleAiError = (response: Extract<AIChatbotAssistanceOutput, { status: 'error' }>) => {
      let displayMessage = response.message;
    
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: displayMessage,
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
    const currentInput = input;
    const currentImageData = imageData;
    
    const payload: any = {};
    if (currentInput && currentInput.trim() !== "") {
      payload.query = currentInput.trim();
    }
    if (currentImageData && currentImageData.trim() !== "") {
      payload.image = currentImageData;
    }

    setInput('');
    clearImage();
    setIsLoading(true);

    try {
      const apiResponse = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await apiResponse.text();
      let response: AIChatbotAssistanceOutput;

      try {
        response = JSON.parse(text);
      } catch (_) {
        response = {
          status: "error",
          code: "INVALID_JSON",
          message: `Server sent non-JSON (HTTP ${apiResponse.status})`,
          diagnostics: { raw: text.slice(0, 2000) },
        };
      }

      if (!apiResponse.ok || response.status === "error") {
        handleAiError(response as Extract<AIChatbotAssistanceOutput, { status: 'error' }>);
        return;
      }
      
      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: response.answer,
        sender: 'bot',
      };
      setMessages((prev) => [
        ...prev.filter((m) => !m.isThinking),
        botMessage,
      ]);
    } catch (error) {
      console.error(error);
      const errResponse: Extract<AIChatbotAssistanceOutput, { status: 'error' }> = {
          status: 'error',
          code: 'INTERNAL_ERROR',
          message: 'An unexpected client-side error occurred while contacting the AI service.'
      };
      handleAiError(errResponse);
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
