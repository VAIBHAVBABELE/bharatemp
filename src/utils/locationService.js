// Location Service Utility Functions
import pincodes from './pincode.json';

// OpenStreetMap Nominatim API base URL
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

/**
 * Get location details from coordinates using reverse geocoding
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<Object>} Location details
 */
export const getLocationByCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      const city = address.city || address.town || address.village || address.county || 'Unknown City';
      const state = address.state || 'Unknown State';
      const postcode = address.postcode || '';
      const country = address.country || 'Unknown Country';
      
      // Try to find matching pincode in our database
      const foundPincode = pincodes.find((pincode) => pincode.Pincode === postcode);
      
      return {
        success: true,
        city,
        state,
        country,
        postcode,
        fullAddress: data.display_name,
        coordinates: { latitude, longitude },
        pincodeData: foundPincode,
        deliveryTime: foundPincode ? "Delivery in 24 Hours" : "Delivery in 24 to 72 Hours"
      };
    }
    
    return { success: false, error: 'No address data found' };
  } catch (error) {
    console.error('Error getting location by coordinates:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Search for locations by name or coordinates
 * @param {string} searchTerm - Search term (place name or coordinates)
 * @returns {Promise<Array>} Array of location results
 */
export const searchLocations = async (searchTerm) => {
  try {
    // Check if search term is coordinates
    const coordMatch = searchTerm.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    
    if (coordMatch) {
      const latitude = parseFloat(coordMatch[1]);
      const longitude = parseFloat(coordMatch[2]);
      
      if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
        const result = await getLocationByCoordinates(latitude, longitude);
        return result.success ? [result] : [];
      }
    }
    
    // Search by place name
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=5&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search location');
    }
    
    const data = await response.json();
    
    if (data && Array.isArray(data)) {
      return data.map(place => {
        const address = place.address;
        const city = address.city || address.town || address.village || address.county || place.display_name.split(',')[0];
        const state = address.state || 'Unknown State';
        const postcode = address.postcode || '';
        const country = address.country || 'Unknown Country';
        
        // Try to find matching pincode
        const foundPincode = pincodes.find((pincode) => pincode.Pincode === postcode);
        
        return {
          success: true,
          city,
          state,
          country,
          postcode,
          fullAddress: place.display_name,
          coordinates: { 
            latitude: parseFloat(place.lat), 
            longitude: parseFloat(place.lon) 
          },
          pincodeData: foundPincode,
          deliveryTime: foundPincode ? "Delivery in 24 Hours" : "Delivery in 24 to 72 Hours"
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};

/**
 * Get current location using browser geolocation API
 * @returns {Promise<Object>} Location details
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await getLocationByCoordinates(latitude, longitude);
        resolve(result);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

/**
 * Find nearest pincode from coordinates
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Object} Nearest pincode data
 */
export const findNearestPincode = (latitude, longitude) => {
  let nearestPincode = null;
  let minDistance = Infinity;

  pincodes.forEach(pincode => {
    // Note: This is a simplified approach. In production, you'd want to store
    // coordinates for each pincode in your database for accurate distance calculation
    // For now, we'll use a basic approximation
    const distance = calculateDistance(latitude, longitude, 0, 0); // Simplified
    if (distance < minDistance) {
      minDistance = distance;
      nearestPincode = pincode;
    }
  });

  return nearestPincode;
};

/**
 * Format location string for display
 * @param {Object} locationData - Location data object
 * @returns {string} Formatted location string
 */
export const formatLocationString = (locationData) => {
  if (locationData.pincodeData) {
    return `${locationData.pincodeData.Pincode}, ${locationData.pincodeData.City}, ${locationData.pincodeData.state}`;
  }
  return `${locationData.city}, ${locationData.state}`;
};

/**
 * Validate coordinates
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {boolean} True if coordinates are valid
 */
export const validateCoordinates = (latitude, longitude) => {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};
