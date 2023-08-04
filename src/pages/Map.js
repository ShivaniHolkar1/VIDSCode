import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from 'react-google-maps';

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Fetch the user's current location using Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('Error getting the user location:', error);
      }
    );
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px' }}
      center={currentLocation}
      zoom={15}
    >
      {currentLocation && <Marker position={currentLocation} />}
    </GoogleMap>
  );
};

export default Map;
