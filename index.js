/* --------------------------------------- */
// Setup and config
const express       = require('express');
const axios         = require('axios');
const multer        = require('multer');
const upload = multer();
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

index.use(upload.none());
index.use(express.json());
index.use(express.urlencoded({ extended: true }));

/* --------------------------------------- */
// Setup Variables and Constants
const sampleAccount = {
    Name: "Test Account From Middleware"
};

// Helper Functions

async function createAccount() {
    try {
        return await axios.post(accountUrl, sampleAccount, postConfig);
    } catch (error) {
        if (error.response.data[0].errorCode === "INVALID_SESSION_ID") {
            return "INVALID_SESSION_ID";
        }
        throw error;
    }
}

async function authenticate() {
    try {
        console.log('CUSTOM MESSAGE ::: Moved to Next Middleware Successfully')
        const response = await axios.post(authEndpoint, null, authRequestConfigObject);
        accessToken = response.data.access_token;
        postConfig.headers.Authorization = `Bearer ${accessToken}`;
        console.log(`Access Token is ::: ${accessToken}`);
        return true;
    } catch (error) {
        console.error("Error fetching token:", error.response?.data || error.message);
        return false;
    }
}

// Handle Routes
index.post("/", async (req, res) => {
    try {
        let result = await createAccount();

        if (result === "INVALID_SESSION_ID") {
            const authSuccess = await authenticate();
            if (!authSuccess) {
                return res.status(500).json({ error: "Failed to retrieve access token" });
            }
            result = await createAccount();
        }

        return res.status(201).json({
            message: "Account created successfully",
            salesforceId: result.data.id
        });
    } catch (error) {
        console.error("Error creating account:", error.response?.data || error.message);
        res.status(500).json(error.response?.data || { error: "Failed to create account" });
    }
});


index.listen(port, () => {
    console.log(`App listening on port ${port}`);
});