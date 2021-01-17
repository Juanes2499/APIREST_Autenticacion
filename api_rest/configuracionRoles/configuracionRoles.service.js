const pool = require("../../config/database");

module.exports = {
    crear_configuracionRol: (data, callback) => {
        pool.query(
            `
            SELECT 
                (SELECT COUNT(*) FROM USER WHERE ID_USER = ?) USER_EXIST,
                (SELECT COUNT(*) FROM ROLES WHERE ID_ROL = ?) ROL_EXIST
            FROM DUAL `,
            [data.id_user, data.id_rol],
            (error, result) => {

                const resultToJson = JSON.parse(JSON.stringify(result))[0];

                const userExist = parseInt(resultToJson.USER_EXIST);
                const rolExist = parseInt(resultToJson.ROL_EXIST);

                if (userExist === 0 && rolExist ===0){
                    return callback(`The user with ID_USER: ${data.id_user} and role with ID_ROL: ${data.id_rol} were not found`, null, false);
                }else if(userExist === 0){
                    return callback(`The user with ID_USER: ${data.id_user} was not found`, null, false);
                }else if(rolExist === 0){
                    return callback(`The role with ID_ROL: ${data.id_rol} was not found`, null, false);
                }else if(userExist > 0 && rolExist > 0){
                    
                    pool.query(
                        `
                        SELECT * FROM CONFIGURACION_ROLES
                            WHERE ID_USER = ? AND ID_ROL = ? `,
                        [data.id_user, data.id_rol],
                        (error, result) => {
                            if(result.length > 0){
                                return callback(`The role configuration with ID_USER: ${data.id_user} and ID_ROL: ${data.id_rol} already exist`, null, false);
                            }else if(result.length === 0){
                                pool.query(
                                    `
                                    INSERT
                                        INTO CONFIGURACION_ROLES
                                        (ID_USER, ID_ROL, FECHA_CREACION, HORA_CREACION)
                                    VALUES 
                                        (?, ?, CURDATE(), CURTIME()) `,
                                    [data.id_user, data.id_rol],
                                    (error, result) => {
                                        if(error){
                                            return callback(`The role configuration with ID_USER: ${data.id_user} and ID_ROL: ${data.id_rol} could not be created`, null, false);
                                        }
                                        return callback(null, result, true);
                                    }
                                )
                            }
                        }
                    )
                }
            }
        )
    },
    consultar_rolesAsiganadosUsuarios: (callback) => {
        pool.query(
            `
            SELECT 
                CR.ID_CONFIGURACION,
                U.ID_USER,
                U.NOMBRES, 
                U.APELLIDOS, 
                U.TIPO_DOC_ID, 
                U.NUMERO_DOC_ID, 
                CR.ID_ROL, 
                (SELECT 
                    NOMBRE_ROL 
                FROM ROLES R 
                WHERE ID_ROL = CR.ID_ROL) NOMBRE_ROL, 
                (SELECT 
                    DETALLES 
                FROM ROLES R 
                WHERE ID_ROL = CR.ID_ROL) DETALLES_ROL, 
                U.FECHA_CREACION, 
                U.HORA_CREACION
            FROM USER U 
            INNER JOIN 
                CONFIGURACION_ROLES CR 
                ON U.ID_USER = CR.ID_USER `,
            [],
            (error, result) => {
                if(error){
                    return callback(error, null, false);
                }
                return callback(null, result, true);
            }
        )
    },
    consultar_rolesAsiganadosUsuarios_ByNombreRol: (data, callback) => {
        data.nombre_rol = data.nombre_rol.toUpperCase();
        pool.query(
            `
            SELECT 
                CR.ID_CONFIGURACION,
                U.ID_USER,
                U.NOMBRES, 
                U.APELLIDOS, 
                U.TIPO_DOC_ID, 
                U.NUMERO_DOC_ID, 
                CR.ID_ROL, 
                (SELECT 
                    NOMBRE_ROL 
                FROM ROLES R 
                WHERE ID_ROL = CR.ID_ROL) NOMBRE_ROL, 
                (SELECT 
                    DETALLES 
                FROM ROLES R 
                WHERE ID_ROL = CR.ID_ROL) DETALLES_ROL, 
                U.FECHA_CREACION, 
                U.HORA_CREACION
            FROM USER U 
            INNER JOIN 
                CONFIGURACION_ROLES CR 
                ON U.ID_USER = CR.ID_USER
            WHERE 
                ID_ROL = (SELECT ID_ROL FROM ROLES R WHERE R.NOMBRE_ROL = ?) `,
            [data.nombre_rol],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The registers with nombre_rol: ${data.nombre_rol} were not found`, null, false);
                }else if(result.length > 0){
                    return callback(null, result, true);
                }
            }
        )
    },
    consultar_rolesAsiganadosUsuarios_ByEmail: (data, callback) => {
        data.email = data.email.toLowerCase();
        pool.query(
            `
            SELECT 
                CR.ID_CONFIGURACION,
                U.ID_USER,
                U.NOMBRES, 
                U.APELLIDOS, 
                U.TIPO_DOC_ID, 
                U.NUMERO_DOC_ID, 
                CR.ID_ROL, 
                (SELECT 
                    NOMBRE_ROL 
                FROM ROLES R 
                WHERE ID_ROL = CR.ID_ROL) NOMBRE_ROL, 
                (SELECT 
                    DETALLES 
                FROM ROLES R 
                WHERE ID_ROL = CR.ID_ROL) DETALLES_ROL, 
                U.FECHA_CREACION, 
                U.HORA_CREACION
            FROM USER U 
            INNER JOIN 
                CONFIGURACION_ROLES CR 
                ON U.ID_USER = CR.ID_USER
            WHERE 
                U.EMAIL = ? `,
            [data.email],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The register with email: ${data.nombre_rol} was not found`, null, false);
                }else if(result.length > 0){
                    return callback(null, result, true);
                }
            }
        )
    },
    eliminar_configuracionRol_ByID: (data, callback) => {
        pool.query(
            `
            SELECT * FROM CONFIGURACION_ROLES 
                WHERE ID_CONFIGURACION = ? `,
            [data.id_configuracion],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The register with ID_CONFIGURACION: ${data.id_configuracion} was not found`, null, false);
                }else if (result.length > 0){
                    pool.query(
                        `
                        DELETE FROM CONFIGURACION_ROLES 
                            WHERE ID_CONFIGURACION = ? `,
                        [data.id_configuracion],
                        (error, result) => {
                            if(error){
                                return callback(`The register with ID_CONFIGURACION: ${data.id_configuracion} could not be deleted`, null, false);
                            }
                            return callback(null, null, true);
                        }
                    )
                }
            }
        )
    }
}