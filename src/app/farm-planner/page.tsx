'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Droplets, Sprout, Syringe, Wheat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

type PlanItem = {
  date: string;
  activity: string;
  details: string;
  icon: React.ElementType;
};

export default function FarmPlannerPage() {
  const [sowingDate, setSowingDate] = useState<Date | undefined>(new Date());
  const [plan, setPlan] = useState<PlanItem[] | null>(null);

  const generatePlan = () => {
    if (!sowingDate) return;
    const baseDate = new Date(sowingDate);
    const newPlan: PlanItem[] = [
      {
        date: format(baseDate, 'PPP'),
        activity: 'Sowing',
        details: 'Prepare land and sow treated seeds at recommended depth.',
        icon: Sprout,
      },
      {
        date: format(new Date(baseDate.setDate(baseDate.getDate() + 20)), 'PPP'),
        activity: 'First Irrigation',
        details: 'Apply light irrigation to support germination and root development.',
        icon: Droplets,
      },
      {
        date: format(new Date(baseDate.setDate(baseDate.getDate() + 15)), 'PPP'),
        activity: 'Fertilizer Application',
        details: 'Apply first dose of Nitrogen and Phosphorus as per soil test.',
        icon: Wheat,
      },
      {
        date: format(new Date(baseDate.setDate(baseDate.getDate() + 20)), 'PPP'),
        activity: 'Pest Scouting',
        details: 'Begin regular scouting for common pests like aphids and borers.',
        icon: Syringe,
      },
      {
        date: format(new Date(baseDate.setDate(baseDate.getDate() + 35)), 'PPP'),
        activity: 'Harvest Date',
        details: 'Expected harvest window begins. Monitor crop maturity.',
        icon: Wheat,
      },
    ];
    setPlan(newPlan);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader
        title="Farm Planner"
        subtitle="Generate a customized plan for your crop cycle"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="glass-card sticky top-24">
            <CardHeader>
              <CardTitle>Plan Your Farm</CardTitle>
              <CardDescription>Enter details to create a schedule.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="land-size">Land Size (in acres)</Label>
                <Input id="land-size" type="number" placeholder="e.g., 5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crop-name">Crop Name</Label>
                <Input id="crop-name" placeholder="e.g., Wheat" />
              </div>
              <div className="space-y-2">
                <Label>Sowing Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !sowingDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {sowingDate ? format(sowingDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass-card">
                    <Calendar
                      mode="single"
                      selected={sowingDate}
                      onSelect={setSowingDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button className="w-full" onClick={generatePlan}>Generate Plan</Button>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          {plan ? (
            <div className="space-y-8">
                <div className="relative pl-8">
                    
                    {plan.map((item, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            className="mb-8 relative"
                        >
                            <div className="w-full">
                                <Card className="glass-card">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2 font-headline">
                                                <item.icon className="h-5 w-5 text-primary" />
                                                {item.activity}
                                            </CardTitle>
                                            <p className="text-sm font-medium text-muted-foreground">{item.date}</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{item.details}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
          ) : (
            <Card className="glass-card flex items-center justify-center h-96">
                <div className="text-center text-muted-foreground">
                    <p>Your generated plan will appear here.</p>
                </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
