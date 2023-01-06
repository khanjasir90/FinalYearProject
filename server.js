const express = require('express');
const app = express();
require('dotenv').config();
require('./db_config.js');
// const Contract = new require("./Contract");
// const Provider = new require("./Provider");
// const contract = new Contract();
// const provider = new Provider();
// const web3 = provider.web3;
// const instance = contract.initContract();

app.use(express.urlencoded({ extended: false }));
app.use(express.json())

//const uploadRoute = require('./api/routes/upload');
const userRoute = require('./api/routes/user');


//app.use('/upload', uploadRoute);
app.use('/api', userRoute);

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