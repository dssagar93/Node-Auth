const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const { registerValidation, loginValidation } = require('../validation')

//Register
router.post('/register', async (req, res) => {

        const { error } = registerValidation(req.body);
        if (error)
                return res.status(400).send(error.details[0].message);

        //Create a new user
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
                return res.status(400).send("Email already registered");
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashPassword
        });

        try {
                //Saves to Mongo DB Atlas
                const savedUser = await user.save();
                return res.send({ user: user._id });
        }
        catch (error) {
                return res.status(400).send(error);
        }
})


//Login
router.post('/login', async (req, res) => {

        const { error } = loginValidation(req.body);

        if (error)
                return res.status(400).send(error.details[0].message);

        const userInfo = await User.findOne({ email: req.body.email });
        if (!userInfo) {
                return res.status(400).send("Email Id is not registered");
        }

        //If password is valid
        const validPass = await bcrypt.compare(req.body.password, userInfo.password);
        if (!validPass) {
                return res.status(400).send("Email Id or Password is incorrect");
        }

        //Generate a JWT Token
        const token = jwt.sign({ _id: userInfo._id }, process.env.TOKEN_SECRET);
        res.header('Authorization', token).send(token);
});





module.exports = router;