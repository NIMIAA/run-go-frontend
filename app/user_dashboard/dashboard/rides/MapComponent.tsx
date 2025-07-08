"use client";
import { useEffect, useRef } from 'react';

// Declare Leaflet types for TypeScript
declare global {
    interface Window {
        L: any;
    }
}

const MapComponent = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';

        script.onload = () => {
            if (mapRef.current && window.L && !mapInstanceRef.current) {
                // Initialize map
                const map = window.L.map(mapRef.current).setView([7.7361, 4.4351], 15); // Redeemer's University, Ede, Osun State

                // Add OpenStreetMap tiles
                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Add some sample markers for ride locations
                const locations = [
                    { name: "Queen Esther Hall", coords: [7.7361, 4.4351] },
                    { name: "King David Hall", coords: [7.7461, 4.4451] },
                    { name: "Prince of Peace Hall", coords: [7.7261, 4.4251] },
                    { name: "Victory Hall", coords: [7.7561, 4.4551] },
                    { name: "Faith Hall", coords: [7.7161, 4.4151] }
                ];

                locations.forEach(location => {
                    const marker = window.L.marker(location.coords).addTo(map);
                    marker.bindPopup(`<b>${location.name}</b><br>Available for pickup`);
                });

                // Add a custom marker for current location
                const currentLocationMarker = window.L.marker([7.7361, 4.4351], {
                    icon: window.L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style="background-color: #3B82F6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(map);

                currentLocationMarker.bindPopup('<b>Redeemer\'s University</b><br>Ede, Osun State');

                mapInstanceRef.current = map;
            }
        };

        document.head.appendChild(script);

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            // Remove script and CSS
            const scripts = document.querySelectorAll('script[src*="leaflet"]');
            const links = document.querySelectorAll('link[href*="leaflet"]');
            scripts.forEach(script => script.remove());
            links.forEach(link => link.remove());
        };
    }, []);

    return (
        <div
            ref={mapRef}
            className="w-full h-full rounded-lg"
            style={{ minHeight: '300px' }}
        />
    );
};

export default MapComponent; 