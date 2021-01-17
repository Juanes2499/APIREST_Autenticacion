const rolesRouter = require('./roles.router');

const express = require('express');
const rolesAuth = express();

const auth = require('../../shared/authentication');

rolesAuth.use("/", (req, res)=>{
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
                const rolRoles = req.decoded.ROL_ROLES;
    
                if(rolMaster || rolRoles ){
                    rolesRouter(req,res);
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

module.exports = rolesAuth;