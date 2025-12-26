const UNSPLASH_URL = "https://api.unsplash.com/photos/random";
const imageCache = new Map();

function normalizeFoodQuery(foodName) {
  return foodName
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/with.*/g, "")
    .replace(/and.*/g, "")
    .trim();
}

async function getFoodImage(foodName) {
  const clean = normalizeFoodQuery(foodName);

  // cache prevents duplicate Unsplash calls
  if (imageCache.has(clean)) {
    return imageCache.get(clean);
  }

  const res = await fetch(
    `${UNSPLASH_URL}?query=${encodeURIComponent(clean + " food")}&orientation=squarish&content_filter=high`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  const url = data.urls.small;

  imageCache.set(clean, url);
  return url;
}

module.exports = { getFoodImage };
