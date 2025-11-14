'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sun, Cloud, CloudRain, CloudSnow, Wind } from 'lucide-react';

export function WeatherCard() {
  const weatherData = {
    city: 'Bhopal',
    temperature: 32,
    condition: 'Sunny',
    humidity: 45,
    wind: 12,
  };

  const WeatherIcon = () => {
    switch (weatherData.condition) {
      case 'Sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'Cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'Rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="font-headline">Weather Today</CardTitle>
        <CardDescription>{weatherData.city}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <WeatherIcon />
            <div>
              <p className="text-4xl font-bold">{weatherData.temperature}°C</p>
              <p className="text-muted-foreground">{weatherData.condition}</p>
            </div>
          </div>
          <div className="text-right space-y-1 text-sm">
            <p>Humidity: {weatherData.humidity}%</p>
            <p>Wind: {weatherData.wind} km/h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
