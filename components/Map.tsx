import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom icon definition
const customIcon = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="#4A90E2" d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
    </svg>
  `,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

interface MapProps {
  facilities: Array<{ lat: number; lng: number; name: string }>;
}

const Map: React.FC<MapProps> = ({ facilities }) => {
  return (
    <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {facilities.map((facility, index) => (
        <Marker key={index} position={[facility.lat, facility.lng]} icon={customIcon}>
          <Popup>{facility.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;