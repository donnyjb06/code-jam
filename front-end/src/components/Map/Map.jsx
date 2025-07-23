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
  const { currentLocation, route, currentStop } = useRoute();
  const markers = useRef([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.longitude, pos.coords.latitude]);
        setLocationReady(true);
      },
      (err) => {
        console.warn('Geolocation failed, using fallback:', err.message);
        setLocationReady(true);
      },
    );
  }, []);

  useEffect(() => {
    if (
      !mapRef.current ||
      !currentLocation ||
      Object.keys(currentLocation).length === 0
    )
      return;

    mapRef.current.flyTo({
      center: [currentLocation.longitude, currentLocation.latitude],
      zoom: 12,
      curve: 1.42,
      speed: 2,
      essential: true,
    });
  }, [currentLocation]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const sourceId = 'route-anim-src';
    const layerId = 'route-anim-line';

    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    if (!route?.length) return;

    route.forEach((location) => {
      const popup = new maplibregl.Popup({ offset: 25 }).setText(location.name);
      const marker = new maplibregl.Marker({ color: '#3d8f6b' })
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(map);
      markers.current.push(marker);

      const el = marker.getElement();
      const onClick = () => {};
    });

    map.flyTo({
      center: [route[0].longitude, route[0].latitude],
      zoom: 9,
      curve: 1.42,
      speed: 2,
      essential: true,
    });

    const data = {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [] },
    };

    map.addSource(sourceId, { type: 'geojson', data });
    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-width': 4, 'line-color': '#ff7e5f' },
    });

    const coords = route.map((p) => [p.longitude, p.latitude]);
    let i = 0;
    const INTERVAL_MS = 150;
    const intervalId = setInterval(() => {
      const source = map.getSource(sourceId);
      if (i >= coords.length || !source || !coords[i]) {
        clearInterval(intervalId);
        return;
      }

      data.geometry.coordinates.push(coords[i]);
      source.setData(data);
      i++;
    }, INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
      markers.current.forEach((m) => m.remove());
      markers.current = [];
    };
  }, [route]);

  useEffect(() => {
    if (
      !mapRef.current ||
      !currentStop ||
      Object.keys(currentStop).length === 0
    )
      return;

    mapRef.current.flyTo({
      center: [currentStop.longitude, currentStop.latitude],
      zoom: 12,
      curve: 1.42,
      speed: 2,
      essential: true,
    });
  }, [currentStop]);

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

        if (route?.length) {
          const sourceId = 'route-anim-src';
          const layerId = 'route-anim-line';

          if (map.getLayer(layerId)) map.removeLayer(layerId);
          if (map.getSource(sourceId)) map.removeSource(sourceId);

          const lineCoords = route.map((p) => [p.longitude, p.latitude]);

          map.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: { type: 'LineString', coordinates: lineCoords },
            },
          });

          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-width': 4, 'line-color': '#ff7e5f' },
          });

          markers.current.forEach((m) => m.remove());
          markers.current = [];

          route.forEach((location) => {
            const popup = new maplibregl.Popup({ offset: 25 }).setText(
              location.name,
            );
            const marker = new maplibregl.Marker({ color: '#3d8f6b' })
              .setLngLat([location.longitude, location.latitude])
              .setPopup(popup)
              .addTo(map);
            markers.current.push(marker);
          });
        }

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
