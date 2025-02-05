const express = require('express');
const axios = require('axios');

const router = express.Router();

const authURL = `https://${process.env.SALESFORCE_DOMAIN}/services/oauth2/token`;

const authParams = {
    params: {
        grant_type: 'client_credentials',
        client_id: process.env.SALESFORCE_CLIENT_ID,
        client_secret: process.env.SALESFORCE_CLIENT_SECRET,
    }
}

// router.get('/', (req, res) => {
//     console.log('hello from home');
//     console.log("Inside home router:", req.method, req.url);
//
//     res.send('hello from home');
// })

router.get('/', async (req, res, next) => {
        try {
            const response      = await axios.post(authURL, null, authParams);
            req.access_token    = response.data.access_token;
            console.log('Hello from Homepage')
            console.log(`Authenticated with token ${response.data.access_token}`);
            res.send('Authenticated');
        } catch (error) {
            console.log(`Authentication error: ${error.message}`);
            res.status(500).send(error.message);
        }
})

module.exports = router;