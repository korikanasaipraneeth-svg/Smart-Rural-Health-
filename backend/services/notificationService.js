/**
 * Notification Service
 * Mock implementation for SMS/WhatsApp notifications.
 * Can be replaced with Twilio or WhatsApp Business API.
 */

const sendSMS = async (phoneNumber, message) => {
    try {
        // MOCK IMPLEMENTATION
        console.log('\n=======================================');
        console.log('🚨 [MOCK SMS SENT] 🚨');
        console.log(`To: ${phoneNumber}`);
        console.log(`Message: ${message}`);
        console.log('=======================================\n');

        // REAL TWILIO IMPLEMENTATION EXAMPLE:
        /*
        const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        */

        return true;
    } catch (error) {
        console.error('Failed to send SMS:', error);
        return false;
    }
};

module.exports = {
    sendSMS
};
