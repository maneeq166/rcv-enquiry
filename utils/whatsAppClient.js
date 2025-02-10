const axios = require('axios');
require('dotenv').config();

// Function to Send WhatsApp Message
async function sendWhatsAppMessage(to, message) {
    if (!to || !message) {
        throw new Error('Phone number and message are required');
    }

    if (!process.env.WHATSAPP_PHONE_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
        throw new Error('Missing WhatsApp configuration');
    }

    try {
        const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
        const response = await axios.post(
            url,
            {
                messaging_product: 'whatsapp',
                to: to.replace(/\D/g, ''), // Remove non-digits
                type: 'text',
                text: { body: message },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data || error.message;
        console.error('Error Sending WhatsApp Message:', errorMessage);
        throw new Error(`WhatsApp message failed: ${errorMessage}`);
    }
}

module.exports = sendWhatsAppMessage;
