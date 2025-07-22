import { calculateMiles } from "./calculateMiles";

export const nearestNeighborRoute = (places, startingId) => {
  const visited = []
  const unvisited = [...places]

  let idx = unvisited.findIndex(s => s.id === startingId);
  if (idx === -1) throw new Error(`Start "${startingId}" not found`)
  let current = unvisited.splice(idx, 1)[0]
  visited.push(current)

  while (unvisited.length) {
    let bestIdx = 0;
    let bestDist = calculateMiles(current, unvisited[0]);
    for (let i = 0; i < unvisited.length; i++) {
      const distance = calculateMiles(current, unvisited[i])

      if (distance < bestDist) {
        bestDist = distance;
        bestIdx = i;
      }      
    }
  
    current = unvisited.splice(bestIdx, 1)[0]
    visited.push(current)
  }

  return visited
}