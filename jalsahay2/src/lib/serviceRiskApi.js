import { supabase } from './supabaseClient';

export const SERVICE_ZONES = [
  {
    id: 'panshet',
    name: 'Panshet',
    latitude: 18.37806,
    longitude: 73.61346
  },
  {
    id: 'pune-central',
    name: 'Pune Central',
    latitude: 18.5204,
    longitude: 73.8567
  },
  {
    id: 'kothrud',
    name: 'Kothrud',
    latitude: 18.5074,
    longitude: 73.8077
  },
  {
    id: 'hadapsar',
    name: 'Hadapsar',
    latitude: 18.5089,
    longitude: 73.9260
  },
  {
    id: 'pimpri',
    name: 'Pimpri',
    latitude: 18.6298,
    longitude: 73.7997
  }
];

function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function getWeather(latitude, longitude) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max` +
    `&forecast_days=7` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Weather API request failed');
  }

  return response.json();
}

export async function getServiceRiskData() {
  const { data: complaints, error } = await supabase
    .from('complaints')
    .select(`
      id,
      category,
      priority,
      status,
      latitude,
      longitude,
      ward_number,
      created_at
    `);

  if (error) {
    throw new Error(error.message);
  }

  const validComplaints = (complaints || []).filter(
    complaint =>
      complaint.latitude !== null &&
      complaint.longitude !== null
  );

  const results = await Promise.all(
    SERVICE_ZONES.map(async zone => {
      const weather = await getWeather(
        zone.latitude,
        zone.longitude
      );

      const nearbyComplaints = validComplaints.filter(complaint => {
        const distance = distanceKm(
          zone.latitude,
          zone.longitude,
          Number(complaint.latitude),
          Number(complaint.longitude)
        );

        return distance <= 8;
      });

      const openComplaints = nearbyComplaints.filter(
        complaint =>
          !['Resolved', 'Closed'].includes(complaint.status)
      );

      const highPriorityComplaints = nearbyComplaints.filter(
        complaint =>
          ['High', 'Emergency'].includes(complaint.priority)
      );

      const totalRain = weather.daily.precipitation_sum.reduce(
        (sum, value) => sum + (Number(value) || 0),
        0
      );

      const maxRainProbability = Math.max(
        ...weather.daily.precipitation_probability_max.map(
          Number
        )
      );

      const maxWind = Math.max(
        ...weather.daily.wind_speed_10m_max.map(Number)
      );

      const maxTemperature = Math.max(
        ...weather.daily.temperature_2m_max.map(Number)
      );

      /*
       * Risk scoring model.
       *
       * This is a decision-support score, not a prediction
       * that an incident will definitely happen.
       */

      let score = 0;

      // Weather contribution
      if (totalRain >= 80) {
        score += 30;
      } else if (totalRain >= 40) {
        score += 20;
      } else if (totalRain >= 20) {
        score += 10;
      }

      if (maxRainProbability >= 80) {
        score += 20;
      } else if (maxRainProbability >= 60) {
        score += 12;
      } else if (maxRainProbability >= 40) {
        score += 6;
      }

      if (maxWind >= 45) {
        score += 15;
      } else if (maxWind >= 30) {
        score += 8;
      }

      // Complaint contribution
      score += Math.min(openComplaints.length * 3, 15);

      score += Math.min(highPriorityComplaints.length * 5, 20);

      // Hot + relatively dry conditions can increase supply stress
      if (maxTemperature >= 35 && totalRain < 20) {
        score += 15;
      } else if (maxTemperature >= 32 && totalRain < 30) {
        score += 8;
      }

      score = Math.min(score, 100);

      let riskLevel = 'Low';

      if (score >= 70) {
        riskLevel = 'Critical';
      } else if (score >= 50) {
        riskLevel = 'High';
      } else if (score >= 30) {
        riskLevel = 'Medium';
      }

      return {
        ...zone,
        score,
        riskLevel,
        complaints: nearbyComplaints.length,
        openComplaints: openComplaints.length,
        highPriorityComplaints: highPriorityComplaints.length,

        weather: {
          temperature: weather.current.temperature_2m,
          humidity: weather.current.relative_humidity_2m,
          precipitation: weather.current.precipitation,
          rain: weather.current.rain,
          wind: weather.current.wind_speed_10m,
          weatherCode: weather.current.weather_code,

          totalRain: Number(totalRain.toFixed(1)),
          maxRainProbability,
          maxWind: Number(maxWind.toFixed(1)),
          maxTemperature: Number(maxTemperature.toFixed(1))
        }
      };
    })
  );

  return results;
}

export async function getComplaintAnalytics() {
  const { data, error } = await supabase
    .from('complaints')
    .select(`
      id,
      category,
      priority,
      status,
      ward_number,
      created_at,
      estimated_completion,
      latitude,
      longitude
    `);

  if (error) {
    throw new Error(error.message);
  }

  const complaints = data || [];

  const total = complaints.length;

  const resolved = complaints.filter(complaint =>
    ['Resolved', 'Closed'].includes(complaint.status)
  ).length;

  const open = complaints.filter(complaint =>
    !['Resolved', 'Closed'].includes(complaint.status)
  ).length;

  const emergency = complaints.filter(complaint =>
    complaint.priority === 'Emergency'
  ).length;

  const highPriority = complaints.filter(complaint =>
    complaint.priority === 'High'
  ).length;

  const categoryMap = {};

  complaints.forEach(complaint => {
    const category = complaint.category || 'Other';

    categoryMap[category] =
      (categoryMap[category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({
      name,
      value
    }))
    .sort((a, b) => b.value - a.value);

  const wardMap = {};

  complaints.forEach(complaint => {
    const ward = complaint.ward_number || 'Unknown';

    wardMap[ward] =
      (wardMap[ward] || 0) + 1;
  });

  const wardData = Object.entries(wardMap)
    .map(([ward, complaints]) => ({
      ward: `Ward ${ward}`,
      complaints
    }))
    .sort((a, b) => b.complaints - a.complaints);

  const statusMap = {};

  complaints.forEach(complaint => {
    const status = complaint.status || 'Unknown';

    statusMap[status] =
      (statusMap[status] || 0) + 1;
  });

  const statusData = Object.entries(statusMap)
    .map(([name, value]) => ({
      name,
      value
    }));

  return {
    total,
    resolved,
    open,
    emergency,
    highPriority,
    categoryData,
    wardData,
    statusData
  };
}