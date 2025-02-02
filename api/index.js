const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const homepage = require('../routes/home.js');

// Expect JSON or Form Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(homepage);




app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})