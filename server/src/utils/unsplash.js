import { createApi } from 'unsplash-js';

const unsplash = createApi({ accessKey: process.env.UNSPLASH_ACCESS_KEY });

export async function getImageForQuery(query) {
  // Check if using dummy API key
  if (process.env.UNSPLASH_ACCESS_KEY === 'dummy-unsplash-access-key-for-testing') {
    console.log('🧪 Using mock Unsplash response for testing...');
    
    // Return a placeholder image URL
    const mockImages = [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
      'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=400',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73ab8?w=400'
    ];
    
    // Return a random mock image
    return mockImages[Math.floor(Math.random() * mockImages.length)];
  }

  const res = await unsplash.search.getPhotos({ query, perPage: 1, orientation: 'landscape' });
  if (res.type === 'success' && res.response.results.length) {
    const photo = res.response.results[0];
    return photo.urls.small;
  }
  return null;
}
