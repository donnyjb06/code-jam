import { useState, useEffect, useRef } from 'react';
import RouteContext from '../context/RouteContext';
import { loadPlaces } from '../lib/loadPlaces';
import { filterSortData } from '../lib/filterSortData';
import { getTopNLocations } from '../lib/getTopNLocation';
import { nearestNeighborRoute } from '../lib/nearestNeighborRoute';

const RouteProvider = ({ children }) => {
  const hasRun = useRef();
  const locations = useRef();
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [topNLocations, setTopNLocations] = useState([]);
  const [route, setRoute] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({});
  const [selectedState, setSelectedState] = useState('');
  const [amountOfLocations, setAmountOfLocations] = useState('');

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const getPlaces = async () => {
      try {
        const places = await loadPlaces('./Tourist destinations.xls');
        locations.current = places;
      } catch (error) {
        console.error(error.message);
      }
    };

    getPlaces();
  }, []);

  useEffect(() => {
    if (!amountOfLocations) return
    
    setTopNLocations(filteredLocations, amountOfLocations)
  }, [filteredLocations])

  useEffect(() => {
    console.log(topNLocations)
    if (!currentLocation.id) return

    setCurrentLocation(topNLocations[0])
  }, [topNLocations])

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setFilteredLocations(
      filterSortData(locations.current, { state: e.target.value }),
    );
  };

  const handleAmountChange = (e) => {
    setAmountOfLocations(e.target.value);
    setTopNLocations((prevLocations) => {
      if (e.target.value < prevLocations.length) {
        return prevLocations.splice(0, e.target.value);
      }

      return getTopNLocations(filteredLocations, e.target.value);
    });
  };

  const handleCurrentLocationChange = (e) => {
    console.log(e.target.value)
    setCurrentLocation(prevLocation => {
      const location = topNLocations.find(location => location.id === Number(e.target.value))
      console.log(location)
      return location
    })
  }

  const handleGenerateRoute = () => {
    setRoute((prevRoute) => {
      const optimalRoute = nearestNeighborRoute(topNLocations, currentLocation.id);
      return optimalRoute;
    });

    setSelectedState('')
    setAmountOfLocations('')
    setTopNLocations([])
    setCurrentLocation("")
  };

  return (
    <RouteContext.Provider
      value={{
        route,
        topNLocations,
        handleStateChange,
        handleAmountChange,
        amountOfLocations,
        selectedState,
        filteredLocations,
        handleGenerateRoute,
        currentLocation,
        handleCurrentLocationChange
      }}>
      {children}
    </RouteContext.Provider>
  );
};

export default RouteProvider;
