'use client';
import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Bot, Loader2, Play, Pause, Volume2 } from 'lucide-react';
import { voiceAssistedQueries, type VoiceAssistedQueriesOutput } from '@/ai/flows/voice-assisted-queries';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function VoiceAssistantClient() {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [response, setResponse] = useState<VoiceAssistedQueriesOutput | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handleMicClick = () => {
    setIsListening((prev) => !prev);
    if (!isListening) {
      setResponse(null);
    }
  };

  const handleProcessQuery = async () => {
    if (!queryText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Query',
        description: 'Please type your question before processing.',
      });
      return;
    }
    setIsLoading(true);
    setIsListening(false);
    setResponse(null);
    try {
      const result = await voiceAssistedQueries({ query: queryText });
      setResponse(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to process your query.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (response?.audio && audioRef.current) {
      audioRef.current.src = response.audio;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [response]);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Voice Assistant"
        subtitle="Ask questions with your voice and hear the answers"
      />
      <div className="max-w-3xl mx-auto text-center">
        <Button
          onClick={handleMicClick}
          size="lg"
          className={cn(
            'h-24 w-24 rounded-full transition-all duration-300',
            isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary'
          )}
        >
          <Mic className="h-10 w-10" />
        </Button>
        <p className="mt-4 text-muted-foreground">
          {isListening ? "Listening... (Tap to stop)" : "Tap the mic to start speaking"}
        </p>

        <Card className="mt-8 text-left glass-card">
          <CardHeader>
            <CardTitle>Your Query</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Your spoken query will appear here. You can also type directly."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              rows={4}
            />
            <Button
              className="mt-4 w-full"
              onClick={handleProcessQuery}
              disabled={isLoading || isListening}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                'Process Query'
              )}
            </Button>
          </CardContent>
        </Card>

        {response && (
          <Card className="mt-8 text-left glass-card border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="text-primary" /> AI Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{response.answer}</p>
              <div className="flex items-center gap-4 bg-muted p-3 rounded-lg">
                <Button onClick={togglePlayback} size="icon" variant="ghost">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <div className="text-sm text-muted-foreground">
                    {isPlaying ? 'Playing response...' : 'Playback paused'}
                </div>
              </div>
              <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
