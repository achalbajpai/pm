import React, { useState, useEffect } from "react";
import {
   Container,
   Typography,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   IconButton,
   Button,
   Box,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   MenuItem,
   Select,
   FormControl,
   InputLabel,
   Card,
   CardContent,
   Grid,
   Link,
   Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GetAppIcon from "@mui/icons-material/GetApp";
import InfoIcon from "@mui/icons-material/Info";
import { format } from "date-fns";
import axios from "axios";

function WeatherHistory() {
   const [locations, setLocations] = useState([]);
   const [selectedLocation, setSelectedLocation] = useState("");
   const [weatherRecords, setWeatherRecords] = useState([]);
   const [exportFormat, setExportFormat] = useState("json");
   const [exportDialogOpen, setExportDialogOpen] = useState(false);
   const [locationDetails, setLocationDetails] = useState(null);
   const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

   useEffect(() => {
      fetchLocations();
   }, []);

   useEffect(() => {
      if (selectedLocation) {
         fetchWeatherHistory(selectedLocation);
         fetchLocationDetails(selectedLocation);
      }
   }, [selectedLocation]);

   const fetchLocations = async () => {
      try {
         const response = await axios.get(
            "http://localhost:8000/api/locations"
         );
         setLocations(response.data);
         if (response.data.length > 0) {
            setSelectedLocation(response.data[0].id);
         }
      } catch (error) {
         console.error("Failed to fetch locations:", error);
      }
   };

   const fetchWeatherHistory = async (locationId) => {
      try {
         const response = await axios.get(
            `http://localhost:8000/api/weather/history/${locationId}`
         );
         setWeatherRecords(response.data);
      } catch (error) {
         console.error("Failed to fetch weather history:", error);
      }
   };

   const fetchLocationDetails = async (locationId) => {
      try {
         const response = await axios.get(
            `http://localhost:8000/api/locations/details/${locationId}`
         );
         setLocationDetails(response.data);
      } catch (error) {
         console.error("Failed to fetch location details:", error);
      }
   };

   const handleDelete = async (recordId) => {
      try {
         await axios.delete(
            `http://localhost:8000/api/weather/record/${recordId}`
         );
         setWeatherRecords((records) =>
            records.filter((record) => record.id !== recordId)
         );
      } catch (error) {
         console.error("Failed to delete record:", error);
      }
   };

   const handleExport = async () => {
      try {
         const response = await axios.post(
            `http://localhost:8000/api/exports/weather/${selectedLocation}`,
            { format: exportFormat },
            { responseType: "blob" }
         );

         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", `weather_data.${exportFormat}`);
         document.body.appendChild(link);
         link.click();
         link.remove();
         setExportDialogOpen(false);
      } catch (error) {
         console.error("Failed to export data:", error);
      }
   };

   return (
      <Container maxWidth="lg">
         <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
               Weather History
            </Typography>

            <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
               <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Location</InputLabel>
                  <Select
                     value={selectedLocation}
                     onChange={(e) => setSelectedLocation(e.target.value)}
                     label="Location"
                  >
                     {locations.map((location) => (
                        <MenuItem key={location.id} value={location.id}>
                           {location.name}, {location.country}
                        </MenuItem>
                     ))}
                  </Select>
               </FormControl>

               <Button
                  variant="contained"
                  startIcon={<GetAppIcon />}
                  onClick={() => setExportDialogOpen(true)}
                  disabled={!selectedLocation}
               >
                  Export Data
               </Button>

               <Button
                  variant="outlined"
                  startIcon={<InfoIcon />}
                  onClick={() => setDetailsDialogOpen(true)}
                  disabled={!selectedLocation}
               >
                  Location Details
               </Button>
            </Box>

            <TableContainer component={Paper}>
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell>Date/Time</TableCell>
                        <TableCell>Temperature</TableCell>
                        <TableCell>Humidity</TableCell>
                        <TableCell>Pressure</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Wind Speed</TableCell>
                        <TableCell>Actions</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {weatherRecords.map((record) => (
                        <TableRow key={record.id}>
                           <TableCell>
                              {format(new Date(record.date_time), "PPpp")}
                           </TableCell>
                           <TableCell>
                              {Math.round(record.temperature)}°C
                           </TableCell>
                           <TableCell>{record.humidity}%</TableCell>
                           <TableCell>{record.pressure} hPa</TableCell>
                           <TableCell>{record.description}</TableCell>
                           <TableCell>{record.wind_speed} m/s</TableCell>
                           <TableCell>
                              <IconButton
                                 color="error"
                                 onClick={() => handleDelete(record.id)}
                              >
                                 <DeleteIcon />
                              </IconButton>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </TableContainer>

            <Dialog
               open={exportDialogOpen}
               onClose={() => setExportDialogOpen(false)}
            >
               <DialogTitle>Export Weather Data</DialogTitle>
               <DialogContent>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                     <InputLabel>Export Format</InputLabel>
                     <Select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        label="Export Format"
                     >
                        <MenuItem value="json">JSON</MenuItem>
                        <MenuItem value="csv">CSV</MenuItem>
                        <MenuItem value="pdf">PDF</MenuItem>
                        <MenuItem value="markdown">Markdown</MenuItem>
                        <MenuItem value="xml">XML</MenuItem>
                     </Select>
                  </FormControl>
               </DialogContent>
               <DialogActions>
                  <Button onClick={() => setExportDialogOpen(false)}>
                     Cancel
                  </Button>
                  <Button onClick={handleExport} variant="contained">
                     Export
                  </Button>
               </DialogActions>
            </Dialog>

            <Dialog
               open={detailsDialogOpen}
               onClose={() => setDetailsDialogOpen(false)}
               maxWidth="md"
               fullWidth
            >
               <DialogTitle>Location Details</DialogTitle>
               <DialogContent>
                  {locationDetails && (
                     <Grid container spacing={3}>
                        <Grid item xs={12}>
                           <Typography variant="h6" gutterBottom>
                              {locationDetails.formatted_address}
                           </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                           <Card>
                              <CardContent>
                                 <Typography variant="subtitle1" gutterBottom>
                                    Timezone Information
                                 </Typography>
                                 <Typography>
                                    Name: {locationDetails.timezone.name}
                                 </Typography>
                                 <Typography>
                                    Offset:{" "}
                                    {locationDetails.timezone.offset_string}
                                 </Typography>
                              </CardContent>
                           </Card>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                           <Card>
                              <CardContent>
                                 <Typography variant="subtitle1" gutterBottom>
                                    Nearby Places
                                 </Typography>
                                 <Box
                                    sx={{
                                       display: "flex",
                                       gap: 1,
                                       flexWrap: "wrap",
                                    }}
                                 >
                                    {locationDetails.nearby_places.map(
                                       (place, index) => (
                                          <Chip
                                             key={index}
                                             label={`${place.name} (${place.type})`}
                                             variant="outlined"
                                          />
                                       )
                                    )}
                                 </Box>
                              </CardContent>
                           </Card>
                        </Grid>

                        <Grid item xs={12}>
                           <Card>
                              <CardContent>
                                 <Typography variant="subtitle1" gutterBottom>
                                    Additional Information
                                 </Typography>
                                 <Typography>
                                    Currency: {locationDetails.currency.name} (
                                    {locationDetails.currency.symbol})
                                 </Typography>
                                 <Typography>
                                    What3Words: {locationDetails.what3words}
                                 </Typography>
                                 <Typography>
                                    View on OpenStreetMap:{" "}
                                    <Link
                                       href={locationDetails.map_url}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                    >
                                       Open Map
                                    </Link>
                                 </Typography>
                              </CardContent>
                           </Card>
                        </Grid>
                     </Grid>
                  )}
               </DialogContent>
               <DialogActions>
                  <Button onClick={() => setDetailsDialogOpen(false)}>
                     Close
                  </Button>
               </DialogActions>
            </Dialog>
         </Box>
      </Container>
   );
}

export default WeatherHistory;
