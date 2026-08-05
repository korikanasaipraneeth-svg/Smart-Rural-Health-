import React from 'react';

const About = () => {
  return (
    <div className="container py-12 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-sm">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">About Smart Rural Health</h1>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          Smart Rural Health is an AI-powered healthcare assistance application designed specifically to bridge the medical divide in rural areas. By leveraging predictive modeling, we aim to forecast disease outbreaks, streamline doctor consultations, and optimize emergency medical responses.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">Our Mission</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          To ensure that every individual, regardless of their geographical location, has access to immediate, accurate, and life-saving healthcare intelligence.
        </p>

        <hr className="my-10" />

        <h2 className="text-3xl font-bold mb-6 text-gray-900">Privacy & Terms of Service</h2>
        
        <div className="space-y-6 text-gray-700">
          <div>
            <h3 className="text-xl font-semibold mb-2">1. Data Collection Rules</h3>
            <p>We collect minimal personal data necessary for healthcare prediction. Your symptom inputs and geolocation (when searching for hospitals) are encrypted and strictly used for medical assistance purposes only.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">2. Confidentiality Rules</h3>
            <p>All consultations with doctors are strictly confidential. We comply with standard healthcare privacy regulations to ensure your medical history remains private.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">3. User Responsibilities</h3>
            <p>The AI Symptom Checker is a predictive tool and NOT a replacement for professional medical diagnosis. Users must consult verified doctors (available on our platform) for official prescriptions and treatments.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
