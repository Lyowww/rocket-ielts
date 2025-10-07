"use client";
import { PointerMap } from "@/assets/images";
import { useEffect, useState } from "react";

interface ScoreMapProps {
  currentScore: number;
  maxScore: number;
}

export const ScoreMap = ({ currentScore, maxScore }: ScoreMapProps) => {
  const progressPercentage = (currentScore / maxScore) * 100;
  const [mapTileUrl, setMapTileUrl] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [routeData, setRouteData] = useState<string>("");

  const startPoint = { x: 100, y: 150 };
  const endPoint =  { x: 900, y: 50 };

  useEffect(() => {
    const generateRandomRoute = () => {
      const route = [];
      const numPoints = 10 + Math.floor(Math.random() * 8);
      
      const segments = Math.floor(numPoints / 3);
      let currentDirection = Math.random() * Math.PI * 2; 
      
      for (let i = 0; i < numPoints; i++) {
        const progress = i / (numPoints - 1);
        const baseX = startPoint.x + (endPoint.x - startPoint.x) * progress;
        const baseY = startPoint.y + (endPoint.y - startPoint.y) * progress;
        
        if (i > 0 && i % 3 === 0) {
          currentDirection += (Math.random() - 0.5) * Math.PI; 
        }
        const zigzagIntensity = 60 + Math.sin(progress * Math.PI * 4) * 30;
        const angleVariation = Math.sin(progress * Math.PI * 6) * 0.8;
        const offsetDistance = (Math.random() * 0.7 + 0.3) * zigzagIntensity;
        const finalDirection = currentDirection + angleVariation;
        const randomOffsetX = Math.cos(finalDirection) * offsetDistance;
        const randomOffsetY = Math.sin(finalDirection) * offsetDistance * 0.4;
        const perpDirection = finalDirection + Math.PI / 2;
        const perpOffset = (Math.random() - 0.5) * 20;
        const perpX = Math.cos(perpDirection) * perpOffset;
        const perpY = Math.sin(perpDirection) * perpOffset * 0.5;
        
        route.push({
          x: Math.max(50, Math.min(950, baseX + randomOffsetX + perpX)),
          y: Math.max(30, Math.min(200, baseY + randomOffsetY + perpY))
        });
      }
      
      route[0] = startPoint;
      route[route.length - 1] = endPoint;
      
      const enhancedRoute = [route[0]];
      for (let i = 1; i < route.length - 1; i++) {
        const current = route[i];
        const prev = route[i - 1];
        const next = route[i + 1];
        
        if (Math.random() > 0.4) {
          const midX = (prev.x + current.x) / 2 + (Math.random() - 0.5) * 25;
          const midY = (prev.y + current.y) / 2 + (Math.random() - 0.5) * 15;
          enhancedRoute.push({
            x: Math.max(50, Math.min(950, midX)),
            y: Math.max(30, Math.min(200, midY))
          });
        }
        
        enhancedRoute.push(current);
      }
      enhancedRoute.push(route[route.length - 1]);
      
      return enhancedRoute;
    };

    const mapUrls = [
      'https://tile.openstreetmap.org/10/511/375.png',
    ];

    const mapConfigs = mapUrls.map(url => ({
      url,
      route: generateRandomRoute()
    }));

    const selectedConfig = mapConfigs[Math.floor(Math.random() * mapConfigs.length)];

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setMapTileUrl(selectedConfig.url);
      setMapLoaded(true);

      let pathData = `M ${selectedConfig.route[0].x} ${selectedConfig.route[0].y}`;
      for (let i = 1; i < selectedConfig.route.length; i++) {
        const current = selectedConfig.route[i];
        const prev = selectedConfig.route[i - 1];

        if (i === 1) {
          const cp1x = prev.x + (current.x - prev.x) * 0.4;
          const cp1y = prev.y + (current.y - prev.y) * 0.2;
          const cp2x = current.x - (current.x - prev.x) * 0.4;
          const cp2y = current.y - (current.y - prev.y) * 0.3;
          pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${current.x} ${current.y}`;
        } else {
          const next = selectedConfig.route[Math.min(i + 1, selectedConfig.route.length - 1)];
          const cp2x = current.x - (next.x - current.x) * 0.3;
          const cp2y = current.y - (next.y - current.y) * 0.3;
          pathData += ` S ${cp2x} ${cp2y}, ${current.x} ${current.y}`;
        }
      }
      setRouteData(pathData);
    };
    img.onerror = () => {
      const fallbackConfig = mapConfigs[(Math.floor(Math.random() * mapConfigs.length))];
      const fallbackImg = new Image();
      fallbackImg.crossOrigin = "anonymous";
      fallbackImg.onload = () => {
        setMapTileUrl(fallbackConfig.url);
        setMapLoaded(true);

        const route = generateRandomRoute();
        let pathData = `M ${route[0].x} ${route[0].y}`;
        for (let i = 1; i < route.length; i++) {
          const current = route[i];
          const prev = route[i - 1];
          
          if (i === 1) {
            const cp1x = prev.x + (current.x - prev.x) * 0.4;
            const cp1y = prev.y + (current.y - prev.y) * 0.2;
            const cp2x = current.x - (current.x - prev.x) * 0.4;
            const cp2y = current.y - (current.y - prev.y) * 0.3;
            pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${current.x} ${current.y}`;
          } else {
            const next = route[Math.min(i + 1, route.length - 1)];
            const cp2x = current.x - (next.x - current.x) * 0.3;
            const cp2y = current.y - (next.y - current.y) * 0.3;
            pathData += ` S ${cp2x} ${cp2y}, ${current.x} ${current.y}`;
          }
        }
        setRouteData(pathData);
      };
      fallbackImg.onerror = () => {
        setMapLoaded(false);
      };
      fallbackImg.src = fallbackConfig.url;
    };
    img.src = selectedConfig.url;
  }, []);

  const pathLength = 650;

  return (
    <div className="w-full h-[230px] rounded-[12px] p-6 relative overflow-hidden">
      {mapLoaded && mapTileUrl ? (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${mapTileUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(1.5px) brightness(0.85) contrast(1.3) saturate(0)',
            transform: 'scale(1.05)'
          }}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-200 to-slate-400" />
      )}

      <div className="absolute inset-0 w-full h-full bg-black/15" />

      <svg className="w-full h-full relative z-10">
        {routeData && (
          <>
            <path
              d={routeData}
              stroke="#651FFF"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              className="animate-pulse"
              opacity="0.8"
            />

            <path
              d={routeData}
              stroke="#23085A"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${pathLength * 100}, ${pathLength}`}
              strokeLinecap="round"
            />
          </>
        )}

        <g transform={`translate(${endPoint.x}, ${endPoint.y})`}>
          <image
            href={PointerMap.src}
            x="-24"
            y="-48"
            width="48"
            height="48"
          />
          <text
            x="0"
            y="-32"
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[10px] font-semibold fill-black"
          >
            {maxScore.toFixed(1)}
          </text>
        </g>

        <g transform={`translate(${startPoint.x}, ${startPoint.y})`}>
          <circle
            cx="0"
            cy="0"
            r="22"
            fill="lightblue"
            className="animate-pulse"
          />
          <circle
            cx="0"
            cy="0"
            r="14"
            fill="white"
          />
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="central"
            className="text-sm font-semibold fill-black"
          >
            {currentScore.toFixed(1)}
          </text>
        </g>
      </svg>

      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg">
        <div className="text-center">
          <p className="text-sm text-[#575353]">You are {progressPercentage.toFixed(1)}% away from your target</p>
          <div className="w-20 h-2 bg-gray-200 rounded-full mt-2">
            <div
              className="h-full bg-gradient-to-r from-[#651FFF] to-[#23085A] rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
