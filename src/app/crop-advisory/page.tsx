'use client';

import { PageHeader } from '@/components/page-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const stages = [
    {
        name: 'Sowing',
        illustration: PlaceHolderImages.find(p => p.id === 'sowing_illustration'),
        advice: 'Ensure proper seed treatment and maintain optimal soil moisture for best results.',
    },
    {
        name: 'Germination',
        illustration: PlaceHolderImages.find(p => p.id === 'germination_illustration'),
        advice: 'Monitor for uniform sprouting and protect young seedlings from pests.',
    },
    {
        name: 'Vegetative',
        illustration: PlaceHolderImages.find(p => p.id === 'vegetative_illustration'),
        advice: 'Apply first dose of nitrogen fertilizer and ensure adequate irrigation.',
    },
    {
        name: 'Flowering',
        illustration: PlaceHolderImages.find(p => p.id === 'flowering_illustration'),
        advice: 'Avoid water stress during this critical phase to maximize pollination.',
    },
    {
        name: 'Harvest',
        illustration: PlaceHolderImages.find(p => p.id === 'harvest_illustration'),
        advice: 'Harvest at the right maturity stage to ensure good quality and yield.',
    },
];

export default function CropAdvisoryPage() {
  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
       initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader
        title="Crop Advisory"
        subtitle="Stage-wise guidance for your crops"
      />

      <Card className="mb-8 glass-card">
        <CardHeader>
          <CardTitle>Select Your Crop</CardTitle>
          <CardDescription>
            Choose a crop to get personalized advisory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select>
            <SelectTrigger className="w-full md:w-1/3">
              <SelectValue placeholder="Select a crop" />
            </SelectTrigger>
            <SelectContent className="glass-card">
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="soybean">Soybean</SelectItem>
              <SelectItem value="cotton">Cotton</SelectItem>
              <SelectItem value="paddy">Paddy</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-headline mb-4 text-foreground text-center">Advisory Timeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {stages.map((stage, index) => (
                <motion.div
                  key={stage.name}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card h-full flex flex-col group hover:border-primary/60">
                      <CardHeader className="items-center">
                          {stage.illustration && (
                          <div className="w-full h-32 relative rounded-lg overflow-hidden">
                            <Image
                                src={stage.illustration.imageUrl}
                                alt={stage.name}
                                layout="fill"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                data-ai-hint={stage.illustration.imageHint}
                            />
                          </div>
                          )}
                          <CardTitle className="pt-4 font-headline">{stage.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center flex-grow">
                          <p className="text-sm text-muted-foreground">{stage.advice}</p>
                      </CardContent>
                      <div className="p-4 pt-0">
                          <Button variant="link" className="w-full">More Details</Button>
                      </div>
                  </Card>
                </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
