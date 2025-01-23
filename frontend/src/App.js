import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

// Components
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

// Create theme
const theme = createTheme({
   palette: {
      mode: "light",
      primary: {
         main: "#1976d2",
      },
      background: {
         default: "#f5f5f5",
      },
   },
});

function App() {
   return (
      <ThemeProvider theme={theme}>
         <CssBaseline />
         <Router>
            <Box
               sx={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
               }}
            >
               <Navbar />
               <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  <Routes>
                     <Route path="/" element={<Home />} />
                  </Routes>
               </Box>
            </Box>
         </Router>
      </ThemeProvider>
   );
}

export default App;
