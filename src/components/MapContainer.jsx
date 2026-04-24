import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: -23.5505,
  lng: -46.6333 // São Paulo
};

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#475569" }] },
  { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#0f172a" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#132a13" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0f172a" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#334155" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#263548" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#070d1a" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#334155" }] },
];

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  styles: darkMapStyles,
  backgroundColor: '#0f172a',
};

const directionsRendererOptions = {
  polylineOptions: {
    strokeColor: '#3b82f6',
    strokeWeight: 6,
    strokeOpacity: 0.8,
  },
  suppressMarkers: true,
};

// Generic circular marker
const getMarkerIcon = (color) => ({
  path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
  fillColor: color,
  fillOpacity: 1,
  strokeWeight: 2,
  strokeColor: '#0f172a',
  scale: 1.2,
  labelOrigin: { x: 0, y: -30 }
});

const libraries = ['places'];

export default function MapContainer({ directions, deliveries }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  if (!isLoaded) {
    return (
      <div className="map-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 16px', width: 36, height: 36 }} />
          <span className="text-sm text-muted">Carregando mapa...</span>
        </div>
      </div>
    );
  }

  // Get waypoints coordinates securely
  const stops = [];
  if (directions && directions.routes && directions.routes.length > 0) {
    const legs = directions.routes[0].legs;
    legs.forEach((leg, idx) => {
      stops.push(leg.start_location);
    });
    // Finally add the end destination of the last leg
    stops.push(legs[legs.length - 1].end_location);
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        options={options}
        onLoad={onLoad}
      >
        {directions && (
          <DirectionsRenderer 
            directions={directions} 
            options={directionsRendererOptions}
          />
        )}
        
        {/* Render custom markers for each stop */}
        {stops.map((position, i) => (
          <Marker
            key={i}
            position={position}
            label={{
              text: String(i + 1),
              color: 'white',
              fontSize: '14px',
              fontWeight: '900'
            }}
            icon={getMarkerIcon(i === 0 ? '#f59e0b' : '#3b82f6')} // First point orange, rest blue
          />
        ))}
      </GoogleMap>
    </div>
  );
}
