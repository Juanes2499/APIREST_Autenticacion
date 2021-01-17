const {
    crear_rol,
    consultar_roles,
    consultar_roles_ByNombreRol,
    actualizar_rol_ByID,
    eliminar_rol_ByID,
} = require('./roles.service');

module.exports = {
    crearRol: (req, res) => {
        const body = req.body;
        crear_rol(body, (err, result, state) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    message: "Database create error - error in crearRol",
                    return: err
                })
            }
            return res.status(201).json({
                success:state,
                statusCode:201,
                message: `The role: ${body.nombre_rol} was successfully created`
            })
        })
    },
    consultarRoles: (req, res) => {
        consultar_roles((err, result, state) => {
            if(err){
                console.log(err);
                return res.status(403).json({
                    success:state,
                    statusCode:403,
                    message: "Database get error - error in consultarRoles"
                })
            }
            return res.status(200).json({
                success: state,
                statusCode: 200,
                data:result
            })
        })
    },
    consultarRolByNombreRol: (req, res) => {
        const body = req.body;
        consultar_roles_ByNombreRol(body, (err, result, state) => {
            if(state === false){
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database get error - error in consultarRolByNombreRol",
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
    actualizarRolByID: (req, res) => {
        const body = req.body;
        actualizar_rol_ByID(body, (err, result, state) => {
            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database put error - error in actualizarRolByID",
                    return: err
                });
            }
            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The role with ID_ROL: ${body.id_rol} was successfully updated`
            });
        })
    },
    eliminarRolByID: (req, res) => {
        const body = req.body;
        eliminar_rol_ByID(body, (err, result, state) => {
            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success:state,
                    statusCode:403,
                    message: "Database delete error - error in eliminarRolByID",
                    return: err
                });
            }
            return res.status(200).json({
                success: state,
                statusCode: 200,
                message: `The node sensor with ID: ${body.id_rol} was successfully deleted`
            })
        })
    }
}