const { func } = require('@hapi/joi');
const { request } = require('express');
const jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
    const token = req.header('Authorization');
    if(!token) return res.status(401).send('Access Denied');
    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        console.log("verfied",verified);
        req.user = verified;
        next();
    }
    catch(ex){
        return  res.status(400).send("Invalid Token");
    }
}