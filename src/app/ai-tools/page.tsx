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
    glowColor: 'from-green-500/50',
  },
  {
    title: 'AI Chatbot',
    description: 'Ask any farming question in any language.',
    icon: Bot,
    href: '/chatbot',
    glowColor: 'from-blue-500/50',
  },
  {
    title: 'Voice Assistant',
    description: 'Use your voice to ask questions and get spoken answers.',
    icon: Mic,
    href: '/voice-assistant',
    glowColor: 'from-purple-500/50',
  },
  {
    title: 'Plant Doctor',
    description: 'Get a comprehensive health check-up for your plant.',
    icon: ScanSearch,
    href: '/disease-detector', // Re-uses detector for this
    glowColor: 'from-yellow-500/50',
  },
  {
    title: 'Ask Anything Tool',
    description: 'Your general purpose AI assistant for all queries.',
    icon: BrainCircuit,
    href: '/chatbot', // Re-uses chatbot for this
    glowColor: 'from-red-500/50',
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
            <div
              className={`relative bg-primary/10 backdrop-blur-lg border border-primary/20 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg transition-all duration-300 hover:scale-103 hover:shadow-2xl hover:bg-primary/20 h-full`}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br ${tool.glowColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10"></div>
              <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                <tool.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-headline text-gray-800">
                {tool.title}
              </h3>
              <p className="mt-2 text-muted-foreground flex-grow">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
