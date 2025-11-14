'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { marketPrices, priceTrends, type MarketPrice } from '@/lib/market-data';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

export default function MarketPricesPage() {
  const chartConfig = {
    price: {
      label: "Price (INR)",
      color: "hsl(var(--primary))",
    },
  };
    
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Market Prices"
        subtitle="Track real-time mandi prices for your commodities"
      />

      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle>Filter Prices</CardTitle>
          <CardDescription>Select filters to narrow down the results.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select>
              <SelectTrigger><SelectValue placeholder="Select Commodity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="soybean">Soybean</SelectItem>
                <SelectItem value="cotton">Cotton</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="punjab">Punjab</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="gujarat">Gujarat</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="amritsar">Amritsar</SelectItem>
                <SelectItem value="latur">Latur</SelectItem>
                <SelectItem value="rajkot">Rajkot</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Live Mandi Prices</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Commodity</TableHead>
                            <TableHead>Market</TableHead>
                            <TableHead className="text-right">Modal Price (₹/Quintal)</TableHead>
                            <TableHead className="text-right">Change</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {marketPrices.map((price) => (
                            <TableRow key={price.market}>
                                <TableCell className="font-medium">{price.commodity}</TableCell>
                                <TableCell>{price.market}, {price.state}</TableCell>
                                <TableCell className="text-right font-semibold">₹{price.modalPrice.toFixed(2)}</TableCell>
                                <TableCell className={`text-right flex justify-end items-center gap-1 ${price.priceChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {price.priceChange > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                    {Math.abs(price.priceChange)}%
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Wheat Price Trend</CardTitle>
              <CardDescription>Last 5 days in Amritsar</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <LineChart data={priceTrends.wheat}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis domain={['dataMin - 50', 'dataMax + 50']} hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line dataKey="price" type="monotone" stroke="var(--color-price)" strokeWidth={2} dot={true} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
