const pool = require("../../config/database");

module.exports = {
    crear_rol: (data, callback) => {
        data.nombre_rol = data.nombre_rol.toUpperCase();
        pool.query(
            `SELECT * FROM ROLES
                WHERE NOMBRE_ROL = ? `,
            [data.nombre_rol],
            (error, result) => {
                if(result.length > 0){
                    return callback(`The role: ${data.nombre_rol} already exist`, null, false);
                }else if(result.length === 0){
                    pool.query(
                        `
                        INSERT
                            INTO ROLES
                            (NOMBRE_ROL, DETALLES, FECHA_CREACION, HORA_CREACION)
                        VALUES
                            (?, ?, CURDATE(), CURTIME()) `,
                        [data.nombre_rol, data.detalles],
                        (error, result) => {
                            if(error){
                                return callback(`The role: ${data.nombre_rol} could not be created`, null, false);
                            }
                            return callback(null, result, true);
                        }
                    )
                }
            }
        )
    },
    consultar_roles: (callback) => {
        pool.query(
            `
            SELECT * FROM ROLES `,
            [],
            (error, result) => {
                if(error){
                    return callback(error, null, false);
                }
                return callback(null, result, true);
            }
        )
    },
    consultar_roles_ByNombreRol: (data, callback) => {
        data.nombre_rol = data.nombre_rol.toUpperCase();
        pool.query(
            `
            SELECT * FROM ROLES
                WHERE NOMBRE_ROL = ? `,
            [data.nombre_rol],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The register with nombre_rol: ${data.nombre_rol} was not found`, null, false);
                }else if(result.length > 0){
                    return callback(null, result, true);
                }
            }
        )
    },
    actualizar_rol_ByID: (data, callback) => {
        data.nombre_rol = data.nombre_rol.toUpperCase();
        pool.query(
            `
            SELECT * FROM ROLES
                WHERE ID_ROL = ? `,
            [data.id_rol],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The register with ID_ROL: ${data.id_rol} was not found`, null, false);
                }else if(result.length > 0){
                    pool.query(
                        `
                        UPDATE ROLES
                            SET
                                NOMBRE_ROL = ?,
                                DETALLES = ?,
                                FECHA_ACTUALIZACION = CURDATE(),
                                HORA_ACTUALIZACION = CURTIME()
                            WHERE ID_ROL = ? `,
                        [data.nombre_rol, data. detalles, data.id_rol],
                        (error, result) => {
                            if(error){
                                console.log(error);
                                return callback(`The register with ID_ROL: ${data.id_rol} could not be updated`, null, false);
                            }
                            return callback(null, null, true);
                        }
                    )
                }
            }
        )
    },
    eliminar_rol_ByID: (data, callback) => {
        pool.query(
            `SELECT * FROM ROLES
                WHERE ID_ROL = ?`,
            [data.id_rol],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The register with ID: ${data.id_rol} was not found`, null, false);
                } else if(result.length > 0){
                    pool.query(
                        `
                        DELETE FROM ROLES
                            WHERE ID_ROL = ?`,
                        [data.id_rol],
                        (error, result) => {
                            if(error){
                                return callback(`The register with ID: ${data.id_rol} could not be deleted`, null, false);
                            }
                            return callback(null, null, true)
                        }
                    )
                }
            }
        )
    }
}