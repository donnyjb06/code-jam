import * as XLSX from 'xlsx';

export const convert = async (path) => {
  const res = await fetch(path); // put file in /public
  if (!res.ok) throw new Error('File not found');
  const arrayBuffer = await res.arrayBuffer();

  // Read workbook
  const wb = XLSX.read(arrayBuffer, { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws); 

  return rows
}