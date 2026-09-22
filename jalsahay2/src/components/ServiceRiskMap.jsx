import React from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
  if (!zones || zones.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        {t.noServiceRiskData}
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
          {t.waterServiceRiskMap}
        </h2>

        <p className="text-sm text-slate-500">
          {t.weatherComplaintRisk}
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
                      {zone.riskLevel} {t.risk}
                    </div>

                    <div>
                      <b>{t.riskScore}:</b>{' '}
                      {zone.score}/100
                    </div>

                    <hr />

                    <div>
                      <b>{t.nearbyComplaints}:</b>{' '}
                      {zone.complaints}
                    </div>

                    <div>
                      <b>{t.openComplaints}:</b>{' '}
                      {zone.openComplaints}
                    </div>

                    <div>
                      <b>{t.highPriorityLabel}:</b>{' '}
                      {zone.highPriorityComplaints}
                    </div>

                    <hr />

                    <div>
                      <b>{t.temperature}:</b>{' '}
                      {zone.weather.temperature}°C
                    </div>

                    <div>
                      <b>{t.humidity}:</b>{' '}
                      {zone.weather.humidity}%
                    </div>

                    <div>
                      <b>{t.sevenDayRainfall}:</b>{' '}
                      {zone.weather.totalRain} mm
                    </div>

                    <div>
                      <b>{t.rainProbability}:</b>{' '}
                      {zone.weather.maxRainProbability}%
                    </div>

                    <div>
                      <b>{t.maximumWind}:</b>{' '}
                      {zone.weather.maxWind} km/h
                    </div>

                    <div>
                      <b>{t.maximumTemperature}:</b>{' '}
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
          {t.critical}
        </span>

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500" />
          {t.high}
        </span>

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          {t.medium}
        </span>

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          {t.low}
        </span>

      </div>

    </div>
  );
}