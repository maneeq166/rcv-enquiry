const axios = require("axios");
require("dotenv").config();

// Function to Send WhatsApp Message
async function sendWhatsAppMessage(to, message) {
    try {
      const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
  
      const response = await axios.post(
        url,
        {
          messaging_product: "whatsapp",
          to: to, // Format: "91XXXXXXXXXX" (International Format)
          type: "text",
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("WhatsApp Message Sent:", response.data);
    } catch (error) {
      console.error("Error Sending WhatsApp Message:", error.response ? error.response.data : error.message);
    }
  }