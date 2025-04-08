import { Weather } from "../../types";
import axios from "axios";

export const Resolver = async (
  _: any,
  {
    location,
    latitude,
    longitude,
  }: { location?: string; latitude?: number; longitude?: number }
) => {
  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    if (!apiKey) {
      throw new Error("OpenWeatherMap API key is not configured");
    }
    let url = "";
    if (latitude !== 0 && longitude !== 0) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    } else if (location) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    } else {
      throw new Error(
        "Either location or latitude and longitude must be provided"
      );
    }

    // Make API request to OpenWeatherMap
    const response = await axios.get(url);

    const data = response.data;

    // Transform the API response to match our GraphQL schema
    const weather: Weather = {
      location: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      conditions: data.weather.map((condition: any) => ({
        main: condition.main,
        description: condition.description,
        icon: condition.icon,
      })),
      timestamp: new Date(data.dt * 1000).toISOString(),
    };

    return weather;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error(
        `Location not found: ${
          location || `lat: ${latitude}, lon: ${longitude}`
        }`
      );
    }
    throw error;
  }
};
