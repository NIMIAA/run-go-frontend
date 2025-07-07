"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix Leaflet marker icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function MapPage() {
  return (
    <div className="w-full h-full">
      <MapContainer 
        center={[6.5244, 3.3792]} // Lagos, Nigeria coordinates
        zoom={13} 
        className="w-full h-full rounded-lg"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[6.5244, 3.3792]}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">RUNGo Campus</h3>
              <p className="text-sm text-gray-600">Your current location</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

    