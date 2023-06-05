const express = require('express');
const mongoose = require('mongoose');
const route = require('./routes/route');
const path = require('path');
const http = require('http');
const app = express();

app.use(express.json());

const server = http.createServer(app);

app.use(express.static(path.join(__dirname,'public')));

mongoose.connect("mongodb+srv://palbijewar:1AjTHFUgEjOKutIq@cluster0.kft04uo.mongodb.net/shortenUrl",{
    useNewUrlParser:true
}).then(()=>{console.log("MongoDb is connected")}).catch((err)=>{console.log(err.message)});

app.use('/',route);

const PORT = 3000 || process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is listing on port ${PORT}`);
});