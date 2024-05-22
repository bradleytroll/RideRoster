const UNSPLASH_ACCESS_KEY = 'k8nc5KoIiF50bikdP5P9PIFOaFBhPBRUWu2MBmNgxY4';

export const fetchUnsplashImage = async (query) => {
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.small; // Get the URL of the first image
    }
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
  }
  return null;
};
