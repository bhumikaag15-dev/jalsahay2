const PANSHET = {
  name: 'Panshet, Pune, Maharashtra',
  latitude: 18.37806,
  longitude: 73.61346
};

export async function getWeather() {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${PANSHET.latitude}` +
    `&longitude=${PANSHET.longitude}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m` +
    `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,precipitation_probability_max,wind_speed_10m_max` +
    `&forecast_days=7` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Weather API request failed');
  }

  const data = await response.json();

  return {
    ...data,
    location: PANSHET
  };
}