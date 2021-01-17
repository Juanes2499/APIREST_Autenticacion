const configuracionRolesRouter = require('./configuracionRoles.router');

const express = require('express');
const configuracionRolesAuth = express();

const auth = require('../../shared/authentication');

configuracionRolesAuth.use("/", (req, res)=>{
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
                const rolMaster = req.decoded.ROL_MASTER;
                const rolConfiguracionRoles = req.decoded.ROL_CONFIGURACION_ROLES;
    
                if(rolMaster || rolConfiguracionRoles ){
                    configuracionRolesRouter(req,res);
                }
                else{
                    return res.status(500).json({
                        success:false,
                        statusCode:500,
                        message: "The User has not access to Roles"
                    })
                }
            }
        })
});

module.exports = configuracionRolesAuth;