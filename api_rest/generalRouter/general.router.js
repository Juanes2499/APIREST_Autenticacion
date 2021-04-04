const express = require('express');
const generalRouters = express();

let auth = process.env.AUTHENTICATION.toString();

if(auth === "true"){

    console.log(`Authentication = ${auth}`)

    const login = require('../Login/login.router');
    const userAuth = require('../Usuarios/usuarios.authentication');
    const deviceAuth = require('../Dispositivos/Dispositivos.authentication');
    const microservicoAuth = require('../Microservicios/microservicio.authentication');
    const moduloAuth = require('../Modulos/modulo.authentication');
    const configuracionMicroservicioModuloAuth = require('../cofiguraciónMicroserviciosModulos/configuracionMicroservicioModulo.authentication');
    const configuracionUsarioAuth = require('../configuracionUsuarios/configuracionUsuarios.authentication');
    const rolesAuth = require('../Roles/roles.authentication');
    const configuracionRolesAuth = require('../configuracionRoles/configuracionRoles.authentication');
    
    generalRouters.use("/login", login);
    generalRouters.use("/usuarios", userAuth);
    generalRouters.use("/dispositivos", deviceAuth);
    generalRouters.use("/microservicios", microservicoAuth);
    generalRouters.use("/modulos", moduloAuth);
    generalRouters.use("/configuracion_microservicio_modulos", configuracionMicroservicioModuloAuth);
    generalRouters.use("/configuracion_usuarios", configuracionUsarioAuth);
    generalRouters.use("/roles", rolesAuth);
    generalRouters.use("/configuracionRol", configuracionRolesAuth);
    
    //Open routes
    const configuracionMicroservicioModuloOpenAuth = require('../cofiguraciónMicroserviciosModulos/cofiguraciónMicroserviciosModulos.authenitication.open');
    const deviceAuthOpen = require('../Dispositivos/Dispositivos.authentication.open');

    generalRouters.use("/configuracion_microservicio_modulos_open", configuracionMicroservicioModuloOpenAuth);
    generalRouters.use("/dispositivos_open", deviceAuthOpen);
    
}else if (auth === "false"){

    console.log(`Authentication = ${auth}`)
    
    const login = require('../Login/login.router');
    const userRouter = require('../Usuarios/usuarios.router');
    const deviceRouter = require('../Dispositivos/Dispositivos.router');
    const microservicoRouter = require('../Microservicios/microservicio.router');
    const moduloRouter = require('../Modulos/modulo.router');
    const configuracionMicroservicioModuloRouter = require('../cofiguraciónMicroserviciosModulos/configuracionMicroservicioModulo.router');
    const configuracionUsarioRouter = require('../configuracionUsuarios/configuracionUsuarios.router');
    const rolesRouter = require('../Roles/roles.router');
    const configuracionRolesRouter = require('../configuracionRoles/configuracionRoles.router');
    
    generalRouters.use("/login", login);
    generalRouters.use("/usuarios", userRouter);
    generalRouters.use("/dispositivos", deviceRouter);
    generalRouters.use("/microservicios", microservicoRouter);
    generalRouters.use("/modulos", moduloRouter);
    generalRouters.use("/configuracion_microservicio_modulos", configuracionMicroservicioModuloRouter);
    generalRouters.use("/configuracion_usuarios", configuracionUsarioRouter);
    generalRouters.use("/roles", rolesRouter);
    generalRouters.use("/configuracionRol", configuracionRolesRouter);

    //Open routes
    const configuracionMicroservicioModuloOpenRouter = require('../cofiguraciónMicroserviciosModulos/cofiguraciónMicroserviciosModulos.router.open');
    const deviceRouterOpen = require('../Dispositivos/Dispositivos.router.open');

    generalRouters.use("/configuracion_microservicio_modulos_open", configuracionMicroservicioModuloOpenRouter);
    generalRouters.use("/dispositivos_open", deviceRouterOpen);
}

module.exports = generalRouters;

