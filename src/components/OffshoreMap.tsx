import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fieldCoordinates } from '../data/initialData';
import { Vessel, WeatherData } from '../types';
import {
  Navigation,
  Maximize2,
  Minimize2,
  RefreshCw,
  Layers,
  Compass,
  Anchor,
  Wind,
  Waves,
  Eye,
  Shield,
  Radio
} from 'lucide-react';

interface OffshoreMapProps {
  vessel: Vessel;
  weather?: WeatherData;
  mapboxToken?: string;
  onSelectPlatform?: (name: string) => void;
  showPipelines?: boolean;
  className?: string;
}

export const OffshoreMap: React.FC<OffshoreMapProps> = ({
  vessel,
  weather,
  onSelectPlatform,
  showPipelines = true,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vesselMarkerRef = useRef<L.Marker | null>(null);
  const wakePolylineRef = useRef<L.Polyline | null>(null);

  // Default to photorealistic satellite imagery as requested
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'ocean' | 'dark'>('satellite');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHud, setShowHud] = useState(true);
  const [showSafetyZone, setShowSafetyZone] = useState(true);

  // ResizeObserver to ensure Leaflet handles responsive container resizes seamlessly
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(mapContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Initialize and update Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [4.4550, 113.8850],
        zoom: 11,
        zoomControl: false,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;

      // Ensure proper layout invalidation
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }

    const map = mapInstanceRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add selected high-grade realistic tile layer
    if (activeLayer === 'satellite') {
      // Esri World Imagery (High-Resolution Satellite)
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, attribution: 'Esri Satellite' }
      ).addTo(map);
    } else if (activeLayer === 'ocean') {
      // Esri World Ocean Basemap (Hydrographic Nautical Shading with Bathymetry)
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 16, attribution: 'Esri Ocean Basemap' }
      ).addTo(map);
    } else {
      // CartoDB Dark Matter (Tactical Night GIS)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { maxZoom: 18, attribution: 'CartoDB Dark' }
      ).addTo(map);
    }

    // Clear feature markers & vectors before re-drawing
    map.eachLayer((layer) => {
      if (
        layer instanceof L.Marker ||
        layer instanceof L.Polyline ||
        layer instanceof L.Circle
      ) {
        map.removeLayer(layer);
      }
    });

    // --- 1. Realistic 500m Safety Exclusion Zone around SLDP-A ---
    if (showSafetyZone) {
      // 500m mandatory safety zone
      L.circle([fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng], {
        radius: 500,
        color: '#f43f5e',
        weight: 1.5,
        dashArray: '4, 4',
        fillColor: '#f43f5e',
        fillOpacity: 0.16
      }).addTo(map);

      // 1.5 NM outer tactical maritime caution ring
      L.circle([fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng], {
        radius: 2778, // 1.5 NM in meters
        color: '#fbbf24',
        weight: 1,
        dashArray: '6, 8',
        fillColor: '#fbbf24',
        fillOpacity: 0.04
      }).addTo(map);
    }

    // --- 2. Precision SVG Platform & Shore Icons ---
    const createApplePlatformIcon = (
      type: 'affected' | 'wellhead' | 'subsea' | 'shore',
      title: string,
      code: string
    ) => {
      const isAffected = type === 'affected';
      const isShore = type === 'shore';
      const isSubsea = type === 'subsea';

      const bgFill = isAffected
        ? 'bg-rose-600'
        : isShore
        ? 'bg-blue-600'
        : isSubsea
        ? 'bg-sky-500'
        : 'bg-amber-500';

      return L.divIcon({
        className: 'apple-offshore-marker',
        html: `
          <div class="relative flex flex-col items-center group cursor-pointer select-none">
            ${
              isAffected
                ? `<div class="absolute -top-1 -left-1 w-9 h-9 rounded-full bg-rose-500/30 animate-ping pointer-events-none"></div>`
                : ''
            }
            <div class="w-7 h-7 rounded-full ${bgFill} text-white shadow-lg flex items-center justify-center font-bold text-[10px] ring-2 ring-white/90 backdrop-blur-md">
              ${code}
            </div>
            <div class="mt-1 px-2 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[9px] font-semibold tracking-tight shadow-md border border-white/15 whitespace-nowrap">
              ${title}
            </div>
          </div>
        `,
        iconSize: [28, 44],
        iconAnchor: [14, 14]
      });
    };

    // SLDP-A Facility
    const sldpMarker = L.marker(
      [fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng],
      { icon: createApplePlatformIcon('affected', 'SLDP-A Facility', 'A') }
    ).addTo(map);

    sldpMarker.bindPopup(`
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 4px; min-width: 190px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
          <strong style="font-size: 13px; color: #0f172a;">SLDP-A Platform</strong>
          <span style="font-size: 9px; font-weight: 700; background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 9999px;">LEVEL 2 ALERT</span>
        </div>
        <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">Salbiah Field · Offshore Sarawak</p>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 6px; font-size: 10px; color: #334155; line-height: 1.5;">
          <div><b>POB:</b> 24/24 Accounted (100%)</div>
          <div><b>Containment:</b> Source Isolated (ESD-1)</div>
          <div><b>Safety Zone:</b> 500m Exclusion Enforced</div>
        </div>
      </div>
    `);

    if (onSelectPlatform) {
      sldpMarker.on('click', () => onSelectPlatform('SLDP-A Facility'));
    }

    // MOCC Shore Base
    L.marker([fieldCoordinates.moccShoreBase.lat, fieldCoordinates.moccShoreBase.lng], {
      icon: createApplePlatformIcon('shore', 'MOCC Shore Base (Miri)', 'MO')
    })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: -apple-system, sans-serif; padding: 4px;">
          <strong style="font-size: 12px; color: #0f172a;">MOCC Operational Base</strong>
          <p style="font-size: 10px; color: #64748b; margin: 2px 0 0 0;">Miri Shoreline Command · Distance to SLDP-A: 38 NM</p>
        </div>
      `);

    // S1, S2, S3 Platforms & Subsea
    L.marker([fieldCoordinates.s1.lat, fieldCoordinates.s1.lng], {
      icon: createApplePlatformIcon('wellhead', 'Platform S1', 'S1')
    })
      .addTo(map)
      .bindPopup('<b style="font-size: 11px;">Wellhead Platform S1</b><br/><span style="font-size: 10px; color:#64748b;">Distance: 6.5 km to SLDP-A · Normal</span>');

    L.marker([fieldCoordinates.s2.lat, fieldCoordinates.s2.lng], {
      icon: createApplePlatformIcon('wellhead', 'Platform S2', 'S2')
    })
      .addTo(map)
      .bindPopup('<b style="font-size: 11px;">Wellhead Platform S2</b><br/><span style="font-size: 10px; color:#64748b;">Distance: 8.0 km to SLDP-A · Normal</span>');

    L.marker([fieldCoordinates.s3.lat, fieldCoordinates.s3.lng], {
      icon: createApplePlatformIcon('wellhead', 'Platform S3', 'S3')
    })
      .addTo(map)
      .bindPopup('<b style="font-size: 11px;">Wellhead Platform S3</b><br/><span style="font-size: 10px; color:#64748b;">Distance: 11.5 km to SLDP-A · Normal</span>');

    L.marker([fieldCoordinates.subsea.lat, fieldCoordinates.subsea.lng], {
      icon: createApplePlatformIcon('subsea', 'Subsea Template', 'ST')
    })
      .addTo(map)
      .bindPopup('<b style="font-size: 11px;">Subsea Flowline Manifold</b><br/><span style="font-size: 10px; color:#64748b;">Water Depth: 45m · Flow Isolated</span>');

    // --- 3. Dynamic Realistic Vessel Icon (FCB-01) ---
    const createVesselIcon = () => {
      const heading = vessel.heading || 320;
      return L.divIcon({
        className: 'apple-vessel-marker',
        html: `
          <div class="relative flex flex-col items-center select-none" style="transform: translate(-50%, -50%);">
            <!-- Hydrodynamic Wake Effect -->
            <div class="absolute -bottom-2 w-8 h-8 rounded-full bg-emerald-400/25 blur-[3px] animate-pulse pointer-events-none"></div>
            <!-- Ship Hull Indicator with Heading Rotation -->
            <div class="w-8 h-8 rounded-full bg-emerald-600 text-white shadow-xl flex items-center justify-center ring-2 ring-white" style="transform: rotate(${heading}deg);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
              </svg>
            </div>
            <!-- Quiet Micro Label -->
            <div class="mt-1 px-1.5 py-0.5 rounded-full bg-slate-900/90 text-white text-[8.5px] font-bold tracking-tight shadow-md border border-emerald-400/30 whitespace-nowrap">
              ${vessel.id} · ${vessel.speedKnots}kt
            </div>
          </div>
        `,
        iconSize: [32, 48],
        iconAnchor: [16, 16]
      });
    };

    vesselMarkerRef.current = L.marker(vessel.coordinates, {
      icon: createVesselIcon()
    })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: -apple-system, sans-serif; padding: 4px;">
          <strong style="font-size: 12px; color: #0f172a;">${vessel.name} (${vessel.id})</strong>
          <p style="font-size: 10px; color: #059669; font-weight: 600; margin: 2px 0 4px 0;">Status: En Route · Medical & Containment</p>
          <div style="font-size: 10px; color: #475569; line-height: 1.4;">
            Speed: ${vessel.speedKnots} knots · ETA: ${vessel.eta}<br/>
            Heading: ${vessel.heading || 320}° NW
          </div>
        </div>
      `);

    // --- 4. Subsea Flowlines & Vessel Trajectory ---
    if (showPipelines) {
      // Subsea Pipelines (Coral dashed lines with low visual noise)
      const pipelineCoords = [
        [fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng],
        [fieldCoordinates.s1.lat, fieldCoordinates.s1.lng],
        [fieldCoordinates.subsea.lat, fieldCoordinates.subsea.lng],
        [fieldCoordinates.s3.lat, fieldCoordinates.s3.lng],
        [fieldCoordinates.s2.lat, fieldCoordinates.s2.lng],
        [fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng]
      ];

      L.polyline(pipelineCoords as L.LatLngExpression[], {
        color: '#f87171',
        weight: 1.8,
        dashArray: '6, 6',
        opacity: 0.85
      }).addTo(map);

      // Shore Trunkline
      L.polyline(
        [
          [fieldCoordinates.moccShoreBase.lat, fieldCoordinates.moccShoreBase.lng],
          [fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng]
        ] as L.LatLngExpression[],
        {
          color: '#3b82f6',
          weight: 1.5,
          dashArray: '4, 4',
          opacity: 0.75
        }
      ).addTo(map);

      // Vessel Live Route (Emerald dashed trail)
      wakePolylineRef.current = L.polyline(
        [
          [fieldCoordinates.moccShoreBase.lat, fieldCoordinates.moccShoreBase.lng],
          vessel.coordinates,
          [fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng]
        ] as L.LatLngExpression[],
        {
          color: '#10b981',
          weight: 2,
          dashArray: '3, 5',
          opacity: 0.9
        }
      ).addTo(map);
    }
  }, [activeLayer, showSafetyZone, showPipelines, onSelectPlatform]);

  // Smooth vessel updates
  useEffect(() => {
    if (vesselMarkerRef.current) {
      vesselMarkerRef.current.setLatLng(vessel.coordinates);
    }
    if (wakePolylineRef.current) {
      wakePolylineRef.current.setLatLngs([
        [fieldCoordinates.moccShoreBase.lat, fieldCoordinates.moccShoreBase.lng],
        vessel.coordinates,
        [fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng]
      ]);
    }
  }, [vessel.coordinates]);

  const handleRecenter = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([4.4550, 113.8850], 11, { animate: true });
    }
  }, []);

  const handleFocusFacility = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng], 13, {
        animate: true
      });
    }
  }, []);

  const handleFocusVessel = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(vessel.coordinates, 13, { animate: true });
    }
  }, [vessel.coordinates]);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-900 shadow-sm transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 flex flex-col bg-slate-950 safe-bottom'
          : className || 'w-full h-[360px] md:h-[440px]'
      }`}
    >
      {/* Top Glass Floating Control Bar (Apple Style) */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Title & Live Beacon */}
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-xl border border-white/15 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-semibold text-white tracking-tight">
            Offshore GIS · Salbiah Field
          </span>
          <span className="text-white/30 text-[10px]">|</span>
          <span className="text-[10px] text-slate-300 font-mono">
            {vessel.coordinates[0].toFixed(3)}°N, {vessel.coordinates[1].toFixed(3)}°E
          </span>
        </div>

        {/* Right: Map Style Pill & Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          {/* Segmented Layer Selector */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/15 p-0.5 rounded-full shadow-lg flex items-center text-[10px] font-medium text-slate-300">
            <button
              onClick={() => setActiveLayer('satellite')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                activeLayer === 'satellite'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setActiveLayer('ocean')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                activeLayer === 'ocean'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'hover:text-white'
              }`}
            >
              Ocean Chart
            </button>
            <button
              onClick={() => setActiveLayer('dark')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                activeLayer === 'dark'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'hover:text-white'
              }`}
            >
              Dark
            </button>
          </div>

          {/* Quick Focus Controls */}
          <button
            onClick={handleRecenter}
            title="Recenter Field View"
            className="w-7 h-7 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/15 text-slate-200 hover:text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
            className="w-7 h-7 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/15 text-slate-200 hover:text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Leaflet Map DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-1" />

      {/* Bottom Floating Telemetry HUD (Apple Glass Card) */}
      <div className="absolute bottom-2.5 left-2.5 z-[1000] pointer-events-none max-w-[calc(100%-20px)] sm:max-w-md">
        <div className="pointer-events-auto bg-slate-950/80 backdrop-blur-2xl border border-white/15 rounded-2xl p-2.5 text-white shadow-2xl">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold text-white tracking-tight">
                Live Tactical Telemetry
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-slate-300">
              <button
                onClick={handleFocusFacility}
                className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 font-medium transition cursor-pointer"
              >
                SLDP-A
              </button>
              <button
                onClick={handleFocusVessel}
                className="px-1.5 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium transition cursor-pointer"
              >
                FCB-01
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-[10px]">
            <div>
              <span className="text-slate-400 block text-[9px]">Vessel FCB-01</span>
              <span className="font-semibold text-emerald-300">
                {vessel.speedKnots} kt · ETA {vessel.eta}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">Sea & Wind</span>
              <span className="font-semibold text-slate-100">
                {weather?.windSpeedKt || 14} kt · {weather?.seaStateM || 1.2} m
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">Safety Zone</span>
              <span className="font-semibold text-rose-300">500m Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
