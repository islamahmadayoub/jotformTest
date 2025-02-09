const express = require('express');
// const axios = require('axios');
const router = express.Router();

const jsforce = require('jsforce');

const oauth = new jsforce.OAuth2({
    clientId    : process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
    redirectUri : process.env.REDIRECT_URI,
});

router.get('/oauth2/auth', (req, res) => {
    res.redirect(oauth.getAuthorizationUrl({
        scope: 'api id web'
    }))
});

// router.get('/oauth2/callback', (req, res) => {
//     const conn = new Connection( {oauth2: oauth})
//     const code = req.query.code;
// })




module.exports = router;

//
//
// const authURL = `https://${process.env.SALESFORCE_DOMAIN}/services/oauth2/token`;
//
// const authParams = {
//     params: {
//         grant_type: 'client_credentials',
//         client_id: process.env.SALESFORCE_CLIENT_ID,
//         client_secret: process.env.SALESFORCE_CLIENT_SECRET,
//     }
// }
//
// router.get('/', async (req, res) => {
//         try {
//             const response      = await axios.post(authURL, null, authParams);
//             req.access_token    = response.data.access_token;
//             console.log('Hello from Homepage')
//             console.log(`Authenticated with token ${req.access_token}`);
//             res.send('Authenticated');
//         } catch (error) {
//             console.log(`Authentication error: ${error.message}`);
//             res.status(500).send(error.message);
//         }
// })

