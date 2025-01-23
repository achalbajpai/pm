import React from "react";
import {
   Container,
   Typography,
   Paper,
   Box,
   Link,
   List,
   ListItem,
   ListItemIcon,
   ListItemText,
} from "@mui/material";
import {
   LocationOn,
   CloudQueue,
   Storage,
   ImportExport,
   Code,
} from "@mui/icons-material";

function About() {
   return (
      <Container maxWidth="md">
         <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
               About Weather App
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
               <Typography variant="h6" gutterBottom>
                  Features
               </Typography>
               <List>
                  <ListItem>
                     <ListItemIcon>
                        <LocationOn />
                     </ListItemIcon>
                     <ListItemText
                        primary="Location Search"
                        secondary="Search weather by city name, ZIP code, coordinates, or landmarks"
                     />
                  </ListItem>
                  <ListItem>
                     <ListItemIcon>
                        <CloudQueue />
                     </ListItemIcon>
                     <ListItemText
                        primary="Weather Information"
                        secondary="Current weather conditions and 5-day forecast"
                     />
                  </ListItem>
                  <ListItem>
                     <ListItemIcon>
                        <Storage />
                     </ListItemIcon>
                     <ListItemText
                        primary="Data Management"
                        secondary="Store and manage weather records with full CRUD functionality"
                     />
                  </ListItem>
                  <ListItem>
                     <ListItemIcon>
                        <ImportExport />
                     </ListItemIcon>
                     <ListItemText
                        primary="Data Export"
                        secondary="Export weather data in multiple formats (JSON, CSV, PDF, etc.)"
                     />
                  </ListItem>
               </List>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
               <Typography variant="h6" gutterBottom>
                  Technologies Used
               </Typography>
               <List>
                  <ListItem>
                     <ListItemIcon>
                        <Code />
                     </ListItemIcon>
                     <ListItemText
                        primary="Frontend"
                        secondary="React, Material-UI, Axios"
                     />
                  </ListItem>
                  <ListItem>
                     <ListItemIcon>
                        <Code />
                     </ListItemIcon>
                     <ListItemText
                        primary="Backend"
                        secondary="Python FastAPI, SQLAlchemy, SQLite"
                     />
                  </ListItem>
                  <ListItem>
                     <ListItemIcon>
                        <Code />
                     </ListItemIcon>
                     <ListItemText
                        primary="APIs"
                        secondary="OpenWeatherMap, Google Maps"
                     />
                  </ListItem>
               </List>
            </Paper>

            <Paper sx={{ p: 3 }}>
               <Typography variant="h6" gutterBottom>
                  Created By
               </Typography>
               <Typography paragraph>
                  This weather application was created as part of the PM
                  Accelerator technical assessment.
               </Typography>
               <Typography>
                  Learn more about PM Accelerator on{" "}
                  <Link
                     href="https://www.linkedin.com/company/product-manager-accelerator"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     LinkedIn
                  </Link>
                  .
               </Typography>
            </Paper>
         </Box>
      </Container>
   );
}

export default About;
