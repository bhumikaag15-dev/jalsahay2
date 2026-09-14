import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap
} from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { supabase } from '../lib/supabaseClient';

const defaultCenter = [18.5204, 73.8567];

const markerIcon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',

  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',

  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationController({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo(location, 14);
    }
  }, [location, map]);

  return null;
}

function riskColor(priority) {
  if (priority === 'Emergency') return '#dc2626';
  if (priority === 'High') return '#f97316';
  if (priority === 'Medium') return '#eab308';

  return '#22c55e';
}

export default function ComplaintMap() {
  const [complaints, setComplaints] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadComplaints() {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        id,
        full_name,
        category,
        priority,
        status,
        description,
        ward_number,
        address,
        latitude,
        longitude,
        created_at
      `)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (error) {
      console.error('Map complaints error:', error);
      return;
    }

    setComplaints(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadComplaints();

    const channel = supabase
      .channel('complaint-map-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'complaints'
        },
        () => {
          loadComplaints();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function detectMyLocation() {
    if (!navigator.geolocation) {
      alert('GPS is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude
        ]);
      },
      () => {
        alert(
          'Location permission was denied. Please allow location access.'
        );
      }
    );
  }

  return (
    <div className="space-y-3">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">
            Live Complaint Map
          </h2>

          <p className="text-sm text-slate-500">
            Complaint locations from Supabase
          </p>
        </div>

        <button
          onClick={detectMyLocation}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-sm"
        >
          📍 Use My GPS
        </button>
      </div>

      <div className="h-[500px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">

        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={true}
          style={{
            height: '100%',
            width: '100%'
          }}
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationController location={userLocation} />

          {complaints.map(complaint => {

            const latitude = Number(complaint.latitude);
            const longitude = Number(complaint.longitude);

            if (
              Number.isNaN(latitude) ||
              Number.isNaN(longitude)
            ) {
              return null;
            }

            return (
              <React.Fragment key={complaint.id}>

                <Marker
                  position={[latitude, longitude]}
                  icon={markerIcon}
                >
                  <Popup>

                    <div className="space-y-2">

                      <strong>
                        {complaint.category}
                      </strong>

                      <div>
                        <b>Priority:</b>{' '}
                        {complaint.priority}
                      </div>

                      <div>
                        <b>Status:</b>{' '}
                        {complaint.status}
                      </div>

                      <div>
                        <b>Ward:</b>{' '}
                        {complaint.ward_number}
                      </div>

                      <div>
                        <b>Address:</b>{' '}
                        {complaint.address}
                      </div>

                      <div>
                        <b>Description:</b>{' '}
                        {complaint.description}
                      </div>

                    </div>

                  </Popup>
                </Marker>

                <Circle
                  center={[latitude, longitude]}
                  radius={120}
                  pathOptions={{
                    color: riskColor(complaint.priority),
                    fillColor: riskColor(complaint.priority),
                    fillOpacity: 0.15
                  }}
                />

              </React.Fragment>
            );
          })}

          {userLocation && (
            <>
              <Circle
                center={userLocation}
                radius={250}
                pathOptions={{
                  color: '#2563eb',
                  fillColor: '#2563eb',
                  fillOpacity: 0.15
                }}
              />

              <Marker
                position={userLocation}
                icon={markerIcon}
              >
                <Popup>
                  <b>Your current GPS location</b>
                </Popup>
              </Marker>
            </>
          )}

        </MapContainer>

      </div>

      {loading && (
        <p className="text-sm text-slate-500">
          Loading complaint locations...
        </p>
      )}

      <div className="flex flex-wrap gap-4 text-xs font-semibold">

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600" />
          Emergency
        </span>

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500" />
          High
        </span>

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          Medium
        </span>

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          Low
        </span>

      </div>

    </div>
  );
}