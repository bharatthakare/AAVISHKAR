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
  bgColor: string;
  iconColor: string;
}

export function DashboardCard({
  icon: Icon,
  title,
  description,
  href,
  bgColor,
  iconColor,
}: DashboardCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="rounded-2xl h-full shadow-lg transition-all duration-300 ease-in-out hover:scale-103 hover:shadow-xl hover:border-primary/50 overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div
              className={cn(
                'p-3 rounded-lg flex items-center justify-center',
                bgColor
              )}
            >
              <Icon className={cn('h-6 w-6', iconColor)} />
            </div>
          </div>
          <CardTitle className="pt-2 font-headline">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
