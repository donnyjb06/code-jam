import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
const apiKey = import.meta.env.VITE_MAP_TILER_API_KEY


const Map = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [locationReady, setLocationReady] = useState(false);
  const [coords, setCoords] = useState([-84.388, 33.749]); // fallback: Atlanta

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.longitude, pos.coords.latitude]);
        setLocationReady(true);
      },
      (err) => {
        console.warn('Geolocation failed, using fallback:', err.message);
        setLocationReady(true); // still render with fallback
      }
    );
  }, []);

  useEffect(() => {
    if (!locationReady || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      center: coords,
      zoom: 12,
    });
    

    new maplibregl.Marker().setLngLat(coords).addTo(mapRef.current);
  }, [locationReady, coords]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default Map;
