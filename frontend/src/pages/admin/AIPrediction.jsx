import React from 'react';
import { Bot, TrendingUp, AlertTriangle, Activity, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AIPrediction() {
  const predictionData = [
    { date: 'Mon', accuracy: 92, cases: 140 },
    { date: 'Tue', accuracy: 95, cases: 200 },
    { date: 'Wed', accuracy: 89, cases: 180 },
    { date: 'Thu', accuracy: 96, cases: 250 },
    { date: 'Fri', accuracy: 94, cases: 220 },
    { date: 'Sat', accuracy: 97, cases: 280 },
    { date: 'Sun', accuracy: 98, cases: 310 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="text-indigo-600" /> AI Disease Predictions
          </h1>
          <p className="text-gray-500 text-sm mt-1">Monitor ML model accuracy and regional outbreak forecasts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl"><Zap size={24}/></div>
          <div>
            <p className="text-sm text-gray-500">Model Accuracy</p>
            <h2 className="text-2xl font-bold text-gray-900">96.8%</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-amber-100 text-amber-600 rounded-xl"><Activity size={24}/></div>
          <div>
            <p className="text-sm text-gray-500">Predicted Outbreaks</p>
            <h2 className="text-2xl font-bold text-gray-900">2 Regions</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl"><TrendingUp size={24}/></div>
          <div>
            <p className="text-sm text-gray-500">Total Scans Analyzed</p>
            <h2 className="text-2xl font-bold text-gray-900">14,289</h2>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Predicted Case Trajectory (Next 7 Days)</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictionData}>
              <defs>
                <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="cases" stroke="#4f46e5" fillOpacity={1} fill="url(#colorCases)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
          <AlertTriangle className="text-amber-500"/> Active Outbreak Warnings
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-4">
            <div className="mt-1"><AlertTriangle className="text-red-500" size={20}/></div>
            <div>
              <h3 className="font-semibold text-red-800">High Risk: Viral Fever (District 4)</h3>
              <p className="text-red-600 text-sm mt-1">AI models detect a 89% probability of a significant viral fever outbreak in District 4 based on recent symptom checker submissions.</p>
            </div>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4">
            <div className="mt-1"><AlertTriangle className="text-amber-500" size={20}/></div>
            <div>
              <h3 className="font-semibold text-amber-800">Medium Risk: Malaria (District 2)</h3>
              <p className="text-amber-700 text-sm mt-1">Minor spike in malaria-like symptoms detected. Recommend hospital readiness.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}