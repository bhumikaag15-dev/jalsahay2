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

import { supabase, supabaseConfigError } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';

const defaultCenter = [18.5204, 73.8567];

const fallbackComplaints = [
  {
    id: 'fallback-1',
    full_name: 'Municipal Demo',
    category: 'Pipeline Leakage',
    priority: 'Emergency',
    status: 'Open',
    description: 'Severe pipe burst near the main distribution line.',
    ward_number: 12,
    address: 'Panshet Road, Pune',
    latitude: 18.37806,
    longitude: 73.61346,
    created_at: new Date().toISOString()
  },
  {
    id: 'fallback-2',
    full_name: 'Municipal Demo',
    category: 'Low Water Pressure',
    priority: 'High',
    status: 'In Progress',
    description: 'Low pressure reported in central service zone.',
    ward_number: 8,
    address: 'Market Yard, Pune',
    latitude: 18.5204,
    longitude: 73.8567,
    created_at: new Date().toISOString()
  },
  {
    id: 'fallback-3',
    full_name: 'Municipal Demo',
    category: 'Dirty Water Supply',
    priority: 'Medium',
    status: 'Open',
    description: 'Water discoloration reported in a residential cluster.',
    ward_number: 5,
    address: 'Kothrud, Pune',
    latitude: 18.5074,
    longitude: 73.8077,
    created_at: new Date().toISOString()
  }
];

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
  const { t } = useLanguage();

  async function loadComplaints() {
    if (supabaseConfigError) {
      setComplaints(fallbackComplaints);
      setLoading(false);
      return;
    }

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
      setComplaints(fallbackComplaints);
      setLoading(false);
      return;
    }

    setComplaints(data || fallbackComplaints);
    setLoading(false);
  }

  useEffect(() => {
    loadComplaints();

    if (supabaseConfigError) {
      return undefined;
    }

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
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  function detectMyLocation() {
    if (!navigator.geolocation) {
      alert(t.gpsNotSupported);
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
          t.locationPermissionMap
        );
      }
    );
  }

  return (
    <div className="space-y-3">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">
            {t.liveComplaintMap}
          </h2>

          <p className="text-sm text-slate-500">
            {t.complaintLocationsSupabase}
          </p>
        </div>

        <button
          onClick={detectMyLocation}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-sm"
        >
          📍 {t.useMyGps}
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
                        <b>{t.priority}:</b>{' '}
                        {complaint.priority}
                      </div>

                      <div>
                        <b>{t.status}:</b>{' '}
                        {complaint.status}
                      </div>

                      <div>
                        <b>{t.ward}:</b>{' '}
                        {complaint.ward_number}
                      </div>

                      <div>
                        <b>{t.address}:</b>{' '}
                        {complaint.address}
                      </div>

                      <div>
                        <b>{t.description}:</b>{' '}
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
                  <b>{t.yourLocation}</b>
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