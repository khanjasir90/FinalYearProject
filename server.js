const express = require('express');
const app = express();
require('dotenv').config();

// const Contract = new require("./Contract");
// const Provider = new require("./Provider");
// const contract = new Contract();
// const provider = new Provider();
// const web3 = provider.web3;
// const instance = contract.initContract();

const uploadRoute = require('./api/routes/upload');

app.use('/upload', uploadRoute);

app.get('/test',
    (req, res, next) => {
        console.log('test route');
    }
)

app.listen(
    process.env.PORT,
    () => {
        console.log(`Server running on port ${process.env.PORT}`);
    }
)