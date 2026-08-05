import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Smart Rural Health": "Smart Rural Health",
      "Search": "Search patients, doctors, hospitals...",
      "Dashboard": "Dashboard Overview",
      "My Profile": "My Profile",
      "Appointments": "Appointments",
      "Medical Records": "Medical Records",
      "Symptom Checker": "Symptom Checker",
      "Scan Document": "Scan Document",
      "Emergency": "Emergency",
      "Patient Management": "Patient Management",
      "Doctor Mgmt": "Doctor Mgmt",
      "Language": "Language",
      "Live Map": "Live Map",
      "Request Ambulance": "Request Ambulance",
      "Tracking Ambulance": "Tracking Ambulance...",
      "Upload Document": "Upload Document",
      "Prescription": "Prescription",
      "Lab Report": "Lab Report",
      "Download": "Download",
      "No records found": "No records found"
    }
  },
  hi: {
    translation: {
      "Smart Rural Health": "स्मार्ट ग्रामीण स्वास्थ्य",
      "Search": "मरीजों, डॉक्टरों, अस्पतालों को खोजें...",
      "Dashboard": "डैशबोर्ड अवलोकन",
      "My Profile": "मेरी प्रोफ़ाइल",
      "Appointments": "नियुक्तियाँ",
      "Medical Records": "चिकित्सा रिकॉर्ड",
      "Symptom Checker": "लक्षण चेकर",
      "Scan Document": "दस्तावेज़ स्कैन करें",
      "Emergency": "आपातकालीन",
      "Patient Management": "रोगी प्रबंधन",
      "Doctor Mgmt": "डॉक्टर प्रबंधन",
      "Language": "भाषा",
      "Live Map": "लाइव मैप",
      "Request Ambulance": "एम्बुलेंस का अनुरोध करें",
      "Tracking Ambulance": "एम्बुलेंस को ट्रैक किया जा रहा है...",
      "Upload Document": "दस्तावेज़ अपलोड करें",
      "Prescription": "प्रिस्क्रिप्शन",
      "Lab Report": "लैब रिपोर्ट",
      "Download": "डाउनलोड",
      "No records found": "कोई रिकॉर्ड नहीं मिला"
    }
  },
  te: {
    translation: {
      "Smart Rural Health": "స్మార్ట్ రూరల్ హెల్త్",
      "Search": "రోగులు, వైద్యులు, ఆసుపత్రుల కోసం శోధించండి...",
      "Dashboard": "డాష్‌బోర్డ్ అవలోకనం",
      "My Profile": "నా ప్రొఫైల్",
      "Appointments": "అపాయింట్‌మెంట్లు",
      "Medical Records": "వైద్య రికార్డులు",
      "Symptom Checker": "లక్షణాల చెకర్",
      "Scan Document": "పత్రం స్కాన్ చేయండి",
      "Emergency": "అత్యవసర పరిస్థితి",
      "Patient Management": "రోగి నిర్వహణ",
      "Doctor Mgmt": "వైద్యుల నిర్వహణ",
      "Language": "భాష",
      "Live Map": "లైవ్ మ్యాప్",
      "Request Ambulance": "అంబులెన్స్ అభ్యర్థించండి",
      "Tracking Ambulance": "అంబులెన్స్ ట్రాక్ చేయబడుతోంది...",
      "Upload Document": "పత్రం అప్‌లోడ్ చేయండి",
      "Prescription": "ప్రిస్క్రిప్షన్",
      "Lab Report": "ల్యాబ్ రిపోర్ట్",
      "Download": "డౌన్‌లోడ్",
      "No records found": "ఎలాంటి రికార్డులు కనుగొనబడలేదు"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
