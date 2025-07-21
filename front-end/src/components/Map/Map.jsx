import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import useTheme from '../../hooks/useTheme';
const apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

const Map = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [locationReady, setLocationReady] = useState(false);
  const [coords, setCoords] = useState([-84.388, 33.749]);
  const { theme } = useTheme();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.longitude, pos.coords.latitude]);
        setLocationReady(true);
      },
      (err) => {
        console.warn('Geolocation failed, using fallback:', err.message);
        setLocationReady(true); // still render with fallback
      },
    );
  }, []);

  useEffect(() => {
    if (!locationReady || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/${
        theme === 'dark' ? 'streets-dark' : 'streets'
      }/style.json?key=${apiKey}`,
      center: coords,
      zoom: 12,
    });
    console.log(mapRef.style)

    new maplibregl.Marker().setLngLat(coords).addTo(mapRef.current);
  }, [locationReady, coords]);

  useEffect(() => {
    if (!mapRef.current) return;

    const updateStyle = () => {
      const newStyle = `https://api.maptiler.com/maps/${
        theme === 'dark' ? 'streets-dark' : 'streets'
      }/style.json?key=${apiKey}`;
      mapRef.current.setStyle(newStyle);
    };

    if (mapRef.current.loaded()) {
      updateStyle()
    } else {
      mapRef.current.once('load', updateStyle)
    }
  }, [theme]);

  return <div ref={mapContainer} style={{ width: '100vw', height: '100%' }} />;
};

export default Map;
