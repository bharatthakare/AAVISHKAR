'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Bot, Send, User, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { voiceAssistedQueries } from '@/ai/flows/voice-assisted-queries';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isThinking?: boolean;
};

export function ChatbotClient() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your KisanAI assistant. Ask me anything about farming.",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '...',
      sender: 'bot',
      isThinking: true,
    };

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await voiceAssistedQueries({ query: input });
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
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the AI.',
      });
      setMessages((prev) => prev.filter((m) => !m.isThinking));
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
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-md rounded-2xl px-4 py-3 text-sm md:text-base',
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none',
                      message.isThinking && 'animate-pulse'
                    )}
                  >
                    {message.text}
                  </div>
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
            <Button variant="ghost" size="icon" type="button" className='shrink-0'>
                <Paperclip className="w-5 h-5" />
                <span className="sr-only">Attach image</span>
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading} className='shrink-0'>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
