import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import backgroundImage from "./clear-sky.jpg";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("Delhi");
  const [dateTime, setDateTime] = useState(new Date());

  const API_KEY = "f4b094f39e90ddd02beac79e26fb45c9"; // Replace with your API Key
  const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  // Fetch Current Weather

  useEffect(() => {
    axios
      .get(WEATHER_URL)
      .then((response) => setWeather(response.data))
      .catch((error) => console.error("Error fetching weather data:", error));
  }, [city]);

  // Fetch 5-Day Forecast
  function formatDate(timestamp) {
    const forecastDate = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (forecastDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (forecastDate.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return forecastDate.toLocaleDateString("en-US", { weekday: "long" });
    }
  }
  // Replace with your OpenWeather API Key

  const fetchWeatherData = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
      } else {
        console.error("Error fetching weather:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const [searchTerm, setSearchTerm] = useState(""); // Holds typed input

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      setCity(searchTerm); // Use existing setCity function
      setSearchTerm(""); // Clear input
    }
  };

  function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  useEffect(() => {
    axios
      .get(FORECAST_URL)
      .then((response) => {
        const filteredData = response.data.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );
        setForecast(filteredData);
      })
      .catch((error) => console.error("Error fetching forecast data:", error));
  }, [city]);

  // Update time dynamically
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [searchQuery, setSearchQuery] = useState(""); // Holds typed value
  const [searchedCity, setSearchedCity] = useState("New York"); // Holds searched city

  const handleSearch = (event) => {
    if (event.key === "Enter" && searchQuery.trim() !== "") {
      setSearchedCity(searchQuery); // Update only when Enter is pressed
      fetchWeatherData(searchQuery);
    }
  };

  return (
    <div
      className="weather-app-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="weather-info">
        <div className="input1">
          <input
            type="text"
            className="search-bar"
            placeholder="Enter city name..."
            value={searchTerm} // Controlled input
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit} // Listen for Enter key
          />
        </div>

        {weather && (
          <div className="weather-detail">
            <h3>Weather Detail</h3>
            <ul>
              <div className="cont">
                <li className="one">Max Temperature </li>
                <li className="two">{weather.main.temp_max}°C</li>
              </div>
              <div className="cont">
                <li className="one">Min Temperature </li>
                <li className="two">{weather.main.temp_min}°C</li>
              </div>
              <div className="cont">
                <li className="one">Humidity </li>
                <li className="two">{weather.main.humidity}%</li>
              </div>
              <div className="cont">
                <li className="one">Wind </li>
                <li className="two">{weather.wind.speed}%</li>
              </div>
            </ul>
          </div>
        )}

        <hr className="line" />

        <div className="weather-forecast">
          <h3>Weather Forecast</h3>
          <ul>
            {forecast.map((item, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                {/* Left Section: Date, Time & Condition */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt={item.weather[0].description}
                      style={{ marginRight: "10px" }}
                    />
                    {formatDate(item.dt)} at {formatTime(item.dt)}
                  </div>
                  <span
                    style={{
                      marginTop: "5px",
                      color: "#f0f0f0",
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.weather[0].description}
                  </span>
                </div>

                {/* Right Section: Temperature */}
                <span
                  style={{
                    marginLeft: "20px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                  }}
                >
                  {item.main.temp}°C
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="main-info">
        <h1 className="temperature">
          {weather ? `${weather.main.temp}°C` : "Loading..."}
        </h1>
        <h2 className="location-date-container">
          <h2 className="location">{city}</h2>
          <p className="date-time">
            {dateTime.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            -
            {dateTime
              .toLocaleDateString("en-GB", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "2-digit",
              })
              .replace(",", "")}
          </p>
        </h2>

        <p className="condition">
          {weather ? weather.weather[0].description : "..."}
        </p>
      </footer>
    </div>
  );
};

export default Weather;
