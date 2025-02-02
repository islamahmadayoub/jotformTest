const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

// Expect JSON or Form Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})