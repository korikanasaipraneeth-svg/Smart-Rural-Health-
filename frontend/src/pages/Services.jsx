import React from 'react';
import { Activity, MapPin, Stethoscope, Bell } from 'lucide-react';

const Services = () => {
  return (
    <div className="container py-12 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Our Services</h1>
          <p className="text-lg text-gray-600">Comprehensive healthcare solutions built for accessibility.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <Activity className="text-indigo-600 mb-4" size={40} />
            <h2 className="text-2xl font-bold mb-3">AI Symptom Checker</h2>
            <p className="text-gray-600">
              Input your symptoms and let our advanced machine learning models predict potential illnesses with high accuracy, suggesting immediate next steps.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <Stethoscope className="text-indigo-600 mb-4" size={40} />
            <h2 className="text-2xl font-bold mb-3">Doctor Consultations</h2>
            <p className="text-gray-600">
              Connect instantly with specialized doctors. Book virtual video consultations or in-person visits based on your predicted health condition.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <MapPin className="text-indigo-600 mb-4" size={40} />
            <h2 className="text-2xl font-bold mb-3">Hospital Locator</h2>
            <p className="text-gray-600">
              Find the nearest equipped hospitals and clinics using our integrated open-source mapping system. Check facility availability in real-time.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <Bell className="text-red-500 mb-4" size={40} />
            <h2 className="text-2xl font-bold mb-3">Emergency SOS</h2>
            <p className="text-gray-600">
              A 1-tap emergency alert system that shares your live location with nearby hospitals and ambulance services to ensure rapid response.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
