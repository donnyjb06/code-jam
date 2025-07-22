export const getTopNLocations = (data, n) => {
  const topNLocations = data.splice(0, n)
  return topNLocations
}