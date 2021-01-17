const {
    crear_configuracionRol,
    consultar_rolesAsiganadosUsuarios,
    consultar_rolesAsiganadosUsuarios_ByNombreRol,
    consultar_rolesAsiganadosUsuarios_ByEmail,
    eliminar_configuracionRol_ByID,
} = require('./configuracionRoles.service');

module.exports = {
    crearConfiguracionRol: (req, res) => {
        const body = req.body;
        crear_configuracionRol(body, (err, result, state) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    message: "Database create error - error in crearConfiguracionRol",
                    return: err
                })
            }
            return res.status(201).json({
                success:state,
                statusCode:201,
                message: `The role configuration with ID_USER: ${body.id_user} and ID_ROL: ${body.id_rol} was successfully created`
            })
        })
    },
    consultarRolesAsiganadosUsuarios: (req, res) => {
        consultar_rolesAsiganadosUsuarios((err, result, state) => {
            if(err){
                console.log(err);
                return res.status(403).json({
                    success:state,
                    statusCode:403,
                    message: "Database get error - error in consultarRolesAsiganadosUsuarios"
                });
            }
            return res.status(200).json({
                success: state,
                statusCode: 200,
                data:result
            })
        })
    },
    consultarRolesAsiganadosUsuariosByNombreRol: (req, res) => {
        const body = req.body;
        consultar_rolesAsiganadosUsuarios_ByNombreRol(body, (err, result, state) => {
            if(state === false){
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database get error - error in consultarRolesAsiganadosUsuariosByNombreRol",
                    return: err
                });
            }else if(result.length > 0){
                return res.status(200).json({
                    success: state,
                    statusCode: 200,
                    data:result
                })
            }
        })
    },
    consultarRolesAsiganadosUsuariosByEmail: (req, res) => {
        const body = req.body;
        consultar_rolesAsiganadosUsuarios_ByEmail(body, (err, result, state) => {
            if(state === false){
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database get error - error in consultarRolesAsiganadosUsuariosByEmail",
                    return: err
                });
            }else if(result.length > 0){
                return res.status(200).json({
                    success: state,
                    statusCode: 200,
                    data:result
                })
            }
        })
    },
    eliminarConfiguracionRolByID: (req, res) => {
        const body = req.body;
        eliminar_configuracionRol_ByID(body, (err, result, state) => {
            if(state === false){
                return res.status(403).json({
                    success:state,
                    statusCode:403,
                    message: "Database delete error - error in eliminarConfiguracionRolByID",
                    return: err
                });
            }
            return res.status(200).json({
                success: state,
                statusCode: 200,
                message: `The role configuration with ID: ${body.id_configuracion} was successfully deleted`
            })
        })
    }
}
