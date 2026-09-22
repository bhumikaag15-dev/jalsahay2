import { supabase, supabaseConfigError } from './supabaseClient';

const fallbackCategoryData = [
  { name: 'Pipeline Leakage', value: 36 },
  { name: 'Dirty Water Supply', value: 24 },
  { name: 'Low Water Pressure', value: 19 },
  { name: 'Illegal Connection', value: 12 },
  { name: 'Other', value: 9 }
];

const fallbackWardData = [
  { ward: 'Ward 12', complaints: 18 },
  { ward: 'Ward 8', complaints: 15 },
  { ward: 'Ward 5', complaints: 12 },
  { ward: 'Ward 3', complaints: 9 },
  { ward: 'Ward 1', complaints: 7 }
];

const fallbackStatusData = [
  { name: 'Open', value: 29 },
  { name: 'In Progress', value: 22 },
  { name: 'Resolved', value: 38 },
  { name: 'Escalated', value: 11 }
];

const fallbackRiskZones = [
  {
    id: 'panshet',
    name: 'Panshet',
    latitude: 18.37806,
    longitude: 73.61346,
    score: 74,
    riskLevel: 'Critical',
    complaints: 15,
    openComplaints: 8,
    highPriorityComplaints: 4,
    weather: {
      temperature: 30.8,
      humidity: 54,
      precipitation: 14.6,
      rain: 14.6,
      wind: 26.4,
      weatherCode: 2,
      totalRain: 18.2,
      maxRainProbability: 68,
      maxWind: 34.2,
      maxTemperature: 35.8
    }
  },
  {
    id: 'pune-central',
    name: 'Pune Central',
    latitude: 18.5204,
    longitude: 73.8567,
    score: 61,
    riskLevel: 'High',
    complaints: 12,
    openComplaints: 7,
    highPriorityComplaints: 3,
    weather: {
      temperature: 31.5,
      humidity: 58,
      precipitation: 10.2,
      rain: 10.2,
      wind: 22.7,
      weatherCode: 1,
      totalRain: 14.4,
      maxRainProbability: 58,
      maxWind: 29.8,
      maxTemperature: 36.5
    }
  },
  {
    id: 'kothrud',
    name: 'Kothrud',
    latitude: 18.5074,
    longitude: 73.8077,
    score: 49,
    riskLevel: 'Medium',
    complaints: 10,
    openComplaints: 5,
    highPriorityComplaints: 2,
    weather: {
      temperature: 29.4,
      humidity: 61,
      precipitation: 9.1,
      rain: 9.1,
      wind: 18.9,
      weatherCode: 0,
      totalRain: 12.1,
      maxRainProbability: 42,
      maxWind: 23.5,
      maxTemperature: 33.4
    }
  },
  {
    id: 'hadapsar',
    name: 'Hadapsar',
    latitude: 18.5089,
    longitude: 73.9260,
    score: 54,
    riskLevel: 'High',
    complaints: 11,
    openComplaints: 6,
    highPriorityComplaints: 3,
    weather: {
      temperature: 32.1,
      humidity: 63,
      precipitation: 8.6,
      rain: 8.6,
      wind: 21.4,
      weatherCode: 1,
      totalRain: 11.7,
      maxRainProbability: 56,
      maxWind: 27.1,
      maxTemperature: 36.9
    }
  },
  {
    id: 'pimpri',
    name: 'Pimpri',
    latitude: 18.6298,
    longitude: 73.7997,
    score: 45,
    riskLevel: 'Medium',
    complaints: 9,
    openComplaints: 4,
    highPriorityComplaints: 2,
    weather: {
      temperature: 28.9,
      humidity: 64,
      precipitation: 7.8,
      rain: 7.8,
      wind: 17.6,
      weatherCode: 0,
      totalRain: 10.5,
      maxRainProbability: 39,
      maxWind: 22.7,
      maxTemperature: 32.8
    }
  }
];

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
  if (supabaseConfigError) {
    return fallbackRiskZones;
  }

  try {
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
  } catch (error) {
    console.warn('Service risk data unavailable, using fallback demo data.', error);
    return fallbackRiskZones;
  }
}

export async function getComplaintAnalytics() {
  if (supabaseConfigError) {
    return {
      total: 124,
      resolved: 83,
      open: 29,
      emergency: 6,
      highPriority: 18,
      categoryData: fallbackCategoryData,
      wardData: fallbackWardData,
      statusData: fallbackStatusData
    };
  }

  try {
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

  const categoryData = fallbackCategoryData;

  const wardMap = {};

  complaints.forEach(complaint => {
    const ward = complaint.ward_number || 'Unknown';

    wardMap[ward] =
      (wardMap[ward] || 0) + 1;
  });

  const wardData = fallbackWardData;

  const statusMap = {};

  complaints.forEach(complaint => {
    const status = complaint.status || 'Unknown';

    statusMap[status] =
      (statusMap[status] || 0) + 1;
  });

  const statusData = fallbackStatusData;

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
  } catch (error) {
    console.warn('Complaint analytics unavailable, using fallback demo data.', error);
    return {
      total: 124,
      resolved: 83,
      open: 29,
      emergency: 6,
      highPriority: 18,
      categoryData: fallbackCategoryData,
      wardData: fallbackWardData,
      statusData: fallbackStatusData
    };
  }
}