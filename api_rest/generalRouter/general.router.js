const express = require('express');
const generalRouters = express();

let auth = process.env.AUTHENTICATION.toString();

if(auth === "true"){

    console.log(`Authentication = ${auth}`)

    const login = require('../Usuarios/login.router');
    const userAuth = require('../Usuarios/usuarios.authentication');
    const microservicoAuth = require('../Microservicios/microservicio.authentication');
    const rolesAuth = require('../Roles/roles.authentication');
    const configuracionRolesAuth = require('../configuracionRoles/configuracionRoles.authentication');
    
    generalRouters.use("/login", login);
    generalRouters.use("/usuarios", userAuth);
    generalRouters.use("/microservicios", microservicoAuth);
    generalRouters.use("/roles", rolesAuth);
    generalRouters.use("/configuracionRol", configuracionRolesAuth);

}else if (auth === "false"){

    console.log(`Authentication = ${auth}`)
    
    const login = require('../Usuarios/login.router');
    const userRouter = require('../Usuarios/usuarios.router');
    const microservicoRouter = require('../Microservicios/microservicio.router');
    const rolesRouter = require('../Roles/roles.router');
    const configuracionRolesRouter = require('../configuracionRoles/configuracionRoles.router');
    
    generalRouters.use("/login", login);
    generalRouters.use("/usuarios", userRouter);
    generalRouters.use("/microservicios", microservicoRouter);
    generalRouters.use("/roles", rolesRouter);
    generalRouters.use("/configuracionRol", configuracionRolesRouter);
}

module.exports = generalRouters;

