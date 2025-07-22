export const cleanData = (data) => {
  return data
    .filter((r) => r.latitude && r.longitude)
    .filter((r, i, arr) => arr.findIndex((x) => x.address === r.address) === i)
    .map((r, index) => ({
      ...r,
      weighted_score:
        Math.round(Number(r.weighted_score)) || 0,
        id: index
    }));
};
