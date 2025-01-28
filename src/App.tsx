import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import XYZ from 'ol/source/XYZ';
import ImageWMS from 'ol/source/ImageWMS';
import { defaults as defaultControls } from 'ol/control';
import { transform } from 'ol/proj';
import { format } from 'date-fns';
import { parseWMSCapabilities } from './utils/wmsParser';
import Toolbar from './components/Toolbar';
import Timeline from './components/Timeline';
import KeyboardHelp from './components/KeyboardHelp';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

const CAPABILITIES_URL = 'https://openwms.fmi.fi/geoserver/wms?service=WMS&request=GetCapabilities';
const WMS_URL = 'https://openwms.fmi.fi/geoserver/wms';
const RADAR_LAYER = 'Radar:suomi_dbz_eureffin';
const UPDATE_INTERVAL = 60000; // 1 minute

export default function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  
  const [settings, setSettings] = useLocalStorage('radar-settings', {
    showGeolocation: false,
    showSatellite: true,
    showRadar: true,
    showLightning: false,
    showObservations: false,
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const baseLayer = new TileLayer({
      source: new XYZ({
        url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      }),
    });

    const referenceLayer = new TileLayer({
      source: new XYZ({
        url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      }),
    });

    const radarLayer = new ImageLayer({
      source: new ImageWMS({
        url: WMS_URL,
        params: {
          'LAYERS': RADAR_LAYER,
          'TIME': currentTime,
        },
        ratio: 1,
      }),
    });

    const initialMap = new Map({
      target: mapRef.current,
      layers: [baseLayer, radarLayer, referenceLayer],
      controls: defaultControls(),
      view: new View({
        center: transform([25, 65], 'EPSG:4326', 'EPSG:3857'),
        zoom: 6,
      }),
    });

    mapInstanceRef.current = initialMap;
    setMap(initialMap);

    return () => {
      initialMap.setTarget(undefined);
    };
  }, []);

  // Fetch capabilities and update times
  useEffect(() => {
    const fetchCapabilities = async () => {
      try {
        const response = await fetch(CAPABILITIES_URL);
        const text = await response.text();
        const times = parseWMSCapabilities(text, RADAR_LAYER);
        setAvailableTimes(times);
        if (times.length > 0) {
          setCurrentTime(times[times.length - 1]);
        }
      } catch (error) {
        console.error('Failed to fetch capabilities:', error);
      }
    };

    fetchCapabilities();
    const interval = setInterval(fetchCapabilities, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Update radar layer when time changes
  useEffect(() => {
    if (!map || !currentTime) return;

    const radarLayer = map.getLayers().getArray().find(layer => 
      layer instanceof ImageLayer
    ) as ImageLayer<ImageWMS>;

    if (radarLayer) {
      const source = radarLayer.getSource();
      source.updateParams({ 'TIME': currentTime });
    }
  }, [map, currentTime]);

  // Animation control
  useEffect(() => {
    let animationInterval: number;

    if (isPlaying && availableTimes.length > 0) {
      animationInterval = window.setInterval(() => {
        setCurrentTime(prevTime => {
          const currentIndex = availableTimes.indexOf(prevTime);
          const nextIndex = (currentIndex + 1) % availableTimes.length;
          return availableTimes[nextIndex];
        });
      }, speed);
    }

    return () => clearInterval(animationInterval);
  }, [isPlaying, availableTimes, speed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        setShowKeyboardHelp(true);
      }

      // Add other keyboard shortcuts here
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setShowKeyboardHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="app">
      <div ref={mapRef} className="map-container" />
      <Toolbar
        settings={settings}
        onSettingsChange={setSettings}
        map={map}
      />
      <Timeline
        currentTime={currentTime}
        availableTimes={availableTimes}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onTimeChange={setCurrentTime}
        onSpeedChange={setSpeed}
        speed={speed}
      />
      {showKeyboardHelp && <KeyboardHelp />}
    </div>
  );
}

