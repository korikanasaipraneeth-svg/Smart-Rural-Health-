import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Loader2, ScanLine } from 'lucide-react';

export default function DocumentScanner() {
    const [file, setFile] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleScan = async () => {
        if (!file) return;

        setScanning(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/scan/document', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                setResult(data.data);
            }
        } catch (error) {
            console.error('Scan failed', error);
            alert('Failed to scan document');
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">AI Document Scanner</h1>
                <p className="text-gray-500 mt-2">Upload a physical prescription or lab report and let AI extract the details.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 bg-gray-50 mb-6 relative">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto text-indigo-500 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-700">Drop your document here</h3>
                    <p className="text-gray-400 mt-2">or click to browse from your device</p>
                </div>

                {file && (
                    <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-xl mb-6">
                        <div className="flex items-center gap-3">
                            <FileText className="text-indigo-600" />
                            <span className="font-medium text-indigo-900">{file.name}</span>
                        </div>
                        <button 
                            onClick={handleScan}
                            disabled={scanning}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {scanning ? <Loader2 className="animate-spin" size={18} /> : <ScanLine size={18} />}
                            {scanning ? 'Scanning...' : 'Scan Now'}
                        </button>
                    </div>
                )}
            </div>

            {result && (
                <div className="mt-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <CheckCircle className="text-emerald-500" size={24} />
                        <h2 className="text-2xl font-bold text-gray-800">Extraction Successful</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Doctor Name</p>
                            <p className="font-medium">{result.doctorName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Date</p>
                            <p className="font-medium">{result.date}</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-4">Prescribed Medicines</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 font-medium text-gray-600">Medicine Name</th>
                                    <th className="p-4 font-medium text-gray-600">Dosage</th>
                                    <th className="p-4 font-medium text-gray-600">Frequency</th>
                                    <th className="p-4 font-medium text-gray-600">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.medicines.map((med, idx) => (
                                    <tr key={idx} className="border-b border-gray-100">
                                        <td className="p-4 font-medium">{med.name}</td>
                                        <td className="p-4 text-gray-600">{med.dosage}</td>
                                        <td className="p-4 text-gray-600">{med.frequency}</td>
                                        <td className="p-4 text-gray-600">{med.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 bg-amber-50 border border-amber-200 p-4 rounded-xl">
                        <h4 className="font-medium text-amber-800 mb-2">Doctor's Notes</h4>
                        <p className="text-amber-700">{result.notes}</p>
                    </div>
                </div>
            )}
        </div>
    );
}


