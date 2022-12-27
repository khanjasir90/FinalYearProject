const mongoose = require('mongoose');

mongoose.connect(
    process.env.DB_PROD_URL,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    },
    () => {
        console.log("connected to database");
    }
);