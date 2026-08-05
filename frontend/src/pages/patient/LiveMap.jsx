import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { emergencyService } from '../../services/api';
import { Ambulance, MapPin, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Ambulance Icon
const ambulanceIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/883/883360.png', // Free ambulance icon
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

export default function LiveMap() {
    const { t } = useTranslation();
    const [patientLocation, setPatientLocation] = useState(null);
    const [ambulanceData, setAmbulanceData] = useState(null);
    const [requesting, setRequesting] = useState(false);
    const [activeRequestId, setActiveRequestId] = useState(null);

    // Set default location to AP
    useEffect(() => {
        // Andhra Pradesh central coordinates
        setPatientLocation({ lat: 15.9129, lng: 79.7400 }); 
    }, []);

    // Polling for ambulance location
    useEffect(() => {
        let interval;
        if (activeRequestId) {
            interval = setInterval(async () => {
                try {
                    const data = await emergencyService.trackAmbulance(activeRequestId);
                    if (data && data.ambulanceLocation) {
                        setAmbulanceData(data);
                        if (data.status === 'Resolved') {
                            clearInterval(interval);
                            alert("Ambulance has arrived!");
                            setActiveRequestId(null);
                        }
                    }
                } catch (err) {
                    console.error("Tracking error:", err);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [activeRequestId]);

    const handleRequestAmbulance = async () => {
        if (!patientLocation) return;
        setRequesting(true);
        try {
            const data = await emergencyService.requestAmbulance({
                latitude: patientLocation.lat,
                longitude: patientLocation.lng,
                condition: 'Emergency'
            });
            setActiveRequestId(data._id);
            setAmbulanceData(data);
        } catch (error) {
            console.error("Failed to request ambulance:", error);
            alert("Failed to request ambulance.");
        } finally {
            setRequesting(false);
        }
    };

    if (!patientLocation) return <div className="p-12 text-center text-gray-500">Getting location...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-70px)]">
            <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center z-10 shadow-sm relative">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <MapPin className="text-red-500" /> {t('Live Map')}
                    </h1>
                    <p className="text-gray-500 mt-1">Track nearby hospitals and emergency services</p>
                </div>
                {!activeRequestId ? (
                    <button 
                        onClick={handleRequestAmbulance}
                        disabled={requesting}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-red-500/30 transition-all font-bold"
                    >
                        <AlertTriangle size={20} />
                        {requesting ? 'Requesting...' : t('Request Ambulance')}
                    </button>
                ) : (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-xl flex items-center gap-3 font-bold animate-pulse">
                        <Ambulance size={24} />
                        {t('Tracking Ambulance')} (ID: {ambulanceData?.assignedAmbulance})
                    </div>
                )}
            </div>
            
            <div className="w-full" style={{ height: 'calc(100vh - 150px)' }}>
                <MapContainer center={[patientLocation.lat, patientLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Patient Location */}
                    <Marker position={[patientLocation.lat, patientLocation.lng]}>
                        <Popup>Emergency Location (AP)</Popup>
                    </Marker>

                    {/* Ambulance Location */}
                    {ambulanceData && ambulanceData.ambulanceLocation && (
                        <Marker 
                            position={[ambulanceData.ambulanceLocation.lat, ambulanceData.ambulanceLocation.lng]}
                            icon={ambulanceIcon}
                        >
                            <Popup>
                                <strong>Ambulance {ambulanceData.assignedAmbulance}</strong><br/>
                                Status: {ambulanceData.status}
                            </Popup>
                        </Marker>
                    )}
                    
                    <MapUpdater center={patientLocation} />
                </MapContainer>
            </div>
        </div>
    );
}

// Helper component to recenter map when location changes
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        map.setView([center.lat, center.lng], 13);
    }, [center, map]);
    return null;
}
