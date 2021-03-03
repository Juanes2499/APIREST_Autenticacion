const configuracionMicroservicioModuloRouterOpen = require('./cofiguraciónMicroserviciosModulos.router.open');

const express = require('express');
const userAuth = express();

const auth = require('../../shared/authentication');

userAuth.use("/", (req, res)=>{
    auth(req, res)
        .then(() => {

            if(req.decoded === undefined){
                req.error = ({
                    success:false,
                    statusCode:500,
                    message: "decode undefined"
                })
                return req;
            }else{
                configuracionMicroservicioModuloRouterOpen(req,res);
            }
        })
});

module.exports = userAuth;