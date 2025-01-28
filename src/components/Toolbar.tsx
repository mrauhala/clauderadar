import { useEffect, useState } from 'react';
import Map from 'ol/Map';
import { Geolocation } from 'ol';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import './Toolbar.css';

interface Settings {
  showGeolocation: boolean;
  showSatellite: boolean;
  showRadar: boolean;
  showLightning: boolean;
  showObservations: boolean;
}

interface ToolbarProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  map: Map | null;
}

export default function Toolbar({ settings, onSettingsChange, map }: ToolbarProps) {
  const [geolocation, setGeolocation] = useState<Geolocation | null>(null);
  const [positionLayer, setPositionLayer] = useState<VectorLayer<VectorSource> | null>(null);

  useEffect(() => {
    if (!map) return;

    const positionFeature = new Feature();
    positionFeature.setStyle(new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: '#3399CC' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
      }),
    }));

    const layer = new VectorLayer({
      source: new VectorSource({
        features: [positionFeature],
      }),
    });

    setPositionLayer(layer);

    const geo = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: map.getView().getProjection(),
    });

    geo.on('change:position', () => {
      const coordinates = geo.getPosition();
      if (coordinates) {
        positionFeature.setGeometry(coordinates ? new Point(coordinates) : undefined);
      }
    });

    setGeolocation(geo);

    return () => {
      geo.setTracking(false);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !positionLayer) return;

    if (settings.showGeolocation) {
      map.addLayer(positionLayer);
      if (geolocation) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'granted') {
            geolocation.setTracking(true);
          } else if (result.state === 'prompt') {
            // Will trigger the browser permission prompt
            geolocation.setTracking(true);
          }
        });
      }
    } else {
      map.removeLayer(positionLayer);
      if (geolocation) {
        geolocation.setTracking(false);
      }
    }
  }, [settings.showGeolocation, map, positionLayer, geolocation]);

  const toggleSetting = (key: keyof Settings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="toolbar top">
      <button
        className={`toolbar-button ${settings.showGeolocation ? 'active' : ''}`}
        onClick={() => toggleSetting('showGeolocation')}
        title="Toggle Geolocation (G)"
      >
        
      </button>
      <button
        className={`toolbar-button ${settings.showSatellite ? 'active' : ''}`}
        onClick={() => toggleSetting('showSatellite')}
        title="Toggle Satellite (S)"
      >
        
      </button>
      <button
        className={`toolbar-button ${settings.showRadar ? 'active' : ''}`}
        onClick={() => toggleSetting('showRadar')}
        title="Toggle Radar (R)"
      >
        
      </button>
      <button
        className={`toolbar-button ${settings.showLightning ? 'active' : ''}`}
        onClick={() => toggleSetting('showLightning')}
        title="Toggle Lightning (L)"
      >
        
      </button>
      <button
        className={`toolbar-button ${settings.showObservations ? 'active' : ''}`}
        onClick={() => toggleSetting('showObservations')}
        title="Toggle Observations (O)"
      >
        
      </button>
    </div>
  );
}

