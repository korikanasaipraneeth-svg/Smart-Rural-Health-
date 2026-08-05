import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios Interceptors for Auth Token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Bypass-Tunnel-Reminder'] = 'true';
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Automatically logout user on 401
            // localStorage.removeItem('token');
            // localStorage.removeItem('user');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const handleResponse = async (request) => {
    const response = await request;
    return response.data.data;
};

// Auth Service
export const authService = {
    // Patient
    loginPatient: (data) => axios.post(`${API_URL}/auth/login`, data).then(res => res.data),
    registerPatient: (data) => axios.post(`${API_URL}/auth/register`, data).then(res => res.data),
    
    // Hospital
    loginHospital: (data) => axios.post(`${API_URL}/auth/hospital/login`, data).then(res => res.data),
    registerHospital: (data) => axios.post(`${API_URL}/auth/hospital/register`, data).then(res => res.data)
};

// Admin Service
export const adminService = {
    // Patients
    getPatients: () => handleResponse(axios.get(`${API_URL}/admin/patients`)),
    addPatient: (data) => handleResponse(axios.post(`${API_URL}/admin/patients`, data)),
    updatePatient: (id, data) => handleResponse(axios.put(`${API_URL}/admin/patients/${id}`, data)),
    deletePatient: (id) => handleResponse(axios.delete(`${API_URL}/admin/patients/${id}`)),

    // Doctors
    getDoctors: () => handleResponse(axios.get(`${API_URL}/admin/doctors`)),
    addDoctor: (data) => handleResponse(axios.post(`${API_URL}/admin/doctors`, data)),
    updateDoctor: (id, data) => handleResponse(axios.put(`${API_URL}/admin/doctors/${id}`, data)),
    deleteDoctor: (id) => handleResponse(axios.delete(`${API_URL}/admin/doctors/${id}`)),

    // Hospitals
    getHospitals: () => handleResponse(axios.get(`${API_URL}/admin/hospitals`)),
    addHospital: (data) => handleResponse(axios.post(`${API_URL}/admin/hospitals`, data)),
    updateHospital: (id, data) => handleResponse(axios.put(`${API_URL}/admin/hospitals/${id}`, data)),
    deleteHospital: (id) => handleResponse(axios.delete(`${API_URL}/admin/hospitals/${id}`)),

    // Diseases
    getDiseases: () => handleResponse(axios.get(`${API_URL}/admin/diseases`)),
    addDisease: (data) => handleResponse(axios.post(`${API_URL}/admin/diseases`, data)),
    updateDisease: (id, data) => handleResponse(axios.put(`${API_URL}/admin/diseases/${id}`, data)),
    deleteDisease: (id) => handleResponse(axios.delete(`${API_URL}/admin/diseases/${id}`)),

    // Feedback
    getFeedback: () => handleResponse(axios.get(`${API_URL}/admin/feedback`)),
    
    // Blood Bank
    getBloodBankNetwork: () => handleResponse(axios.get(`${API_URL}/admin/blood-bank`)),
    getAllBloodRequests: () => handleResponse(axios.get(`${API_URL}/admin/blood-bank/requests`)),

    // Health Camps
    getAllCamps: () => handleResponse(axios.get(`${API_URL}/camps`)),
    updateCampStatus: (campId, data) => handleResponse(axios.put(`${API_URL}/camps/${campId}`, data)),

    // Schemes & Claims
    getAllSchemes: () => handleResponse(axios.get(`${API_URL}/schemes`)),
    createScheme: (data) => handleResponse(axios.post(`${API_URL}/schemes`, data)),
    getAdminClaims: () => handleResponse(axios.get(`${API_URL}/schemes/admin-claims`)),
    updateClaimStatus: (claimId, data) => handleResponse(axios.put(`${API_URL}/schemes/claim/${claimId}`, data))
};

