import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import useTheme from '../../hooks/useTheme';
import useRoute from '../../hooks/useRoute';
const apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

const Map = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [locationReady, setLocationReady] = useState(false);
  const [coords, setCoords] = useState([-84.388, 33.749]);
  const { theme } = useTheme();
  const { currentLocation, route } = useRoute();
  const markers = useRef([]);

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
    if (!mapRef.current || !currentLocation.longitude) return;

    mapRef.current.flyTo({
      center: [currentLocation.longitude, currentLocation.latitude],
      zoom: 12,
      curve: 1.42,
      speed: 2,
      essential: true,
    });
  }, [currentLocation]);

  useEffect(() => {
    if (!route?.length || !mapRef.current) return;
  
    const map = mapRef.current;
    const sourceId = 'route-anim-src';
    const layerId  = 'route-anim-line';
  
    // 1) Clear old markers
    markers.current.forEach(m => m.remove());
    markers.current = [];
  
    // 2) Add fresh markers + popups
    route.forEach(loc => {
      const popup = new maplibregl.Popup({ offset: 25 }).setText(loc.name);
      const marker = new maplibregl.Marker({ color: '#3d8f6b' })
        .setLngLat([loc.longitude, loc.latitude])
        .setPopup(popup)
        .addTo(map);
      markers.current.push(marker);

      const el = marker.getElement()
      const onClick = () => {}
    });
  
    // 3) Fly to start
    map.flyTo({
      center: [route[0].longitude, route[0].latitude],
      zoom: 12,
      curve: 1.42,
      speed: 2,
      essential: true
    });
  
    // 4) Prep/replace source & layer for animated line
    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);
  
    const data = {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [] }
    };
  
    map.addSource(sourceId, { type: 'geojson', data });
    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-width': 4, 'line-color': '#ff7e5f' }
    });
  
    // 5) Animate coordinates in
    const coords = route.map(p => [p.longitude, p.latitude]);
    let i = 0;
    const INTERVAL_MS = 150;
    const intervalId = setInterval(() => {
      if (i > coords.length) {
        clearInterval(intervalId)
        return
      }

      data.geometry.coordinates.push(coords[i])
      map.getSource(sourceId).setData(data)
      i++
    }, INTERVAL_MS)


  
    // 6) Cleanup on unmount / route change
    return () => {
      clearInterval(intervalId)
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
      markers.current.forEach(m => m.remove());
      markers.current = [];
    };
  }, [route]);
  

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
  }, [locationReady, coords]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const newStyle = `https://api.maptiler.com/maps/${
      theme === 'dark' ? 'streets-dark' : 'streets'
    }/style.json?key=${apiKey}`;

    let queuedStyle = null;

    const applyStyle = () => {
      map.setStyle(newStyle);

      map.once('style.load', () => {
        new maplibregl.Marker().setLngLat(coords).addTo(map);

        // If the theme changed again during loading, apply the latest one
        if (queuedStyle && queuedStyle !== newStyle) {
          const nextStyle = queuedStyle;
          queuedStyle = null;
          map.setStyle(nextStyle);

          map.once('style.load', () => {
            new maplibregl.Marker().setLngLat(coords).addTo(map);
          });
        }
      });
    };

    if (!map.isStyleLoaded()) {
      queuedStyle = newStyle;
      map.once('style.load', applyStyle);
    } else {
      applyStyle();
    }
  }, [theme]);

  return <div ref={mapContainer} style={{ width: '100vw', height: '100%' }} />;
};

export default Map;
