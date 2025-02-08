const express = require('express');
const session = require('express-session');
const homepage = require('./routes/home.js');
console.log("Home router loaded:", homepage);



const index = express();
const port = process.env.PORT || 3000;
const secret = process.env.SECRET;


index.use(session({
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
}));


// Expect JSON or Form Data
index.use(express.json());
index.use(express.urlencoded({ extended: true }));

index.use((req, res, next) => {
    console.log("Request received:", req.method, req.url);
    next();
});


index.use(homepage);


index.listen(port, () => {
    console.log(`App listening on port ${port}`);
})