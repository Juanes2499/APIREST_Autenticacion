const microservicioRouter = require('./microservicio.router');

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

                let moduloPermiso  = false;

                try{
                    moduloPermiso = req.decoded.ROLES.ROL_SUPER_USUARIO || req.decoded.PERMISOS.MS_AUTENTICACION_NS.MOD_MICROSERVICIOS;
                }catch{
                    moduloPermiso  = false;
                }

                if(moduloPermiso){
                    microservicioRouter(req,res);
                }

                else{
                    return res.status(500).json({
                        success:false,
                        statusCode:500,
                        message: "The User has not access to microservices module"
                    })
                }
            }
        })
});

module.exports = userAuth;