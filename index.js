/* --------------------------------------- */
// Setup
const express   = require('express');
const axios     = require('axios');
const index     = express();
const port      = process.env.PORT || 3000;
const authEndpoint = `${process.env.SALESFORCE_URL}/services/oauth2/token`;
const authRequestConfigObject = {
    params: {
        grant_type      : "client_credentials",
        client_id       : process.env.SALESFORCE_CLIENT_ID,
        client_secret   : process.env.SALESFORCE_CLIENT_SECRET
    },
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
};
const accountUrl =  `${process.env.SALESFORCE_URL}/services/data/v59.0/sobjects/Account`;
let accessToken;
let postConfig = {
    headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    }
}

index.use(express.json());
index.use(express.urlencoded({ extended: true }));

/* --------------------------------------- */
// Handle Routes

// Confirm received request
index.get('/', (req, res, next) => {
    console.log(`Request Received. Method is ::: ${req.method} and URL used is ::: ${req.url}`);
    next();
});

// Send a request to Salesforce
index.use( async (req, res, next) => {
    try {
        const sampleAccount = {
            Name: "Test Account From Middleware"
        };
        const response = await axios.post(accountUrl, sampleAccount, postConfig);

        res.status(201).json({
            message: "Account created successfully",
            salesforceId: response.data.id
        });
    } catch (error){
        console.log('CUSTOM MESSAGE ::: Error Creating Account')
        console.log(JSON.stringify(error.response));
        if (error.response.data.details[0].errorCode === "INVALID_SESSION_ID") {
            console.log('CUSTOM MESSAGE ::: INVALID_SESSION_ID')
            next(); // Move to the next middleware
        }

    }

});


index.use( async (req, res) => {
    try {
        console.log('CUSTOM MESSAGE ::: Moved to Next Middleware Successfully')
        const response = await axios.post(authEndpoint, null, authRequestConfigObject);
        accessToken = response.data.access_token;
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching token:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to retrieve access token" });
    }
});


index.listen(port, () => {
    console.log(`App listening on port ${port}`);
});