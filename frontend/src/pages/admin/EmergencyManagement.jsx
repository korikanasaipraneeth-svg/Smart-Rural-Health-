import React, { useState } from 'react';
import { AlertTriangle, Clock, MapPin, Truck, CheckCircle } from 'lucide-react';
import MapWidget from '../../components/MapWidget';

export default function EmergencyManagement() {
  const [emergencies, setEmergencies] = useState([
    { id: 1, type: 'Cardiac Arrest', location: 'Central Station, District 1', status: 'Ambulance Dispatched', time: '5 mins ago', assigned: 'City Hospital' },
    { id: 2, type: 'Severe Trauma', location: 'Highway 42, Mile 5', status: 'Admitted', time: '15 mins ago', assigned: 'Apollo Care' },
    { id: 3, type: 'Stroke Symptoms', location: 'Main Street, Block A', status: 'Awaiting Dispatch', time: 'Just now', assigned: 'Unassigned' },
  ]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-red-600 text-white p-6 rounded-2xl shadow-lg shadow-red-200">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="animate-pulse" /> Live Emergency Tracking
          </h1>
          <p className="text-red-100 text-sm mt-1">Coordinate immediate response units and hospital beds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500"/> Active Emergencies
          </h2>
          <div className="space-y-4">
            {emergencies.map((em) => (
              <div key={em.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{em.type}</h3>
                  <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full animate-pulse">{em.time}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2"><MapPin size={16}/> {em.location}</p>
                  <p className="flex items-center gap-2"><Truck size={16}/> Status: <span className="font-semibold text-indigo-600">{em.status}</span></p>
                  <p className="flex items-center gap-2"><CheckCircle size={16}/> Assigned: {em.assigned}</p>
                </div>
                {em.status === 'Awaiting Dispatch' && (
                  <button className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors">
                    Dispatch Ambulance Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[500px]">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="text-indigo-500"/> Live Ambulance Map
          </h2>
          <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden relative">
            <MapWidget 
              height="100%"
              center={[20.5937, 78.9629]}
              zoom={13}
              markers={[
                { lat: 20.5937, lng: 78.9629, title: "City Hospital", description: "Base" },
                { lat: 20.6010, lng: 78.9700, title: "Ambulance 1", description: "En route to Cardiac Arrest" },
                { lat: 20.5800, lng: 78.9500, title: "Unassigned SOS", description: "Awaiting Dispatch" }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}