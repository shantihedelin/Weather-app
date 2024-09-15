import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather, fetchForecast } from "./redux/weatherSlice";
import {
  selectCurrentWeather,
  selectForecast,
  selectLoading,
} from "./redux/weatherSlice";
import "./App.css";
import { FaSearch } from "react-icons/fa";

function App() {
  const [city, setCity] = useState("");
  const [filterType, setFilterType] = useState("no filter");
  const [filterValue, setFilterValue] = useState(0);
  const dispatch = useDispatch();
  const currentWeather = useSelector(selectCurrentWeather);
  const forecast = useSelector(selectForecast);
  const loading = useSelector(selectLoading);
  const [showCity, setShowCity] = useState(false);
  const [showCurrentWeather, setShowCurrentWeather] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleSearch = () => {
    dispatch(fetchWeather(city));
    dispatch(fetchForecast(city));

    setShowCity(false);
    setShowCurrentWeather(false);
    setShowForecast(false);

    setTimeout(() => setShowCity(true), 500);
    setTimeout(() => setShowCurrentWeather(true), 1000);
    setTimeout(() => setShowForecast(true), 1500);
  };

  const filteredForecast =
    forecast && forecast.list
      ? forecast.list.filter((item) => {
          if (filterType === "temperature") {
            return item.main.temp > filterValue;
          } else if (filterType === "wind") {
            return item.wind.speed > filterValue;
          }
          return true; // om inget filter är valt visas allt
        })
      : [];

  return (
    <>
      <div className="background"></div>
      <div className="overlay"></div>
      <main className="flex min-h-screen flex-col w-screen">
        <nav className="flex bg-[#252b55] h-8 text-[#f0f8ff] p-3 items-center text-lg">
          Chas Weather
        </nav>
        <div className="flex pt-8 justify-center">
          <div className="text-[#252b55] flex flex-col items-center w-screen">
            <h1>Weather News</h1>
            <h2>Search city:</h2>
            <div className="flex items-center">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search city..."
                className="h-8 w-56 bg-white"
              ></input>
              <button onClick={handleSearch} className="h-10 w-12">
                <FaSearch />
              </button>
            </div>

            {/* {loading && <p>Loading weather data...</p>} */}

            <div className="flex flex-col items-center">
              {currentWeather && (
                <div>
                  <div className={`fade-in ${showCity ? "show" : ""}`}>
                    <h1>{currentWeather.name}</h1>
                  </div>
                </div>
              )}

              {currentWeather && (
                <div className={`fade-in ${showCurrentWeather ? "show" : ""}`}>
                  <h3 className="text-2xl">Current weather</h3>
                  <p>Temperature: {currentWeather.main.temp}°C</p>
                  <p>Wind Speed: {currentWeather.wind.speed} m/s</p>
                </div>
              )}

              {forecast && forecast.list && (
                <div
                  className={`fade-in ${
                    showForecast ? "show" : ""
                  } pt-8 flex flex-col items-center`}
                >
                  <div className="flex flex-row justify-around w-screen items-center md:justify-center space-x-4">
                    <h2 className="text-3xl">Five day forecast</h2>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-sm flex font-semibold">Filter by:</h2>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="flex h-7"
                      >
                        <option value={"no filter"}>None</option>
                        <option value={"temperature"}>Temperature</option>
                        <option value={"wind"}>Wind</option>
                        <option value={"rainfall"}>Rain</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border-t-xl w-auto flex flex-cols mx-8 mb-12  lg:justify-around">
                    {filteredForecast.map((item, index) => {
                      const date = new Date(item.dt * 1000); // konvertera unix tiden till datum
                      const dayName = daysOfWeek[date.getDay()];
                      const formattedDate = date.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      });
                      let totalRain = 0;

                      forecast.list.forEach((forecastItem) => {
                        const forecastDate = new Date(forecastItem.dt * 1000);
                        const forecastDayName =
                          daysOfWeek[forecastDate.getDay()];

                        if (forecastDayName === dayName) {
                          // Om datumet matchar
                          totalRain += forecastItem.rain
                            ? forecastItem.rain["3h"] || 0
                            : 0; // Summera regn om det finns`
                        }
                      });

                      return (
                        <div key={index} className="flex">
                          {filterType === "no filter" && (
                            <div className="flex flex-col">
                              <div className="font-bold text-sm bg-sky-900 text-white pt-2 flex flex-col md:px-4  items-center w-24 sm:w-auto lg:w-auto ">
                                <p className="my-0">{dayName}</p>
                                <p className="my-1">{formattedDate}</p>
                              </div>
                              <div className="flex flex-col items-center px-3">
                                <p className="text-sm">
                                  Temp:{" "}
                                  <p className="m-0 font-semibold">
                                    {item.main.temp}°C
                                  </p>
                                </p>
                                <p className="text-sm">
                                  Wind:{" "}
                                  <p className="m-0 font-semibold">
                                    {item.wind.speed} m/s
                                  </p>
                                </p>
                                <p className="text-sm w-auto">
                                  {item.weather[0].description}
                                </p>
                              </div>
                            </div>
                          )}
                          {filterType === "temperature" && (
                            <div className="flex flex-col">
                              <div className="font-bold text-sm bg-sky-900 text-white pt-2 flex flex-col items-center w-24">
                                <p className="my-0">{dayName}</p>
                                <p className="my-1">{formattedDate}</p>
                              </div>
                              <div className="flex flex-col items-center px-3">
                                <p className="text-sm">
                                  Temp:{" "}
                                  <p className="m-0 font-semibold">
                                    {item.main.temp}°C
                                  </p>
                                </p>
                              </div>
                            </div>
                          )}
                          {filterType === "wind" && (
                            <div className="flex flex-col">
                              <div className="font-bold text-sm bg-sky-900 text-white pt-2 flex flex-col items-center w-24">
                                <p className="my-0">{dayName}</p>
                                <p className="my-1">{formattedDate}</p>
                              </div>
                              <div className="flex flex-col items-center px-3">
                                <p className="text-sm">
                                  Wind:{" "}
                                  <p className="m-0 font-semibold">
                                    {item.wind.speed} m/s
                                  </p>
                                </p>
                              </div>
                            </div>
                          )}
                          {filterType === "rainfall" && (
                            <div>
                              <div className="font-bold text-sm bg-sky-900 text-white pt-2 flex flex-col items-center w-24">
                                <p className="my-0">{dayName}</p>
                                <p className="my-1">{formattedDate}</p>
                              </div>
                              <div className="flex flex-col items-center px-3">
                                <p className="text-sm">
                                  Rainfall:
                                  <p className="m-0 font-semibold">
                                    {totalRain.toFixed(2)} mm
                                  </p>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
