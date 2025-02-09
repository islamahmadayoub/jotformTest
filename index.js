/* --------------------------------------- */
// Setup
const express = require('express');
const jsforce = require('jsforce');


const index = express();
const port = process.env.PORT || 3000;

const connectionObject = {
    instanceUrl     : process.env.SALESFORCE_URL,
    oauth: {
        clientId    : process.env.SALESFORCE_CLIENT_ID,
        clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
        loginUrl    : process.env.PRODUCTION_URL
    }
}

index.use(express.json());
index.use(express.urlencoded({ extended: true }));

/* --------------------------------------- */
// Handle Routes

index.get('/', (req, res, next) => {
    console.log(`Request Received. Method is ::: ${req.method} and URL used is ::: ${req.url}`);
    next();
});

index.use(async (req, res) => {
    console.log('CUSTOM MESSAGE ::: Auth is initiated');
    const conn = new jsforce.Connection(connectionObject)
    const userInfo = await conn.authorize({ grant_type: "client_credentials" });
    console.log(`Access Token is ::: ${conn.accessToken}`);
    console.log(`instance URL is ::: ${conn.instanceUrl}`);
    console.log(`User ID is      ::: ${userInfo.id}`);
    console.log(`Org ID is       ::: ${userInfo.organizationId}`);
    res.send('Hello World!!! Authenticated');
});

index.listen(port, () => {
    console.log(`App listening on port ${port}`);
});