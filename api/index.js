const express = require('express');
const index = express();
const port = process.env.PORT || 3000;

const homepage = require('../routes/home.js');

// Expect JSON or Form Data
index.use(express.json());
index.use(express.urlencoded({ extended: true }));

index.use(homepage);




index.listen(port, () => {
    console.log(`App listening on port ${port}`);
})