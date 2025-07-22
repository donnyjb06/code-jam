import { convert } from './convert';
import { cleanData } from './cleanData';
import { normalizeData } from './normalizeData';

export async function loadPlaces(path) {
  const convertedData = await convert(path)
  const normalizedData = normalizeData(convertedData)
  const cleanedData = cleanData(normalizedData)

  return cleanedData;
}