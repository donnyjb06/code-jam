export const filterSortData = (
  data,
  identifier = { state: 'UT' },
  order = 'desc',
) => {
  const filteredData = data.filter(
    (entry) =>
      entry[Object.keys(identifier)[0]] === Object.values(identifier)[0],
  );

  const sortedData = filteredData.sort((a, b) => {
    return order === 'asc'
      ? a.weighted_score - b.weighted_score
      : b.weighted_score - a.weighted_score;
  });

  return sortedData;
};
