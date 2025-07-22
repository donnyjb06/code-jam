export const normalizeData = (data) => {
  return data.map(row => {
    const out = {};
    Object.keys(row).forEach(k => {
      const key = k
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // split camelCase
        .replace(/ /g, '_')
        .toLowerCase();
      out[key] = row[k];
    });
    return out;
  });
}