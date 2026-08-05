const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Feedback = require('./models/Feedback');

dotenv.config();

const FEEDBACK_SUBJECTS = [
    { cat: 'Complaint', subj: 'Long waiting time at the clinic', desc: 'I had an appointment but I still had to wait for 2 hours before seeing the doctor.' },
    { cat: 'Suggestion', subj: 'Need more drinking water stations', desc: 'It would be great if there were more drinking water stations in the general wards area.' },
    { cat: 'App Feedback', subj: 'App crashes on booking', desc: 'When I try to book an appointment with Dr. Singh, the app just closes itself.' },
    { cat: 'Bug Report', subj: 'Map shows wrong location', desc: 'The live map is showing my hospital 10 miles away from where it actually is.' },
    { cat: 'Complaint', subj: 'Unprofessional behavior', desc: 'The front desk staff was very rude to me when I asked about my lab reports.' },
    { cat: 'Suggestion', subj: 'Add online payment for pharmacy', desc: 'It would be very convenient to pay for medicines through the app.' },
    { cat: 'App Feedback', subj: 'Great user interface!', desc: 'I really love the new update. The colors and design are very soothing.' },
    { cat: 'Complaint', subj: 'Ambulance arrived late', desc: 'I requested an ambulance through the app and it took 45 minutes to reach me.' },
    { cat: 'Suggestion', subj: 'More chairs in waiting room', desc: 'There are not enough chairs for patients and attendees in the lobby.' },
    { cat: 'Bug Report', subj: 'Cannot upload documents', desc: 'When clicking upload on the prescription page, nothing happens.' }
];

const NAMES = ['Rahul Verma', 'Sneha Patel', 'Apollo Rural Health', 'Dr. Ramesh', 'District Govt Hospital', 'Anjali Desai', 'Suresh Kumar'];
const HOSPITALS = ['Apollo Rural Health', 'District Govt Hospital', 'KIMS Hospital', 'Medicover Hospital', 'GMR Care'];

async function seedFeedback() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-bangaram');
        console.log('MongoDB Connected.');

        await Feedback.deleteMany();

        const feedbacks = [];
        for (let i = 0; i < 45; i++) {
            const template = FEEDBACK_SUBJECTS[Math.floor(Math.random() * FEEDBACK_SUBJECTS.length)];
            const userType = Math.random() > 0.7 ? 'Hospital' : Math.random() > 0.5 ? 'Doctor' : 'Patient';
            const status = Math.random() > 0.8 ? 'Resolved' : Math.random() > 0.5 ? 'In Progress' : 'New';
            
            feedbacks.push({
                feedbackId: 'FB' + Math.floor(10000 + Math.random() * 90000),
                user: NAMES[Math.floor(Math.random() * NAMES.length)],
                userType: userType,
                hospital: HOSPITALS[Math.floor(Math.random() * HOSPITALS.length)],
                category: template.cat,
                subject: template.subj,
                description: template.desc,
                rating: Math.floor(Math.random() * 5) + 1,
                status: status,
                reply: status === 'Resolved' ? 'Thank you for your feedback. We have addressed this issue.' : '',
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
            });
        }

        await Feedback.insertMany(feedbacks);
        console.log(`Successfully added ${feedbacks.length} fake feedback records.`);
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedFeedback();
