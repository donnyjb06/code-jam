import { useState, useEffect, useRef } from 'react';
import RouteContext from '../context/RouteContext';
import { loadPlaces } from '../lib/loadPlaces';
import { filterSortData } from '../lib/filterSortData';
import { getTopNLocations } from '../lib/getTopNLocation';
import { nearestNeighborRoute } from '../lib/nearestNeighborRoute';
import { getWikiImageUrls } from '../utils/getWikiImageUrls';
import {calculateTotalTime} from '../lib/calculateTotalTime';
import { calculateTotalDistance } from '../lib/calculateTotalDistance';

const RouteProvider = ({ children }) => {
  const hasRun = useRef();
  const locations = useRef();
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [topNLocations, setTopNLocations] = useState([]);
  const [route, setRoute] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({});
  const [selectedState, setSelectedState] = useState('');
  const [amountOfLocations, setAmountOfLocations] = useState('');
  const [placeData, setPlaceData] = useState([]);
  const [mode, setMode] = useState('form');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalTime, setTotalTime] = useState({});
  const [currentStop, setCurrentStop] = useState({})

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
    if (!amountOfLocations) return;

    setTopNLocations(filteredLocations, amountOfLocations);
  }, [filteredLocations]);

  useEffect(() => {
    if (Object.keys(currentLocation).length === 0 || !topNLocations.length) return;

    setCurrentLocation(topNLocations[0]);
  }, [topNLocations]);

  useEffect(() => {
    if (!route.length) return;

    const getDetails = async () => {
      try {
        const urls = await getWikiImageUrls(route);
        const withImgs = route.map((p, i) => ({ ...p, image: urls[i] }));
        setPlaceData(withImgs);
      } catch (error) {
        console.error(error.message);
      }
    };
    getDetails();
  }, [route]);

  useEffect(() => {
    if (!placeData.length) return;

    console.log(placeData[0])
    setCurrentStop(placeData[0]);
  }, [placeData]);

  const getNextLocation = () => {
    if ((currentIndex + 1) === placeData.length) return
    console.log(placeData[currentIndex + 1])
    setCurrentStop(placeData[currentIndex + 1]);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const getPreviousLocation = () => {
    if (currentIndex - 1 === -1) return
    setCurrentStop(placeData[currentIndex - 1]);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

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
      const newTopNLocations = getTopNLocations(filteredLocations, e.target.value)

      return newTopNLocations
    });
  };

  const handleCurrentLocationChange = (e) => {
    setCurrentLocation((prevLocation) => {
      const location = topNLocations.find(
        (location) => location.id === Number(e.target.value),
      );
      return location;
    });
  };

  const handleGenerateRoute = () => {
    const optimalRoute = nearestNeighborRoute(
      topNLocations,
      currentLocation.id,
    );
    setRoute(optimalRoute);
    const distance = calculateTotalDistance(optimalRoute);
    setTotalDistance(distance);
    const totalTime = calculateTotalTime(distance);
    setTotalTime(totalTime);

    setSelectedState('');
    setAmountOfLocations('');
    setTopNLocations([]);
    setMode('preview');
  };

  const resetRoute = () => {
    setMode('form');
    setCurrentLocation({});
    setRoute([]);
    setTotalDistance(0);
    setTotalTime({});
    setCurrentIndex(0)
    setCurrentStop({})
  };

  useEffect(() => {
    console.log(route);
    console.log(topNLocations)
  }, [route]);
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
        handleCurrentLocationChange,
        mode,
        getNextLocation,
        getPreviousLocation,
        currentIndex,
        totalDistance,
        totalTime,
        currentStop,
        resetRoute
      }}>
      {children}
    </RouteContext.Provider>
  );
};

export default RouteProvider;
