export async function getWikiImageUrls(route) {
  const SEARCH_URL = 'https://en.wikipedia.org/w/api.php';
  const SUMMARY_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

  async function one(p) {
    const q = encodeURIComponent(`${p.name} ${p.city} ${p.state}`);
    const r1 = await fetch(`${SEARCH_URL}?action=query&list=search&srsearch=${q}&format=json&origin=*`);
    const title = (await r1.json()).query?.search?.[0]?.title;
    if (!title) return null;
    const r2 = await fetch(`${SUMMARY_URL}${encodeURIComponent(title)}`);
    return (await r2.json()).thumbnail?.source ?? null;
  }

  return Promise.all(route.map(one));
}
