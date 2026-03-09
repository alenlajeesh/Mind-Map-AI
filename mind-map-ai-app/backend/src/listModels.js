const axios = require('axios');
require('dotenv').config();
const apiKey = process.env.GOOGLE_AI_API_KEY;
console.log('API Key:', process.env.GOOGLE_AI_API_KEY);

axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
  .then(res => console.log(res.data))
  .catch(err => console.error(err.response?.data || err.message));
