import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function YieldCalculatorPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Yield Calculator"
        subtitle="Estimate your expected crop yield based on inputs"
      />
      <div className="max-w-2xl mx-auto">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Enter Crop Details</CardTitle>
            <CardDescription>
              Provide the following details to get a yield projection.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="crop">Crop</Label>
                <Select>
                    <SelectTrigger id="crop">
                        <SelectValue placeholder="Select a crop" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="soybean">Soybean</SelectItem>
                        <SelectItem value="maize">Maize</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Area (acres)</Label>
                <Input id="area" type="number" placeholder="e.g., 10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seeds">Seed Amount (kg)</Label>
                <Input id="seeds" type="number" placeholder="e.g., 400" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="irrigation">Irrigation Type</Label>
                    <Select>
                        <SelectTrigger id="irrigation">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="drip">Drip Irrigation</SelectItem>
                            <SelectItem value="flood">Flood Irrigation</SelectItem>
                            <SelectItem value="rainfed">Rain-fed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fertilizer">Fertilizer (kg)</Label>
                    <Input id="fertilizer" type="number" placeholder="e.g., 500" />
                </div>
            </div>
            <Button className="w-full">Calculate Yield</Button>
          </CardContent>
        </Card>

        <Card className="mt-8 rounded-2xl shadow-lg border-primary border-2">
            <CardHeader>
                <CardTitle>Yield Projection</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">Expected Yield</p>
                <p className="text-4xl font-bold text-primary">200 Quintals</p>
                <p className="text-muted-foreground mt-2">(approx. 20 quintals per acre)</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
