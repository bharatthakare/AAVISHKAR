
'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Loader2, AlertTriangle } from 'lucide-react';
import { useProfile } from '@/hooks/use-profile';

type WeatherData = {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind: number;
  icon: string;
};

export function WeatherCard() {
  const { profile } = useProfile();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!profile.cityVillage) {
        setError('Please set a location in your profile.');
        setIsLoading(false);
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        setError('OpenWeather API key is not configured.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${profile.cityVillage}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch weather data.');
        }
        const data = await response.json();
        setWeatherData({
          city: data.name,
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          wind: Math.round(data.wind.speed * 3.6), // m/s to km/h
          icon: data.weather[0].icon,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [profile.cityVillage]);

  const WeatherIcon = () => {
    if (!weatherData) return <Sun className="h-8 w-8 text-yellow-400" />;
    
    const iconCode = weatherData.icon.slice(0, -1); // e.g., '01d' -> '01'
    switch (iconCode) {
        case '01': return <Sun className="h-8 w-8 text-yellow-400" />;
        case '02':
        case '03':
        case '04': return <Cloud className="h-8 w-8 text-gray-400" />;
        case '09':
        case '10': return <CloudRain className="h-8 w-8 text-blue-400" />;
        case '13': return <CloudSnow className="h-8 w-8 text-gray-300" />;
        case '50': return <Wind className="h-8 w-8 text-gray-500" />; // Mist
        default: return <Sun className="h-8 w-8 text-yellow-400" />;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading weather...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center p-8 text-destructive">
          <AlertTriangle className="h-6 w-6" />
          <p className="ml-2">{error}</p>
        </div>
      );
    }
    if (weatherData) {
      return (
        <>
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
                  <p className="text-muted-foreground capitalize">{weatherData.condition}</p>
                </div>
              </div>
              <div className="text-right space-y-1 text-sm">
                <p>Humidity: {weatherData.humidity}%</p>
                <p>Wind: {weatherData.wind} km/h</p>
              </div>
            </div>
          </CardContent>
        </>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card">
      {renderContent()}
    </Card>
  );
}
