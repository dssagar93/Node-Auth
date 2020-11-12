const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');

const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

const app = express();

//Connect to Mongo DB Atlas
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, (res) => {
    console.log("Connnected to Mongo DB Atlas");
});


app.use(express.json());

//Import routes
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => {
    console.log("Server Runninng.....");
});