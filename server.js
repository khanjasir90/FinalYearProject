const express = require('express');
const app = express();
require('dotenv').config();

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