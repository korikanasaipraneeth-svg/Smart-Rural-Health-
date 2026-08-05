import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "How accurate is the AI Symptom Checker?",
    answer: "Our AI model is trained on vast medical datasets and provides highly probable predictions based on standard medical science. However, it is a predictive tool and should not replace a professional medical diagnosis."
  },
  {
    question: "Are the doctors on the platform verified?",
    answer: "Yes, all doctors available for consultation on Smart Rural Health undergo a strict verification process, including checking their medical licenses and credentials."
  },
  {
    question: "Is my personal medical data safe?",
    answer: "Absolutely. We adhere to strict data privacy and security regulations. Your data is encrypted and only shared with doctors you explicitly choose to consult."
  },
  {
    question: "How do I find a hospital in an emergency?",
    answer: "You can click the 'Emergency SOS' button or use our Hospital Locator map to instantly find the nearest equipped clinic or hospital based on your GPS location."
  },
  {
    question: "Is the service free to use?",
    answer: "Basic services like the Symptom Checker and Hospital Locator are free. Doctor consultations may have fees depending on the specialist you choose."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="container py-12 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200"
            >
              <button 
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-semibold text-lg text-gray-800">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-indigo-600" size={24} />
                ) : (
                  <ChevronDown className="text-gray-400" size={24} />
                )}
              </button>
              
              {openIndex === index && (
                <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
