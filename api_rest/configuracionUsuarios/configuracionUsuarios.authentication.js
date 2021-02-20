const configuracionUsuariosRouter = require('./configuracionUsuarios.router');

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

                const moduloPermiso = req.decoded.PERMISOS.MS_AUTENTICACION_NS.MOD_CONFIGURACION_USUARIOS;
                
                if(moduloPermiso){
                    configuracionUsuariosRouter(req,res);
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