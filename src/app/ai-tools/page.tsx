import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Mic, ShieldPlus, BrainCircuit, ScanSearch } from 'lucide-react';
import Link from 'next/link';

const aiTools = [
  {
    title: 'AI Disease Detector',
    description: 'Upload a plant image to identify diseases and get solutions.',
    icon: ShieldPlus,
    href: '/disease-detector',
  },
  {
    title: 'AI Chatbot',
    description: 'Ask any farming question in any language.',
    icon: Bot,
    href: '/chatbot',
  },
  {
    title: 'Voice Assistant',
    description: 'Use your voice to ask questions and get spoken answers.',
    icon: Mic,
    href: '/voice-assistant',
  },
  {
    title: 'Plant Doctor',
    description: 'Get a comprehensive health check-up for your plant.',
    icon: ScanSearch,
    href: '/disease-detector', // Re-uses detector for this
  },
  {
    title: 'Ask Anything Tool',
    description: 'Your general purpose AI assistant for all queries.',
    icon: BrainCircuit,
    href: '/chatbot', // Re-uses chatbot for this
  },
];

export default function AIToolsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="AI Tools"
        subtitle="Leverage the power of AI for smarter farming."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {aiTools.map((tool) => (
          <Link href={tool.href} key={tool.title} className="group block">
            <Card
              className="glass-card p-6 flex flex-col items-center text-center h-full hover:scale-105 hover:border-primary"
            >
              <div className="bg-primary/10 text-primary rounded-full p-4 mb-4">
                <tool.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-headline text-foreground">
                {tool.title}
              </h3>
              <p className="mt-2 text-muted-foreground flex-grow">
                {tool.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
