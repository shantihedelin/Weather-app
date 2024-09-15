import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = "25faf9bd781b596979946a62b18d503d";

// Hämta aktuellt väder
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (city) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    return response.data;
    
  }
);

// Hämta 5-dagars prognos
export const fetchForecast = createAsyncThunk(
  "weather/fetchForecast",
  async (city) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const filteredData = response.data.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );
    return { ...response.data, list: filteredData };
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    current: null,
    forecast: null,
    loading: false,
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.forecast = action.payload;
        state.loading = false;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const selectCurrentWeather = (state) => state.weather.current;
export const selectForecast = (state) => state.weather.forecast;
export const selectLoading = (state) => state.weather.loading;

export default weatherSlice.reducer;
