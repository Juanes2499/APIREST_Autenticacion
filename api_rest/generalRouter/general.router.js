const express = require('express');
const generalRouters = express();

let auth = process.env.AUTHENTICATION.toString();

console.log(auth)

if(auth === "true"){

    console.log(`Authentication = ${auth}`)

    const login = require('../users/login.router');
    const userAuth = require('../users/user.authentication');
    const rolesAuth = require('../Roles/roles.authentication');
    const configuracionRolesAuth = require('../configuracionRoles/configuracionRoles.authentication');
    
    generalRouters.use("/login", login);
    generalRouters.use("/users", userAuth);
    generalRouters.use("/roles", rolesAuth);
    generalRouters.use("/configuracionRol", configuracionRolesAuth);

}else if (auth === "false"){

    console.log(`Authentication = ${auth}`)
    
    const login = require('../users/login.router');
    const userRouter = require('../users/user.router');
    const rolesRouter = require('../Roles/roles.router');
    const configuracionRolesRouter = require('../configuracionRoles/configuracionRoles.router');
    
    generalRouters.use("/login", login);
    generalRouters.use("/users", userRouter);
    generalRouters.use("/roles", rolesRouter);
    generalRouters.use("/configuracionRol", configuracionRolesRouter);
}

module.exports = generalRouters;

