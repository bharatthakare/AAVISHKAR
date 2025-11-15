
import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export function DashboardCard({
  icon: Icon,
  title,
  description,
  href,
}: DashboardCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="glass-card h-full overflow-hidden hover:border-hover-green hover:bg-hover-green hover:scale-105 transition-all duration-300 ease-in-out">
        <CardHeader>
          <div
            className={cn(
              'p-3 rounded-lg flex items-center justify-center bg-primary/10 text-primary w-min group-hover:bg-white/20 group-hover:text-white'
            )}
          >
            <Icon className={cn('h-6 w-6')} />
          </div>
          <CardTitle className="pt-2 font-headline group-hover:text-white">{title}</CardTitle>
          <CardDescription className="group-hover:text-white/90">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
