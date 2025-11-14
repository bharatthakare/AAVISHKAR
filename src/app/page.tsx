import {
  Bot,
  FlaskConical,
  HeartPulse,
  Landmark,
  LayoutGrid,
  Leaf,
  LineChart,
  Mic,
  Newspaper,
  Satellite,
  ShieldAlert,
  Sun,
  Tractor,
  Users,
  Sprout,
  Calculator,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCard } from '@/components/dashboard-card';
import { WeatherCard } from '@/components/weather-card';
import { PageHeader } from '@/components/page-header';

const features = [
  {
    title: 'Crop Advisory',
    icon: Leaf,
    href: '/crop-advisory',
    description: 'Get stage-wise advice for your crops.',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: 'Farm Planner',
    icon: Tractor,
    href: '/farm-planner',
    description: 'Plan your sowing, irrigation, and more.',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    title: 'Soil Health',
    icon: HeartPulse,
    href: '/soil-health',
    description: 'Analyze soil health and get recommendations.',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    title: 'Satellite View',
    icon: Satellite,
    href: '/satellite-view',
    description: 'Monitor your farm with NDVI imagery.',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    title: 'Market Prices',
    icon: LineChart,
    href: '/market-prices',
    description: 'Track real-time mandi prices.',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Pests & Diseases',
    icon: ShieldAlert,
    href: '/pests-diseases',
    description: 'Identify and manage crop threats.',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    title: 'AI Tools',
    icon: Bot,
    href: '/ai-tools',
    description: 'Access powerful AI assistants.',
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    title: 'Community',
    icon: Users,
    href: '/community',
    description: 'Connect with fellow farmers.',
    bgColor: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
  {
    title: 'Yield Calculator',
    icon: Sprout,
    href: '/yield-calculator',
    description: 'Estimate your expected crop yield.',
    bgColor: 'bg-lime-100',
    iconColor: 'text-lime-600',
  },
  {
    title: 'Profit Calculator',
    icon: Calculator,
    href: '/profit-calculator',
    description: 'Estimate your net profit from harvest.',
    bgColor: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
  },
];

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Welcome, Farmer!"
        subtitle="Your smart farming assistant is ready to help."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-8">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <LayoutGrid className="text-primary" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {features.map((feature) => (
                  <DashboardCard key={feature.title} {...feature} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <WeatherCard />

          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Newspaper className="text-primary" />
                Crop Tips & News
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Tip of the Day
                </h3>
                <p className="text-sm text-gray-600">
                  Consider using drip irrigation to save water and reduce weed
                  growth. It delivers water directly to the plant roots.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Market News
                </h3>
                <p className="text-sm text-gray-600">
                  Soybean prices are expected to rise in the coming weeks due to
                  increased international demand.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
