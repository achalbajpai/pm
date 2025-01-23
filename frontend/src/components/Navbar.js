import React from "react";
import {
   AppBar,
   Toolbar,
   Typography,
   IconButton,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogContentText,
   DialogActions,
   Button,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

function Navbar() {
   const [open, setOpen] = React.useState(false);

   return (
      <>
         <AppBar position="static">
            <Toolbar>
               <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Weather App
               </Typography>
               <IconButton color="inherit" onClick={() => setOpen(true)}>
                  <InfoIcon />
               </IconButton>
            </Toolbar>
         </AppBar>

         <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>About PM Accelerator</DialogTitle>
            <DialogContent>
               <DialogContentText>
                  PM Accelerator is a premier product management training and
                  career development platform. We help aspiring and current
                  product managers accelerate their careers through hands-on
                  experience, mentorship, and a supportive community.
                  <br />
                  <br />
                  Visit us on{" "}
                  <a
                     href="https://www.linkedin.com/company/product-manager-accelerator"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     LinkedIn
                  </a>{" "}
                  to learn more about our programs and community.
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
         </Dialog>
      </>
   );
}

export default Navbar;
