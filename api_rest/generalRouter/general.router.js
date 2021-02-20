const express = require('express');
const generalRouters = express();

let auth = process.env.AUTHENTICATION.toString();

if(auth === "true"){

    console.log(`Authentication = ${auth}`)

    const login = require('../Login/login.router');
    const userAuth = require('../Usuarios/usuarios.authentication');
    const microservicoAuth = require('../Microservicios/microservicio.authentication');
    const moduloAuth = require('../Modulos/modulo.authentication');
    const configuracionMicroservicioModuloAuth = require('../cofiguraciónMicroserviciosModulos/configuracionMicroservicioModulo.authentication');
    const configuracionUsarioAuth = require('../configuracionUsuarios/configuracionUsuarios.authentication');
    const rolesAuth = require('../Roles/roles.authentication');
    const configuracionRolesAuth = require('../configuracionRoles/configuracionRoles.authentication');
    
    generalRouters.use("/login", login);
    generalRouters.use("/usuarios", userAuth);
    generalRouters.use("/microservicios", microservicoAuth);
    generalRouters.use("/modulos", moduloAuth);
    generalRouters.use("/configuracion_microservicio_modulos", configuracionMicroservicioModuloAuth);
    generalRouters.use("/configuracion_usuarios", configuracionUsarioAuth);
    generalRouters.use("/roles", rolesAuth);
    generalRouters.use("/configuracionRol", configuracionRolesAuth);

}else if (auth === "false"){

    console.log(`Authentication = ${auth}`)
    
    const login = require('../Login/login.router');
    const userRouter = require('../Usuarios/usuarios.router');
    const microservicoRouter = require('../Microservicios/microservicio.router');
    const moduloRouter = require('../Modulos/modulo.router');
    const configuracionMicroservicioModuloRouter = require('../cofiguraciónMicroserviciosModulos/configuracionMicroservicioModulo.router');
    const configuracionUsarioRouter = require('../configuracionUsuarios/configuracionUsuarios.router');
    const rolesRouter = require('../Roles/roles.router');
    const configuracionRolesRouter = require('../configuracionRoles/configuracionRoles.router');
    
    generalRouters.use("/login", login);
    generalRouters.use("/usuarios", userRouter);
    generalRouters.use("/microservicios", microservicoRouter);
    generalRouters.use("/modulos", moduloRouter);
    generalRouters.use("/configuracion_microservicio_modulos", configuracionMicroservicioModuloRouter);
    generalRouters.use("/configuracion_usuarios", configuracionUsarioRouter);
    generalRouters.use("/roles", rolesRouter);
    generalRouters.use("/configuracionRol", configuracionRolesRouter);
}

module.exports = generalRouters;

