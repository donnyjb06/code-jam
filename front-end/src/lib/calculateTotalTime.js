export const calculateTotalTime = (totalDistance, averageMph = 60) => {
  const totalTime = totalDistance / averageMph;

  const hours = Math.floor(totalTime);
  const minutes = Math.round((totalTime - hours) * 60);
  return { hours, minutes };
};
