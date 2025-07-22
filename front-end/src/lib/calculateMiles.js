import { getDistance } from 'geolib';
import { MILES_PER_METERS } from '../utils/constants';

export const calculateMiles = (a, b) => {
  const meters = getDistance(
    { latitude: a.latitude, longitude: a.longitude },
    { latitude: b.latitude, longitude: b.longitude },
  );

  return Math.round(meters / MILES_PER_METERS)
};
