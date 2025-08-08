import axios from 'axios';

const BASE = 'https://places.googleapis.com/v1';
const KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function searchPlaces({ query, lat, lng }) {
  // Check if using dummy API key
  if (KEY === 'AIzaSyDummy-GooglePlaces-API-Key-For-Testing') {
    console.log('🧪 Using mock Google Places response for testing...');
    
    // Return mock places data
    return [
      {
        id: 'mock-place-id-1',
        displayName: { text: query.split(' ')[0] || 'Mock Place' },
        formattedAddress: `123 Mock Street, Test City`,
        location: { 
          latitude: lat || 40.7128, 
          longitude: lng || -74.0060 
        },
        rating: 4.2,
        priceLevel: 2
      }
    ];
  }

  const url = `${BASE}/places:searchText`;
  const body = {
    textQuery: query,
    locationBias: lat && lng ? { circle: { center: { latitude: lat, longitude: lng }, radius: 5000 } } : undefined
  };
  const { data } = await axios.post(url, body, {
    headers: {
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.priceLevel'
    }
  });
  return data.places || [];
}

export async function getPlaceDetails(placeId) {
  // Check if using dummy API key
  if (KEY === 'AIzaSyDummy-GooglePlaces-API-Key-For-Testing') {
    console.log('🧪 Using mock Google Place details response for testing...');
    
    return {
      id: placeId,
      displayName: { text: 'Mock Place Details' },
      formattedAddress: '123 Mock Street, Test City',
      location: { latitude: 40.7128, longitude: -74.0060 },
      rating: 4.5,
      priceLevel: 2,
      photos: []
    };
  }

  const url = `${BASE}/places/${placeId}`;
  const { data } = await axios.get(url, {
    headers: {
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,rating,priceLevel,photos'
    }
  });
  return data;
}
