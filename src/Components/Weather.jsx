import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear from "../assets/clear.png";
import cloud from "../assets/clouds.png";
import humidity from "../assets/humidity.png";
import rain from "../assets/rain.png";
import snow from "../assets/snow.png";
import wind from "../assets/wind.png";
import drizzle from "../assets/drizzle.png";

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  const search = async (searchCity) => {
    if (!searchCity.trim()) {
      setError("Please enter a city name");
      setWeatherData(null);
      return;
    }
    setLoading(true);
    try {
      setError(null);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      const icon = allIcons[data.weather[0]?.icon] || clear;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        location: data.name,
        temperature: Math.floor(data.main.temp),
        icon: icon,
      });
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search("New York"); 
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search(city)}
        />
        <img
          src={search_icon}
          alt="search_icon"
          onClick={() => search(inputRef.current.value)}
          style={{ cursor: "pointer" }}
        />
      </div>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}
      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="weather-icon" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity} alt="humidity" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind} alt="wind" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Weather;
