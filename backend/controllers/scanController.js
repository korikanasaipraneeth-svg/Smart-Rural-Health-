const scanDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        // Mock AI implementation
        // In a real application, you would pass req.file.buffer to Google Gemini or OpenAI API
        
        // Simulating a 2-second AI processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const extractedData = {
            medicines: [
                { name: "Amoxicillin", dosage: "500mg", frequency: "Twice a day", duration: "5 days" },
                { name: "Paracetamol", dosage: "650mg", frequency: "As needed for fever", duration: "3 days" }
            ],
            notes: "Patient advised to drink plenty of fluids and rest. Follow up if fever persists for more than 2 days.",
            doctorName: "Dr. A. Sharma",
            date: new Date().toLocaleDateString()
        };

        res.status(200).json({
            success: true,
            data: extractedData
        });
    } catch (error) {
        console.error('OCR Error:', error);
        res.status(500).json({ success: false, message: 'Failed to process document' });
    }
};

module.exports = {
    scanDocument
};