// Hospital Profile Service
export const hospitalProfileService = {
    getProfile: () => handleResponse(axios.get(`${API_URL}/hospitals/profile`)),
    updateProfile: (data) => handleResponse(axios.put(`${API_URL}/hospitals/profile`, data)),
    uploadLogo: (formData) => handleResponse(axios.post(`${API_URL}/hospitals/upload/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })),
    uploadCover: (formData) => handleResponse(axios.post(`${API_URL}/hospitals/upload/cover`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })),
    getAppointments: () => handleResponse(axios.get(`${API_URL}/hospitals/appointments`)),
    updateAppointmentStatus: (id, status) => handleResponse(axios.put(`${API_URL}/hospitals/appointments/${id}`, { status })),

    // Health Camps
    createCamp: (data) => handleResponse(axios.post(`${API_URL}/camps`, data)),
    updateCamp: (campId, data) => handleResponse(axios.put(`${API_URL}/camps/${campId}`, data)),
    getHospitalCamps: () => handleResponse(axios.get(`${API_URL}/camps/hospital`)),
    getCampRegistrations: (campId) => handleResponse(axios.get(`${API_URL}/camps/${campId}/registrations`)),
    updateCampRegistrationStatus: (regId, status) => handleResponse(axios.put(`${API_URL}/camps/registrations/${regId}`, { status })),

    // Schemes & Claims
    createClaim: (data) => handleResponse(axios.post(`${API_URL}/schemes/claim`, data)),
    getHospitalClaims: () => handleResponse(axios.get(`${API_URL}/schemes/hospital-claims`))
};

// Doctor Service
export const doctorService = {
    getAllDoctors: (params) => handleResponse(axios.get(`${API_URL}/doctors`, { params })),
    getDoctorById: (id) => handleResponse(axios.get(`${API_URL}/doctors/${id}`)),
    addDoctor: (data) => handleResponse(axios.post(`${API_URL}/doctors`, data)),
    updateDoctor: (id, data) => handleResponse(axios.put(`${API_URL}/doctors/${id}`, data)),
    deleteDoctor: (id) => handleResponse(axios.delete(`${API_URL}/doctors/${id}`))
};

export const inventoryService = {
    getInventory: () => handleResponse(axios.get(`${API_URL}/inventory`)),
    addItem: (data) => handleResponse(axios.post(`${API_URL}/inventory`, data)),
    updateItem: (id, data) => handleResponse(axios.put(`${API_URL}/inventory/${id}`, data)),
    deleteItem: (id) => handleResponse(axios.delete(`${API_URL}/inventory/${id}`)),
    runPredictions: () => handleResponse(axios.get(`${API_URL}/inventory/predict`)),
    getTransfers: () => handleResponse(axios.get(`${API_URL}/inventory/transfers`)),
    updateTransferStatus: (id, data) => handleResponse(axios.put(`${API_URL}/inventory/transfers/${id}`, data))
};

export const bloodBankService = {
    getDistrictInventory: () => handleResponse(axios.get(`${API_URL}/hospitals/blood-bank`)),
    updateInventory: (data) => handleResponse(axios.put(`${API_URL}/hospitals/blood-bank`, data)),
    getRequests: () => handleResponse(axios.get(`${API_URL}/hospitals/blood-bank/requests`)),
    updateRequestStatus: (id, status) => handleResponse(axios.put(`${API_URL}/hospitals/blood-bank/requests/${id}`, { status }))
};

export const emergencyService = {
    getRequests: () => handleResponse(axios.get(`${API_URL}/emergency/requests`)),
    createRequest: (data) => handleResponse(axios.post(`${API_URL}/emergency/requests`, data)),
    updateStatus: (id, status) => handleResponse(axios.put(`${API_URL}/emergency/requests/${id}`, { status })),
    assignHospital: (id, hospitalId) => handleResponse(axios.put(`${API_URL}/emergency/${id}/assign`, { hospitalId })),
    createFakeEmergency: () => handleResponse(axios.post(`${API_URL}/emergency/fake`)),
    requestAmbulance: (data) => handleResponse(axios.post(`${API_URL}/emergency/request-ambulance`, data)),
    trackAmbulance: (id) => handleResponse(axios.get(`${API_URL}/emergency/track/${id}`))
};

// Patient Portal Service (for the patient themselves)
export const patientPortalService = {
    getProfile: () => handleResponse(axios.get(`${API_URL}/my-portal/profile`)),
    updateProfile: (data) => handleResponse(axios.put(`${API_URL}/my-portal/profile`, data)),
    getRecords: () => handleResponse(axios.get(`${API_URL}/my-portal/records`)),
    getAppointments: () => handleResponse(axios.get(`${API_URL}/my-portal/appointments`)),
    bookAppointment: (data) => handleResponse(axios.post(`${API_URL}/my-portal/appointments`, data)),
    getHospitals: () => handleResponse(axios.get(`${API_URL}/my-portal/hospitals`)),
    getDoctors: (hospitalId) => handleResponse(axios.get(`${API_URL}/my-portal/doctors/${hospitalId}`)),
    getBloodBankNetwork: () => handleResponse(axios.get(`${API_URL}/my-portal/blood-bank`)),
    getBloodRequests: () => handleResponse(axios.get(`${API_URL}/my-portal/blood-bank/requests`)),
    createBloodRequest: (data) => handleResponse(axios.post(`${API_URL}/my-portal/blood-bank/requests`, data)),

    // Health Camps
    getUpcomingCamps: () => handleResponse(axios.get(`${API_URL}/camps`)),
    registerForCamp: (campId, data) => handleResponse(axios.post(`${API_URL}/camps/${campId}/register`, data)),
    getMyCampRegistrations: () => handleResponse(axios.get(`${API_URL}/camps/my-registrations`)),

    // Schemes
    checkEligibility: (patientId) => handleResponse(axios.get(`${API_URL}/schemes/eligibility/${patientId}`)),
    getAllSchemes: () => handleResponse(axios.get(`${API_URL}/schemes`))
};

// Patient Service for Hospital Dashboard
export const patientService = {
    getAllPatients: (params) => handleResponse(axios.get(`${API_URL}/patients`, { params })),
    getPatientById: (id) => handleResponse(axios.get(`${API_URL}/patients/${id}`)),
    admitPatient: (data) => handleResponse(axios.post(`${API_URL}/patients/admit`, data)),
    updatePatientStatus: (id, data) => handleResponse(axios.put(`${API_URL}/patients/${id}/status`, data)),
    dischargePatient: (id) => handleResponse(axios.put(`${API_URL}/patients/${id}/discharge`))
};
// EHR Service
export const ehrService = {
    uploadRecord: (formData) => handleResponse(axios.post(`${API_URL}/ehr/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })),
    getPatientRecords: (patientId) => handleResponse(axios.get(`${API_URL}/ehr/patient/${patientId}`))
};
