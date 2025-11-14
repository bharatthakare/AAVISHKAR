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
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Crop Advisory"
        subtitle="Stage-wise guidance for your crops"
      />

      <Card className="mb-8 rounded-2xl shadow-md">
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
            <SelectContent>
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="soybean">Soybean</SelectItem>
              <SelectItem value="cotton">Cotton</SelectItem>
              <SelectItem value="paddy">Paddy</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-headline mb-4">Advisory Timeline</h2>
        <div className="relative">
             <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-primary/20 -translate-x-1/2 hidden md:block"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {stages.map((stage, index) => (
                    <Card key={stage.name} className="rounded-2xl shadow-lg transition-transform duration-300 hover:scale-103 hover:shadow-xl">
                        <CardHeader className="items-center">
                            {stage.illustration && (
                            <Image
                                src={stage.illustration.imageUrl}
                                alt={stage.name}
                                width={300}
                                height={200}
                                className="rounded-lg w-full h-32 object-cover"
                                data-ai-hint={stage.illustration.imageHint}
                            />
                            )}
                            <CardTitle className="pt-4 font-headline">{stage.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-sm text-muted-foreground">{stage.advice}</p>
                            <Button variant="link" className="mt-2">More Details</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
