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
      <Card className="glass-card h-full overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-primary/20">
        <CardHeader className="p-5">
          <div
            className={cn(
              'p-3 mb-4 rounded-full flex items-center justify-center bg-white shadow-md shadow-primary/20 w-min'
            )}
          >
            <Icon className={cn('h-6 w-6 text-primary')} />
          </div>
          <CardTitle className="pt-2 font-headline text-lg font-bold text-foreground">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
