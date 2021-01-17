require("dotenv").config()
const express = require('express');
const app = express();

const generalRouter = require('./api_rest/generalRouter/general.router');

app.get("/api",(req, res) =>{
    res.json({
        success: true,
        message: "This API Rest is working"
    });
});

app.use(express.json());

//Router
app.use("/api", generalRouter);


//Desplegar server
const ServerDeploy = new Promise((resolve,reject)=>{
    app.listen(process.env.PORT_SERVER, ()=>{
        resolve();
    });
})

ServerDeploy
    .then(()=>{
        console.log(`The server was deployed on ${process.env.PORT_SERVER} port`);
    })
    .catch((err)=>{
        console.log(err);
    })

