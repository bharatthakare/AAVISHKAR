import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfitCalculatorPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Profit Calculator"
        subtitle="Estimate your net profit from your harvest"
      />
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Calculate Your Profit</CardTitle>
            <CardDescription>
              Enter the details below to project your earnings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="market-price">Market Price (₹ per quintal)</Label>
                <Input id="market-price" type="number" placeholder="e.g., 2100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yield">Total Yield (quintals)</Label>
                <Input id="yield" type="number" placeholder="e.g., 50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-costs">Total Input Costs (₹)</Label>
              <Input id="input-costs" type="number" placeholder="e.g., 45000" />
            </div>
            <Button className="w-full">Calculate Profit</Button>
          </CardContent>
        </Card>

        <Card className="mt-8 glass-card border-primary">
            <CardHeader>
                <CardTitle>Profit Projection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">₹1,05,000</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Net Profit</p>
                    <p className="text-4xl font-bold text-primary">₹60,000</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
