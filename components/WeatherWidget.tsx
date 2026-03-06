import React from 'react';
import { Cloud, Sun, CloudRain, Wind, MapPin, CloudSnow, CloudLightning, CloudFog, SunMedium } from 'lucide-react';

interface WeatherWidgetProps {
  data: {
    temp: number;
    conditionCode: number;
    city: string;
    windSpeed: number;
  } | null;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data }) => {
  const getWeatherIcon = (code: number) => {
    if (code === 0) return Sun;
    if (code <= 3) return SunMedium;
    if (code === 45 || code === 48) return CloudFog;
    if (code >= 51 && code <= 67) return CloudRain;
    if (code >= 71 && code <= 77) return CloudSnow;
    if (code >= 80 && code <= 82) return CloudRain;
    if (code >= 95) return CloudLightning;
    return Cloud;
  };

  const getConditionText = (code: number) => {
    if (code === 0) return 'Clear Skies';
    if (code <= 3) return 'Partly Cloudy';
    if (code === 45 || code === 48) return 'Foggy';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 65) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowing';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 95) return 'Stormy';
    return 'Overcast';
  };

  if (!data) return null;

  const WeatherIcon = getWeatherIcon(data.conditionCode);
  const conditionText = getConditionText(data.conditionCode);

  return (
    <div className="px-6 py-4 bg-white/40 border border-[#E2DDD3] rounded-3xl flex items-center gap-6 group cursor-default shadow-sm">
      <div className="text-right">
        <div className="text-3xl font-thin tabular-nums text-[#2D2926]">
          {data.temp}°
        </div>
        <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
          {conditionText}
        </div>
      </div>
      <div className="w-12 h-12 bg-[#2D2926] rounded-2xl flex items-center justify-center text-[#F4F1EA] shadow-lg shrink-0">
        <WeatherIcon size={24} />
      </div>
    </div>
  );
};