const axios = require('axios');
require('dotenv').config();

const CHAPA_API_KEY = process.env.CHAPA_API_KEY;

async function createPaymentLink(amount, currency, tx_ref, callback_url, return_url, metadata) {
  try {
    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      {
        amount,
        currency,
        tx_ref,
        callback_url,
        return_url,
        metadata
      },
      {
        headers: {
          Authorization: `Bearer ${CHAPA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.data.checkout_url;
  } catch (error) {
    console.error('Payment error:', error.response?.data);
    throw error;
  }
}

module.exports = { createPaymentLink };