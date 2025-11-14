import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CalendarIcon, Map } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';

export default function SatelliteViewPage() {
  const mapImage = PlaceHolderImages.find(p => p.id === 'ndvi_map');
  const today = new Date();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Satellite View"
        subtitle="Monitor your farm's health using NDVI imagery"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-video w-full bg-gray-200 flex items-center justify-center">
              {mapImage ? (
                <Image
                  src={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI/default/${format(today, 'yyyy-MM-dd')}/GoogleMapsCompatible_Level7/43/86/38.jpg`}
                  alt="NDVI Map"
                  width={1280}
                  height={720}
                  className="object-cover w-full h-full"
                  data-ai-hint={mapImage.imageHint}
                />
              ) : (
                <p>Map loading...</p>
              )}
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
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(today, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={today} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center justify-between">
                <Label>FIRMS False Color</Label>
                <Switch id="firms-toggle" />
              </div>
               <Button className="w-full">
                <Map className="mr-2 h-4 w-4" /> Overlay Farm Boundary
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>NDVI Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span>Stress (-1.0 to 0.2)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span>Moderate (0.2 to 0.5)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span>Healthy (0.5 to 1.0)</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
