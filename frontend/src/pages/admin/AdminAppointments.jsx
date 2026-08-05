import React, { useState } from 'react';
import { Calendar, User, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([
    { id: 1, patient: 'Ramesh Kumar', doctor: 'Dr. Sarah Jenkins', time: '10:30 AM', date: '2023-11-20', status: 'Upcoming' },
    { id: 2, patient: 'Anjali Sharma', doctor: 'Dr. Mehta', time: '11:15 AM', date: '2023-11-20', status: 'Completed' },
    { id: 3, patient: 'Kiran Rao', doctor: 'Dr. Ahmed', time: '02:00 PM', date: '2023-11-20', status: 'Cancelled' },
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Upcoming': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Completed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-indigo-600" /> Appointments Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all system-wide appointments.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">Patient</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Doctor</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Date & Time</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {appt.patient.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{appt.patient}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{appt.doctor}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{appt.date}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> {appt.time}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-3 py-1 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}