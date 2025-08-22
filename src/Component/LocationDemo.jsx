import React, { useState } from 'react';
import { 
  getLocationByCoordinates, 
  searchLocations, 
  getCurrentLocation,
  calculateDistance,
  validateCoordinates 
} from '../utils/locationService';
import { FaMapMarkerAlt, FaCrosshairs, FaSearch, FaInfoCircle } from 'react-icons/fa';

const LocationDemo = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationResult, setLocationResult] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCoordinateSearch = async () => {
    if (!latitude || !longitude) {
      setError('Please enter both latitude and longitude');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!validateCoordinates(lat, lng)) {
      setError('Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await getLocationByCoordinates(lat, lng);
      setLocationResult(result);
    } catch (err) {
      setError('Error fetching location data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const results = await searchLocations(searchTerm);
      setSearchResults(results);
    } catch (err) {
      setError('Error searching locations: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await getCurrentLocation();
      setLocationResult(result);
      if (result.success) {
        setLatitude(result.coordinates.latitude.toString());
        setLongitude(result.coordinates.longitude.toString());
      }
    } catch (err) {
      setError('Error getting current location: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result) => {
    setLocationResult(result);
    setLatitude(result.coordinates.latitude.toString());
    setLongitude(result.coordinates.longitude.toString());
    setSearchResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#1E3473]">
        Location Detection Demo
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Coordinate Input Section */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-600" />
              Search by Coordinates
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 28.6139"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 77.2090"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={handleCoordinateSearch}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Searching...' : 'Search Location'}
              </button>
            </div>
          </div>

          {/* Current Location Button */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaCrosshairs className="text-green-600" />
              Get Current Location
            </h3>
            <button
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Getting Location...' : 'Use My Location'}
            </button>
          </div>

          {/* Location Search */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaSearch className="text-orange-600" />
              Search by Place Name
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="e.g., Delhi, India or 28.6139, 77.2090"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleLocationSearch();
                  }
                }}
              />
              <button
                onClick={handleLocationSearch}
                disabled={isLoading}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Location Result */}
          {locationResult && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FaInfoCircle className="text-gray-600" />
                Location Details
              </h3>
              
              {locationResult.success ? (
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">City:</span>
                    <span>{locationResult.city}</span>
                    
                    <span className="font-medium">State:</span>
                    <span>{locationResult.state}</span>
                    
                    <span className="font-medium">Country:</span>
                    <span>{locationResult.country}</span>
                    
                    <span className="font-medium">Postcode:</span>
                    <span>{locationResult.postcode || 'N/A'}</span>
                    
                    <span className="font-medium">Coordinates:</span>
                    <span className="font-mono">
                      {locationResult.coordinates.latitude.toFixed(6)}, {locationResult.coordinates.longitude.toFixed(6)}
                    </span>
                    
                    <span className="font-medium">Delivery Time:</span>
                    <span className={locationResult.pincodeData ? 'text-green-600' : 'text-orange-600'}>
                      {locationResult.deliveryTime}
                    </span>
                  </div>
                  
                  {locationResult.pincodeData && (
                    <div className="mt-3 p-2 bg-green-100 rounded">
                      <span className="text-green-800 text-xs">
                        ✓ Service available in this area
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <span className="font-medium">Full Address:</span>
                    <p className="text-gray-600 mt-1">{locationResult.fullAddress}</p>
                  </div>
                </div>
              ) : (
                <div className="text-red-600">
                  {locationResult.error || 'Failed to get location details'}
                </div>
              )}
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Search Results</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleResultClick(result)}
                    className="p-3 bg-white rounded border cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium">{result.city}, {result.state}</div>
                    <div className="text-sm text-gray-600">{result.fullAddress}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {result.coordinates.latitude.toFixed(4)}, {result.coordinates.longitude.toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">How to Use</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Enter coordinates manually (e.g., 28.6139, 77.2090 for Delhi)</li>
              <li>• Use "Get Current Location" to detect your location automatically</li>
              <li>• Search by place name (e.g., "Mumbai, India")</li>
              <li>• Enter coordinates in the search box (e.g., "28.6139, 77.2090")</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDemo;
