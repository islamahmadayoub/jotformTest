const express = require('express');
const axios = require('axios');

const router = express.Router();

const authURL = `https://${process.env.DOMAIN_URL}/services/oauth2/token`;

const authParams = {
    params: {
        grant_type: 'client_credentials',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
    }
}

router.get('/', async (req, res, next) => {
        try {
            const response = await axios.post(authURL, null, authParams);
            req.access_token = response.data.access_token;
            console.log('Hello from Homepage')
            console.log(`Authenticated with token ${response.data.access_token}`);
            next();
        } catch (error) {
            console.log(`Authentication error: ${error.message}`);
        }
})

module.exports = router;