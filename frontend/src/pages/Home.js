import React, { useState } from "react";
import {
   Container,
   Paper,
   TextField,
   Button,
   Typography,
   Grid,
   Card,
   CardContent,
   Box,
   CircularProgress,
   Alert,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import axios from "axios";

// Weather icons
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import GrainIcon from "@mui/icons-material/Grain";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";

function getWeatherIcon(description = "") {
   const desc = description.toLowerCase();
   if (desc.includes("clear") || desc.includes("sunny"))
      return <WbSunnyIcon fontSize="large" />;
   if (desc.includes("cloud")) return <CloudIcon fontSize="large" />;
   if (desc.includes("rain")) return <GrainIcon fontSize="large" />;
   if (desc.includes("snow")) return <AcUnitIcon fontSize="large" />;
   return <ThunderstormIcon fontSize="large" />;
}

function Home() {
   const [location, setLocation] = useState("");
   const [weather, setWeather] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const validateLocation = (loc) => {
      const trimmedLoc = loc.trim();

      // Check if input is all digits (potential postal code)
      if (/^\d+$/.test(trimmedLoc)) {
         // Check if it's a valid US ZIP code (5 digits)
         if (trimmedLoc.length === 5) return true;
         // Check if it's a valid Indian PIN code (6 digits)
         if (trimmedLoc.length === 6) return true;
         // If it's not 5 or 6 digits
         setError(
            "Please enter a valid US ZIP code (5 digits) or Indian PIN code (6 digits)"
         );
         return false;
      }

      // Check if it's a city name (at least 2 characters, no numbers)
      if (trimmedLoc.length >= 2 && !/^\d+$/.test(trimmedLoc)) return true;

      // If none of the above conditions are met
      setError(
         "Please enter a valid city name (at least 2 characters) or postal code (5 digits for US, 6 digits for India)"
      );
      return false;
   };

   const handleSearch = async () => {
      const trimmedLocation = location.trim();

      if (!trimmedLocation) {
         setError("Please enter a location");
         return;
      }

      if (!validateLocation(trimmedLocation)) {
         return; // Error is already set in validateLocation
      }

      setLoading(true);
      setError("");
      try {
         const response = await axios.get(
            `http://localhost:8000/api/weather/${encodeURIComponent(
               trimmedLocation
            )}`
         );

         if (response.data && response.data.location) {
            setWeather(response.data);
            setError("");
         } else {
            setError("No weather data found for this location");
            setWeather(null);
         }
      } catch (err) {
         let errorMessage = "Failed to fetch weather data. Please try again.";
         if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
         } else if (err.response?.status === 404) {
            errorMessage = "Location not found. Please check your input.";
         } else if (err.response?.status === 400) {
            errorMessage = "Invalid location format. Please check your input.";
         }
         setError(errorMessage);
         setWeather(null);
      }
      setLoading(false);
   };

   const handleKeyPress = (e) => {
      if (e.key === "Enter") {
         handleSearch();
      }
   };

   const formatDate = (dateString) => {
      try {
         return format(parseISO(dateString), "E, MMM d");
      } catch {
         return dateString;
      }
   };

   return (
      <Container maxWidth="md">
         <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
               Weather Information
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
               <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                     <TextField
                        fullWidth
                        label="Enter location (city name, US ZIP, or Indian PIN code)"
                        value={location}
                        onChange={(e) => {
                           setLocation(e.target.value);
                           setError("");
                        }}
                        onKeyPress={handleKeyPress}
                        error={!!error}
                        helperText={error}
                        placeholder="e.g., New York, 10001, or 110001"
                     />
                  </Grid>
                  <Grid item>
                     <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={loading || !location.trim()}
                        sx={{ height: "56px" }}
                     >
                        {loading ? <CircularProgress size={24} /> : "Search"}
                     </Button>
                  </Grid>
               </Grid>
            </Paper>

            {weather && weather.location && (
               <>
                  <Card sx={{ mb: 3 }}>
                     <CardContent>
                        <Grid container spacing={2}>
                           <Grid item xs={12}>
                              <Typography variant="h5" gutterBottom>
                                 Current Weather in {weather.location.name}
                              </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Box display="flex" alignItems="center" mb={2}>
                                 {getWeatherIcon(weather.current.description)}
                                 <Typography
                                    variant="h3"
                                    component="span"
                                    sx={{ ml: 2 }}
                                 >
                                    {Math.round(weather.current.temperature)}°C
                                 </Typography>
                              </Box>
                              <Typography variant="body1">
                                 {weather.current.description}
                              </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Typography variant="body1">
                                 Humidity: {weather.current.humidity}%
                              </Typography>
                              <Typography variant="body1">
                                 Wind Speed: {weather.current.wind_speed} km/h
                              </Typography>
                           </Grid>
                        </Grid>
                     </CardContent>
                  </Card>

                  {weather.forecast && weather.forecast.length > 0 && (
                     <Box>
                        <Typography variant="h6" gutterBottom>
                           5-Day Forecast
                        </Typography>
                        <Grid container spacing={2}>
                           {weather.forecast.map((day, index) => (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                 <Card>
                                    <CardContent>
                                       <Typography
                                          variant="subtitle1"
                                          gutterBottom
                                       >
                                          {formatDate(day.date_time)}
                                       </Typography>
                                       <Box display="flex" alignItems="center">
                                          {getWeatherIcon(day.description)}
                                          <Typography
                                             variant="h6"
                                             sx={{ ml: 1 }}
                                          >
                                             {Math.round(day.temperature)}°C
                                          </Typography>
                                       </Box>
                                       <Typography variant="body2">
                                          {day.description}
                                       </Typography>
                                    </CardContent>
                                 </Card>
                              </Grid>
                           ))}
                        </Grid>
                     </Box>
                  )}
               </>
            )}
         </Box>
      </Container>
   );
}

export default Home;
