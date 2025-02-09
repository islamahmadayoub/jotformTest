/* --------------------------------------- */
// Setup
const express   = require('express');
const jsforce   = require('jsforce');
const axios     = require('axios');


const index     = express();
const port      = process.env.PORT || 3000;

const SALESFORCE_DOMAIN = process.env.SALESFORCE_URL;
const CLIENT_ID         = process.env.SALESFORCE_CLIENT_ID;
const CLIENT_SECRET     = process.env.SALESFORCE_CLIENT_SECRET;

index.use(express.json());
index.use(express.urlencoded({ extended: true }));

/* --------------------------------------- */
// Handle Routes

index.get('/', (req, res, next) => {
    console.log(`Request Received. Method is ::: ${req.method} and URL used is ::: ${req.url}`);
    next();
});

index.use( async (req, res) => {
    try {
        const response = await axios.post(`${SALESFORCE_DOMAIN}/services/oauth2/token`, null, {
            params: {
                grant_type      : "client_credentials",
                client_id       : CLIENT_ID,
                client_secret   : CLIENT_SECRET
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching token:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to retrieve access token" });
    }
});


index.listen(port, () => {
    console.log(`App listening on port ${port}`);
});