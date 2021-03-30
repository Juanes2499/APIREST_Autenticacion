const deviceRouter = require('./Dispositivos.router');
const pool = require("../../config/database");

const express = require('express');
const deviceAuth = express();

const auth = require('../../shared/authentication');

deviceAuth.use("/", (req, res)=>{
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

                req.body.microservicio_interes = req.body.microservicio_interes.toUpperCase();
                req.body.modulo_interes = req.body.modulo_interes.toUpperCase();

                if(req.body.microservicio_interes === 'GLOBAL' && req.body.modulo_interes === 'GLOBAL'){
                    try{
                        moduloPermiso = req.decoded.ROLES.ROL_SUPER_USUARIO || req.decoded.PERMISOS.MS_AUTENTICACION_NS.MOD_DISPOSITIVOS;
                    }catch{
                        moduloPermiso  = false;
                    }
    
                    if(moduloPermiso){
                        deviceRouter(req,res);
                    }else{
                        return res.status(500).json({
                            success:false,
                            statusCode:500,
                            message: "The User has not global access to device module"
                        })
                    }
                }else{

                    const queryConsultarPermisosMicroservicios = `
                        SELECT COUNT(*) CANTIDAD FROM CONFIGURACION_USUARIOS WHERE EMAIL = ? AND NOMBRE_MICROSERVICIO = ? AND NOMBRE_MODULO = ?
                    `
                   
                    pool.query(
                        queryConsultarPermisosMicroservicios,
                        [req.decoded.EMAIL, req.body.microservicio_interes, req.body.modulo_interes],
                        (error, result) => {

                            if (error){
                                return callback(`There is/are error(s), please contact with the administrator`, false);
                            }

                            const resultToJson = JSON.parse(JSON.stringify(result))[0];

                            if (resultToJson.CANTIDAD > 0){

                                deviceRouter(req,res);

                            }else if (resultToJson.CANTIDAD  === 0){

                                return res.status(500).json({
                                    success:false,
                                    statusCode:500,
                                    message: `The User has not access to device module for ${req.body.microservicio_interes} - ${req.body.modulo_interes}`
                                })

                            }
                        }
                    )   
                }
            }
        })
});

module.exports = deviceAuth;