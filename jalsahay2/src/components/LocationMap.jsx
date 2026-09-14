import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

export default function LocationMap({ latitude, longitude }) {

  if (!latitude || !longitude) {
    return (
      <div className="p-4 rounded-xl bg-slate-100 text-sm">
        Detect your location first.
      </div>
    );
  }

  const position = [
    parseFloat(latitude),
    parseFloat(longitude)
  ];

  return (
    <div className="h-72 rounded-xl overflow-hidden">
      <MapContainer
        center={position}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            Your complaint location
          </Popup>
        </Marker>

      </MapContainer>
    </div>
  );
}