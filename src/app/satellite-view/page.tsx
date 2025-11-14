'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Leaf, Droplets,AreaChart, Layers } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';


const indices = {
    ndvi: {
        name: 'NDVI',
        fullName: 'Normalized Difference Vegetation Index',
        description: 'Indicates plant health and vigor.',
        color: 'text-green-600',
        borderColor: 'border-green-600',
        chartColor: "hsl(var(--chart-1))",
        data: [
            { date: 'May 1', value: 0.65 },
            { date: 'May 8', value: 0.70 },
            { date: 'May 15', value: 0.72 },
            { date: 'May 22', value: 0.78 },
            { date: 'Today', value: 0.82 },
        ],
        legend: [
            { color: 'bg-red-500', range: 'Stress (-1.0 to 0.2)' },
            { color: 'bg-yellow-500', range: 'Moderate (0.2 to 0.5)' },
            { color: 'bg-green-500', range: 'Healthy (0.5 to 1.0)' },
        ]
    },
    ndmi: {
        name: 'NDMI',
        fullName: 'Normalized Difference Moisture Index',
        description: 'Measures water content in vegetation.',
        color: 'text-blue-600',
        borderColor: 'border-blue-600',
        chartColor: "hsl(var(--chart-2))",
        data: [
            { date: 'May 1', value: 0.40 },
            { date: 'May 8', value: 0.45 },
            { date: 'May 15', value: 0.42 },
            { date: 'May 22', value: 0.50 },
            { date: 'Today', value: 0.55 },
        ],
        legend: [
            { color: 'bg-orange-500', range: 'Dry (-1.0 to 0.0)' },
            { color: 'bg-cyan-300', range: 'Moderate (0.0 to 0.4)' },
            { color: 'bg-blue-600', range: 'High Water (0.4 to 1.0)' },
        ]
    },
    lai: {
        name: 'LAI',
        fullName: 'Leaf Area Index',
        description: 'Represents the amount of leaf material.',
        color: 'text-yellow-700',
        borderColor: 'border-yellow-700',
        chartColor: "hsl(var(--chart-3))",
        data: [
            { date: 'May 1', value: 2.5 },
            { date: 'May 8', value: 2.8 },
            { date: 'May 15', value: 3.1 },
            { date: 'May 22', value: 3.5 },
            { date: 'Today', value: 4.0 },
        ],
        legend: [
            { color: 'bg-yellow-200', range: 'Low (0-2)' },
            { color: 'bg-yellow-400', range: 'Moderate (2-4)' },
            { color: 'bg-yellow-600', range: 'High (>4)' },
        ]
    }
}

type IndexType = keyof typeof indices;

export default function SatelliteViewPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedIndex, setSelectedIndex] = useState<IndexType>('ndvi');

  const activeIndex = indices[selectedIndex];
  
  const chartConfig = {
    value: {
      label: activeIndex.name,
      color: activeIndex.chartColor,
    },
  };

  const mapUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI/default/${format(selectedDate, 'yyyy-MM-dd')}/GoogleMapsCompatible_Level7/43/86/38.jpg`;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Satellite View"
        subtitle="Monitor your farm's health using advanced satellite imagery"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-video w-full bg-gray-200 flex items-center justify-center relative">
                <Image
                  key={mapUrl}
                  src={mapUrl}
                  alt={`${activeIndex.name} Map for ${format(selectedDate, 'PPP')}`}
                  width={1280}
                  height={720}
                  className="object-cover w-full h-full"
                  unoptimized // Since URL is from external service
                />
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg">
                    <h3 className="font-bold text-lg">{activeIndex.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{format(selectedDate, 'PPP')}</p>
                </div>
            </div>
             <CardFooter className="p-2 border-t text-xs text-muted-foreground bg-background">
                <p>Image attribution: NASA GIBS / MODIS Terra NDVI</p>
             </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>Map Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Index</Label>
                <Select value={selectedIndex} onValueChange={(value) => setSelectedIndex(value as IndexType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an index" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ndvi">NDVI</SelectItem>
                    <SelectItem value="ndmi">NDMI</SelectItem>
                    <SelectItem value="lai">LAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} disabled={(date) => date > new Date() || date < new Date("2000-01-01")}/>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <Card className={cn("rounded-2xl shadow-md border-2", activeIndex.borderColor)}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Current {activeIndex.name}</span>
                        <span className={activeIndex.color}>{activeIndex.data[activeIndex.data.length - 1].value}</span>
                    </CardTitle>
                    <CardDescription>{activeIndex.fullName}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{activeIndex.description}</p>
                </CardContent>
            </Card>
            <Card className="md:col-span-2 rounded-2xl shadow-md">
                <CardHeader>
                    <CardTitle>{activeIndex.name} Trend</CardTitle>
                    <CardDescription>Last 5 data points</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-48 w-full">
                        <LineChart data={activeIndex.data}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis domain={['auto', 'auto']} hide />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line dataKey="value" type="monotone" stroke={activeIndex.chartColor} strokeWidth={3} dot={{ r: 5, fill: activeIndex.chartColor }} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
       </div>
    </div>
  );
}
