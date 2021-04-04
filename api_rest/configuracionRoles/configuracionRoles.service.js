const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

module.exports = {
    crear_configuracionRol: (data, callback) => {
        
        data.email = data.email.toLowerCase();
        data.nombre_rol = data.nombre_rol.toUpperCase();

        const queryVerificarExistenciaUsuarioRol =  `
            SELECT 
                (SELECT COUNT(*) FROM USUARIOS WHERE EMAIL = ?) USER_EXIST,
                (SELECT COUNT(*) FROM ROLES WHERE NOMBRE_ROL = ?) ROL_EXIST
            FROM DUAL
        `;

        pool.query(
            queryVerificarExistenciaUsuarioRol,
            [data.email, data.nombre_rol],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                const resultToJson = JSON.parse(JSON.stringify(result))[0];

                const userExist = parseInt(resultToJson.USER_EXIST);
                const rolExist = parseInt(resultToJson.ROL_EXIST);

                if (userExist === 0 && rolExist ===0){
                    return callback(`The user with EMAIL: ${data.email} and role with NOMBRE_ROL: ${data.nombre_rol} were not found`, null, false);
                }else if(userExist === 0){
                    return callback(`The user with EMAIL: ${data.email} was not found`, null, false);
                }else if(rolExist === 0){
                    return callback(`The role with NOMBRE_ROL: ${data.nombre_rol} was not found`, null, false);
                }else if(userExist > 0 && rolExist > 0){
                    
                    const queryValidarExistenciaConfiguracion = `
                        SELECT * FROM CONFIGURACION_ROLES
                        WHERE EMAIL = ? AND NOMBRE_ROL = ? 
                    `;

                    pool.query(
                        queryValidarExistenciaConfiguracion,
                        [data.email, data.nombre_rol],
                        (error, result) => {

                            if (error){
                                return callback(`There is/are error(s), please contact with the administrator`, null, false);
                            }

                            if(result.length > 0){

                                return callback(`The role configuration with EMAIL: ${data.email} and NOMBRE_ROL: ${data.nombre_rol} already exist`, null, false);
                            
                            }else if(result.length === 0){

                                const queryCerarConfiguracion = `
                                    INSERT
                                        INTO CONFIGURACION_ROLES
                                        (ID_CONFIGURACION_ROLES, ID_USUARIO, EMAIL, ID_ROL, NOMBRE_ROL, FECHA_CREACION, HORA_CREACION)
                                    VALUES 
                                        (UUID(), (SELECT ID_USUARIO FROM USUARIOS WHERE EMAIL = ?), ?, (SELECT ID_ROL FROM ROLES WHERE NOMBRE_ROL = ?), ?, CURDATE(), CURTIME())
                                `

                                pool.query(
                                    queryCerarConfiguracion,
                                    [data.email, data.email, data.nombre_rol, data.nombre_rol],
                                    (error, result) => {

                                        if(error){
                                            return callback(`The role configuration with EMAIL: ${data.email} and NOMBRE_ROL: ${data.nombre_rol} could not be created`, null, false);
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
    consultar_configuraciRoles_dinamico: (data, callback) => {
        
        const queryBaseConsultarConfiguracion = `
            SELECT 
                CR.ID_CONFIGURACION_ROLES,
                U.ID_USUARIO ,
                U.NOMBRES, 
                U.APELLIDOS, 
                U.EMAIL,
                CR.ID_ROL, 
                CR.NOMBRE_ROL, 
                (SELECT 
                    DETALLES 
                FROM ROLES R 
                WHERE ID_ROL = CR.ID_ROL) DETALLES_ROL, 
                U.FECHA_CREACION, 
                U.HORA_CREACION
            FROM USUARIOS U 
            INNER JOIN 
                CONFIGURACION_ROLES CR 
                ON U.ID_USUARIO = CR.ID_USUARIO
        `;

        const queryConsultarConfiguracion = consultaDinamica(
            queryBaseConsultarConfiguracion,
            data.seleccionar,
            data.condicion,
            data.agrupar,
            data.ordenar
        );

        if(queryConsultarConfiguracion.query == null && queryConsultarConfiguracion.error === true){
            return callback(queryConsultarConfiguracion.message, null, false);
        }

        pool.query(
            queryConsultarConfiguracion.query,
            [],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){
                    return callback(`There is/are no record(s) for role configuration with the parameter(s) set`, null, false);
                }

                return callback(null, result, true);
            }
        )
    },
    eliminar_configuracionRol_ByID: (data, callback) => {

        const queryValidarExistenciaConfiguracion = `
            SELECT * FROM CONFIGURACION_ROLES
            WHERE ID_CONFIGURACION_ROLES = ? 
        `;

        pool.query(
            queryValidarExistenciaConfiguracion,
            [data.id_configuracion_roles],
            (error, result) => {
                
                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){

                    return callback(`The register with ID_CONFIGURACION_ROLES: ${data.id_configuracion_roles} was not found`, null, false);

                }else if (result.length > 0){

                    const queryEliminarConfiguracion = `
                        DELETE FROM CONFIGURACION_ROLES 
                        WHERE ID_CONFIGURACION_ROLES = ? 
                    `

                    pool.query(
                        queryEliminarConfiguracion,
                        [data.id_configuracion_roles],
                        (error, result) => {
                            
                            if (error){
                                return callback(`There is/are error(s), please contact with the administrator`, null, false);
                            }

                            if(error){
                                return callback(`The register with ID_CONFIGURACION_ROLES: ${data.id_configuracion_roles} could not be deleted`, null, false);
                            }

                            return callback(null, null, true);
                        }
                    )
                }
            }
        )
    }
}