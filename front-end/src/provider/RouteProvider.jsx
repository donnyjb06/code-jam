import { useState, useEffect, useRef } from 'react';
import RouteContext from '../context/RouteContext';
import { loadPlaces } from '../lib/loadPlaces';

const RouteProvider = ({ children }) => {
  const hasRun = useRef();
  const locations = useRef();
  const [topNLocations, setTopNLocations] = useState([]);
  const [route, setRoute] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({});
  const [selectedState, setSelectedState] = useState('AL');

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const getPlaces = async () => {
      const places = await loadPlaces();

      locations.current = places;
    };
  }, []);

  return (
    <RouteContext.Provider value={{ route, topNLocations, setSelectedState }}>
      {children}
    </RouteContext.Provider>
  );
};

export default RouteProvider;
