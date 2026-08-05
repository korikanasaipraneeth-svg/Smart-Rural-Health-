const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load Models
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Hospital = require('./models/Hospital');
const Disease = require('./models/Disease');
const Feedback = require('./models/Feedback');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const patients = [
    {
        full_name: "Ramesh Babu",
        email: "ramesh.babu@test.com",
        password: "password123",
        role: "patient",
        status: "Critical",
        riskLevel: "High",
        assignedHospital: "Apollo Rural Health",
        assignedDoctor: "Dr. Arvind Sharma",
        symptoms: "Severe chest pain, shortness of breath",
        diseasePrediction: "Myocardial Infarction",
        isEmergency: true
    },
    {
        full_name: "Sita Kumari",
        email: "sita.kumari@test.com",
        password: "password123",
        role: "patient",
        status: "Under Observation",
        riskLevel: "Medium",
        assignedHospital: "District Govt Hospital",
        assignedDoctor: "Dr. Sunita Patel",
        symptoms: "High fever, chills, body ache",
        diseasePrediction: "Malaria",
        isEmergency: false
    }
];

const doctors = [
    {
        userId: "DOC001",
        name: "Dr. Arvind Sharma",
        qualification: "MBBS, MD (Cardiology)",
        specialization: "Cardiologist",
        department: "Cardiology",
        hospital: "City General Hospital",
        experience: "15 Years",
        phone: "+91 9876543210",
        email: "dr.arvind@email.com",
        status: "Available",
        verification: "Verified",
        rating: 4.8,
        patientsTreated: 12500
    },
    {
        userId: "DOC002",
        name: "Dr. Sunita Patel",
        qualification: "MBBS, MS (Gynecology)",
        specialization: "Gynecologist",
        department: "Women's Health",
        hospital: "Rural Health Center",
        experience: "8 Years",
        phone: "+91 8765432109",
        email: "dr.sunita@email.com",
        status: "On Leave",
        verification: "Verified",
        rating: 4.9,
        patientsTreated: 8400
    }
];

const hospitals = [
    {
        name: "Apollo Rural Health",
        address: "Anakapalle Main Road",
        contact_number: "+91 9876543210",
        regNo: "REG2024-9982",
        type: "Private",
        district: "Visakhapatnam",
        city: "Anakapalle",
        email: "contact@apollo-anakapalle.com",
        departments: "12",
        doctorsCount: 45,
        totalBeds: 250,
        availableBeds: 45,
        icu: true,
        has_emergency: true,
        verification: "Verified",
        status: "Active",
        isApproved: true
    },
    {
        name: "District Govt Hospital",
        address: "Srikakulam Govt Road",
        contact_number: "+91 8765432109",
        regNo: "GOV-AP-5541",
        type: "Government",
        district: "Srikakulam",
        city: "Srikakulam",
        email: "dgh-srikakulam@ap.gov.in",
        departments: "8",
        doctorsCount: 28,
        totalBeds: 500,
        availableBeds: 12,
        icu: true,
        has_emergency: true,
        verification: "Verified",
        status: "Active",
        isApproved: true
    }
];

const diseases = [
    {
        diseaseId: "DIS-001",
        name: "Dengue Fever",
        category: "Viral Infection",
        symptoms: "High Fever, Joint Pain, Rash",
        riskLevel: "High",
        contagious: "No",
        seasonal: "Monsoon",
        treatment: "Fluid Replacement, Pain Relievers",
        status: "Active"
    },
    {
        diseaseId: "DIS-002",
        name: "Malaria",
        category: "Parasitic Infection",
        symptoms: "Chills, Fever, Sweating",
        riskLevel: "High",
        contagious: "No",
        seasonal: "Monsoon",
        treatment: "Antimalarial Drugs",
        status: "Active"
    }
];

const feedbacks = [
    {
        feedbackId: "FB-001",
        user: "Rahul Sharma",
        userType: "Patient",
        hospital: "Apollo Rural Health",
        category: "Suggestion",
        subject: "Add more appointment slots",
        rating: 4,
        status: "New",
        description: "It would be great if the hospital could add more evening appointment slots for general physicians."
    },
    {
        feedbackId: "FB-002",
        user: "Dr. Sunita Patel",
        userType: "Doctor",
        hospital: "District Govt Hospital",
        category: "Bug Report",
        subject: "AI Prediction taking too long",
        rating: 3,
        status: "In Progress",
        description: "The AI symptom checker module is taking more than 10 seconds to generate a response during peak hours."
    }
];

// Import Data
const importData = async () => {
    try {
        await User.deleteMany();
        await Doctor.deleteMany();
        await Hospital.deleteMany();
        await Disease.deleteMany();
        await Feedback.deleteMany();

        await User.insertMany(patients);
        await Doctor.insertMany(doctors);
        await Hospital.insertMany(hospitals);
        await Disease.insertMany(diseases);
        await Feedback.insertMany(feedbacks);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
