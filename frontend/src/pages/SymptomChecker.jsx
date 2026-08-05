import { useState } from 'react';
import { Search, Activity, ChevronRight, AlertCircle } from 'lucide-react';

const SYMPTOMS_LIST = [
  "Fever", "Cough", "Headache", "Chest Pain", "Fatigue", 
  "Vomiting", "Stomach Pain", "Nausea", "Dizziness", "Shortness of Breath"
];

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) return;
    setIsAnalyzing(true);
    setResult(null);
    
    // Simulate AI Prediction API Call
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        disease: selectedSymptoms.includes("Fever") && selectedSymptoms.includes("Cough") ? "Viral Infection" : "Mild Condition",
        confidence: 85,
        risk: selectedSymptoms.includes("Chest Pain") ? "High" : "Low",
        description: "Based on your symptoms, this seems to be a common viral infection. Ensure you rest and stay hydrated.",
        recommendation: "Consult a General Physician if symptoms persist for more than 3 days."
      });
    }, 2000);
  };

  return (
    <div className="container section">
      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="heading-2 text-center mb-2 flex justify-center items-center gap-3">
          <Activity color="var(--color-primary)" /> AI Symptom Checker
        </h2>
        <p className="text-center text-muted mb-8">Select your symptoms to get an AI-powered health assessment.</p>

        {!result ? (
          <>
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3 text-muted" size={20} />
              <input 
                type="text" 
                placeholder="Search symptoms..." 
                className="form-input w-full pl-10" 
                style={inputStyle}
              />
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {SYMPTOMS_LIST.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    selectedSymptoms.includes(symptom) 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-main border-muted hover:border-primary'
                  }`}
                  style={{ 
                    backgroundColor: selectedSymptoms.includes(symptom) ? 'var(--color-primary)' : 'white',
                    color: selectedSymptoms.includes(symptom) ? 'white' : 'inherit',
                    borderColor: selectedSymptoms.includes(symptom) ? 'var(--color-primary)' : 'rgba(0,0,0,0.1)'
                  }}
                >
                  {symptom}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center border-t pt-6">
              <p className="text-sm text-muted">{selectedSymptoms.length} symptoms selected</p>
              <button 
                className="btn btn-primary" 
                onClick={handleAnalyze}
                disabled={selectedSymptoms.length === 0 || isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing AI Model...' : 'Analyze Symptoms'}
              </button>
            </div>
          </>
        ) : (
          <div className="result-container fade-in">
            <div className="p-6 rounded-lg mb-6 border" style={{ borderColor: result.risk === 'High' ? 'var(--color-danger)' : 'var(--color-accent)' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="heading-3 mb-1">{result.disease}</h3>
                  <p className="text-sm text-muted">AI Confidence Score: {result.confidence}%</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold text-white`} style={{ backgroundColor: result.risk === 'High' ? 'var(--color-danger)' : 'var(--color-accent)' }}>
                  {result.risk} Risk
                </div>
              </div>
              <p className="mb-4">{result.description}</p>
              <div className="flex items-start gap-2 bg-light p-3 rounded-md text-sm">
                <AlertCircle className="text-primary mt-1" size={16} />
                <p>{result.recommendation}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="btn btn-outline" onClick={() => setResult(null)}>Check Again</button>
              <button className="btn btn-secondary flex items-center gap-2">Find a Doctor <ChevronRight size={18}/></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  paddingLeft: '2.5rem',
  borderRadius: 'var(--radius-full)',
  border: '1px solid rgba(0,0,0,0.1)',
  outline: 'none',
  fontFamily: 'inherit'
};

export default SymptomChecker;
