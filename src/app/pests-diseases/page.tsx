import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const diseases = [
  {
    name: 'Powdery Mildew',
    image: PlaceHolderImages.find(p => p.id === 'disease_3'),
    symptoms: 'White powdery spots on leaves and stems.',
    solution: 'Apply fungicides, improve air circulation.',
  },
  {
    name: 'Leaf Rust',
    image: PlaceHolderImages.find(p => p.id === 'disease_4'),
    symptoms: 'Orange to reddish-brown pustules on leaves.',
    solution: 'Use resistant varieties, apply foliar fungicides.',
  },
  {
    name: 'Brown Spot',
    image: PlaceHolderImages.find(p => p.id === 'disease_1'),
    symptoms: 'Small, circular, brown lesions on leaves.',
    solution: 'Seed treatment, proper water management.',
  },
  {
    name: 'Mosaic Virus',
    image: PlaceHolderImages.find(p => p.id === 'disease_2'),
    symptoms: 'Mottled yellow and green patterns on leaves.',
    solution: 'Control insect vectors, remove infected plants.',
  },
];

export default function PestsAndDiseasesPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Pests & Diseases"
        subtitle="Identify and learn how to manage common crop threats"
      />
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for a disease..." className="pl-10" />
        </div>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/disease-detector">
                Use AI Detector
            </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {diseases.map((disease) => (
          <Card key={disease.name} className="rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-103 hover:shadow-xl">
            {disease.image && (
                <div className="aspect-video overflow-hidden">
                    <Image
                        src={disease.image.imageUrl}
                        alt={disease.name}
                        width={600}
                        height={400}
                        className="object-cover w-full h-full"
                        data-ai-hint={disease.image.imageHint}
                    />
                </div>
            )}
            <CardHeader>
              <CardTitle className="font-headline">{disease.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div>
                    <h4 className="font-semibold text-sm">Symptoms</h4>
                    <p className="text-sm text-muted-foreground">{disease.symptoms}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-sm">Solution</h4>
                    <p className="text-sm text-muted-foreground">{disease.solution}</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="link" className="p-0">Learn More</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
