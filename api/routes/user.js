const mongoose = require('mongoose');
const User = require('./models/User');
const express = require('express');
const router = express.Router();

router.post('/register',async(req,res) => {
    console.log(req.body);
    const { fullName,email,aadharno,phoneno,password} = req.body;
    const user = new User({
        email: email,
        fullName: fullName,
        aadharno: aadharno,
        phoneno: phoneno,
        password: password        
    });

    try {
        await user.save();
        return res.status(200).json({
            msg: 'User Registered Successfully',
            data: ''
        })
    } catch(error) {
        return res.status(500).json({
            msg: 'Error while registering user',
            data: ''
        })
    }
})

router.post('/login',async(req,res) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({email: email});
    console.log(userExist);
    if(!userExist) {
        return res.status(400).json({
            msg: 'Wrong username or password',
            data: ''
        });
    } else {
        console.log(userExist.password);
        console.log(password);
        if(userExist.password === password) {
            return res.status(200).json({
                msg: 'Login Successfully',
                data: userExist
            })
        } else {
            return res.status(400).json({
                msg: 'Wrong password',
                data: ''
            });
        }
    }
})

module.exports = router;