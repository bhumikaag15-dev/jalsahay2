import React from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

function getRiskColor(level) {
  switch (level) {
    case 'Critical':
      return '#dc2626';

    case 'High':
      return '#f97316';

    case 'Medium':
      return '#eab308';

    default:
      return '#22c55e';
  }
}

export default function ServiceRiskMap({ zones }) {
  if (!zones || zones.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No service risk data available.
      </div>
    );
  }

  const center = [
    zones[0].latitude,
    zones[0].longitude
  ];

  return (
    <div className="space-y-4">

      <div>
        <h2 className="text-xl font-bold">
          Water Service Risk Map
        </h2>

        <p className="text-sm text-slate-500">
          Weather + complaint activity based risk analysis
        </p>
      </div>

      <div className="h-[500px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">

        <MapContainer
          center={center}
          zoom={11}
          scrollWheelZoom={true}
          style={{
            width: '100%',
            height: '100%'
          }}
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {zones.map(zone => {

            const color = getRiskColor(
              zone.riskLevel
            );

            return (
              <Circle
                key={zone.id}
                center={[
                  zone.latitude,
                  zone.longitude
                ]}
                radius={
                  1800 +
                  zone.score * 25
                }
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.35,
                  weight: 2
                }}
              >

                <Popup>

                  <div className="min-w-[220px] space-y-2">

                    <h3 className="font-bold text-lg">
                      {zone.name}
                    </h3>

                    <div
                      style={{
                        color
                      }}
                      className="font-bold"
                    >
                      {zone.riskLevel} Risk
                    </div>

                    <div>
                      <b>Risk Score:</b>{' '}
                      {zone.score}/100
                    </div>

                    <hr />

                    <div>
                      <b>Nearby complaints:</b>{' '}
                      {zone.complaints}
                    </div>

                    <div>
                      <b>Open complaints:</b>{' '}
                      {zone.openComplaints}
                    </div>

                    <div>
                      <b>High priority:</b>{' '}
                      {zone.highPriorityComplaints}
                    </div>

                    <hr />

                    <div>
                      <b>Temperature:</b>{' '}
                      {zone.weather.temperature}°C
                    </div>

                    <div>
                      <b>Humidity:</b>{' '}
                      {zone.weather.humidity}%
                    </div>

                    <div>
                      <b>7-day rainfall:</b>{' '}
                      {zone.weather.totalRain} mm
                    </div>

                    <div>
                      <b>Rain probability:</b>{' '}
                      {zone.weather.maxRainProbability}%
                    </div>

                    <div>
                      <b>Maximum wind:</b>{' '}
                      {zone.weather.maxWind} km/h
                    </div>

                    <div>
                      <b>Maximum temperature:</b>{' '}
                      {zone.weather.maxTemperature}°C
                    </div>

                  </div>

                </Popup>

              </Circle>
            );
          })}

        </MapContainer>

      </div>

      <div className="flex flex-wrap gap-4 text-xs font-semibold">

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600" />
          Critical
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