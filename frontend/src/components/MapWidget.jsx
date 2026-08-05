import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom component to handle routing
const RoutingMachine = ({ origin, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !origin || !destination) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(origin.lat, origin.lng),
        L.latLng(destination.lat, destination.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: '#4F46E5', weight: 6 }]
      },
      createMarker: function() { return null; } // Don't create default markers for waypoints
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, origin, destination]);

  return null;
};

// Map component
const MapWidget = ({ 
  center = [20.5937, 78.9629], // Default India
  zoom = 5,
  height = "400px", 
  markers = [], 
  routeOrigin = null, 
  routeDestination = null 
}) => {
  
  return (
    <div style={{ height, width: '100%', borderRadius: '1.5rem', overflow: 'hidden' }} className="shadow-sm border border-gray-100 z-10 relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]}>
            <Popup>
              <strong>{marker.title}</strong><br/>
              {marker.description}
            </Popup>
          </Marker>
        ))}

        {routeOrigin && routeDestination && (
          <RoutingMachine origin={routeOrigin} destination={routeDestination} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapWidget;
