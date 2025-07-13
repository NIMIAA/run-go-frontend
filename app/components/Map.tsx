"use client";
import dynamic from 'next/dynamic';
import { Icon } from 'leaflet';

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);

const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);

const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);

const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

// Fix for default markers in react-leaflet
const icon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
});

export default function Map() {
    // Redeemer's University coordinates (Ede, Osun State, Nigeria)
    const position: [number, number] = [7.7361, 4.4351];

    return (
        <div className="h-48 sm:h-64 w-full rounded-lg overflow-hidden">
            <MapContainer
                center={position}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={icon}>
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg mb-2">Rungo Support Office</h3>
                            <p className="text-sm text-gray-600 mb-2">
                                Redeemer's University<br />
                                Ede, Osun State<br />
                                Nigeria
                            </p>
                            <p className="text-xs text-blue-600">
                                📞 +234-XXX-XXX-XXXX<br />
                                📧 support@rungo.com
                            </p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
} 