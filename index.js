/* --------------------------------------- */
// Setup
const express = require('express');
const jsforce = require('jsforce');
const {Connection} = require("jsforce");


const index = express();
const port = process.env.PORT || 3000;

const oauth = new jsforce.OAuth2({
    clientId    : process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
    redirectUri : process.env.REDIRECT_URI,
});

index.use(express.json());
index.use(express.urlencoded({ extended: true }));

/* --------------------------------------- */
// Handle Routes

index.get('/oauth2/callback', async (req, res) => {
    console.log('Callback is initiated successfully.');
    const conn = new Connection({oauth2: oauth})
    const code = req.query.code;
    const userInfo = await conn.authorize(code);
    console.log(`Access Token is ::: ${conn.accessToken}`);
    console.log(`instance URL is ::: ${conn.instanceUrl}`);
    console.log(`User ID is      ::: ${userInfo.id}`);
    console.log(`Org ID is       ::: ${userInfo.organizationId}`);
    res.send('Hello World!!! Authenticated');
});

index.get('/', (req, res, next) => {
    console.log(`Request Received. Method is ::: ${req.method} and URL used is ::: ${req.url}`);
    next();
});

index.get('/oauth2/auth', (req, res) => {
    res.redirect(oauth.getAuthorizationUrl({
        scope: 'api id web'
    }));
});


index.listen(port, () => {
    console.log(`App listening on port ${port}`);
});