import {filterSortData} from "./filterSortData"

export const getTopNLocations = (data, n, state) => {
  const filteredSortedData = filterSortData(data, state)
  const topNLocations = filteredSortedData.splice(0, n)
  return topNLocations
}