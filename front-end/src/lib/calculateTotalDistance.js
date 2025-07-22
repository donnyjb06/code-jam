import { calculateMiles } from "./calculateMiles";

export const calculateTotalDistance = (route) => {
  let distance = 0;
  let lastLocation = route[0]

  for (let i = 1; i < route.length; i++) {
    const currentDistance = calculateMiles(lastLocation, route[i])
    distance += currentDistance;

    lastLocation = route[i]
  }

  return distance
}