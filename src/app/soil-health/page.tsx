import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FileUp, Beaker, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import Image from 'next/image';

const soilParameters = [
  { name: 'Nitrogen (N)', value: 280, unit: 'kg/ha', status: 'good' },
  { name: 'Phosphorus (P)', value: 15, unit: 'kg/ha', status: 'moderate' },
  { name: 'Potassium (K)', value: 150, unit: 'kg/ha', status: 'good' },
  { name: 'pH', value: 6.8, unit: '', status: 'good' },
  { name: 'EC', value: 0.4, unit: 'dS/m', status: 'good' },
  { name: 'Organic Carbon', value: 0.45, unit: '%', status: 'low' },
];

const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'good': return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'moderate': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        case 'low': return <XCircle className="h-5 w-5 text-red-500" />;
        default: return null;
    }
};

export default function SoilHealthPage() {
  const soilTestImage = PlaceHolderImages.find(p => p.id === 'soil_test_image');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Soil Health Analyzer"
        subtitle="Upload a report or enter values to check your soil's health"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="upload">Upload Report</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Enter Soil Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>N (kg/ha)</Label><Input type="number" placeholder="e.g. 280"/></div>
                        <div className="space-y-2"><Label>P (kg/ha)</Label><Input type="number" placeholder="e.g. 15"/></div>
                        <div className="space-y-2"><Label>K (kg/ha)</Label><Input type="number" placeholder="e.g. 150"/></div>
                        <div className="space-y-2"><Label>pH</Label><Input type="number" placeholder="e.g. 6.8"/></div>
                        <div className="space-y-2"><Label>EC (dS/m)</Label><Input type="number" placeholder="e.g. 0.4"/></div>
                        <div className="space-y-2"><Label>Organic Carbon (%)</Label><Input type="number" placeholder="e.g. 0.45"/></div>
                    </div>
                  <Button className="w-full">Analyze Soil</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="upload">
              <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Upload Soil Test Report</CardTitle>
                </CardHeader>
                <CardContent className="text-center p-8 space-y-4 border-2 border-dashed rounded-lg">
                    <FileUp className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p>Click to upload an image of your report</p>
                    <Button variant="outline">Select File</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Beaker className="text-primary"/> Soil Health Scorecard</CardTitle>
                    <CardDescription>Overall Score: <span className="font-bold text-green-500">Good</span></CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {soilParameters.map(param => (
                            <li key={param.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div>
                                    <p className="font-semibold">{param.name}</p>
                                    <p className="text-sm text-muted-foreground">{param.value} {param.unit}</p>
                                </div>
                                <StatusIcon status={param.status} />
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card className="glass-card mt-8">
                <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Your soil shows low Organic Carbon. Consider applying 5-10 tons/ha of farmyard manure. Phosphorus is moderate; a starter dose of DAP is recommended.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
