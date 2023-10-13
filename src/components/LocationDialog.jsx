import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";

function LocationDialog({ isOpen, onClose, lat, lng }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Ubicación en Google Maps</DialogTitle>
      <DialogContent>
        <GoogleMap mapContainerStyle={{ width: "500px", height: "500px" }} zoom={15} center={{ lat, lng }} markers={{ lat, lng }}>
          <Marker options={{lat, lng}}/>
        </GoogleMap>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LocationDialog;