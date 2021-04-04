const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

module.exports = {
    crear_configuracionUsuarios: (data, callback) => {

        const queryVerificarExistenciaEmail = `
            SELECT * FROM USUARIOS WHERE EMAIL = ?
        `;

        pool.query(
            queryVerificarExistenciaEmail,
            [data.email],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if (result.length === 0){

                    return callback(`The user with EMAIL: ${data.email} was not found`, null, false);

                }else if (result.length > 0){

                    data.nombre_microservicio = data.nombre_microservicio.toUpperCase();  
                    data.nombre_modulo = data.nombre_modulo.toUpperCase();  
            
                    const queryVerificarExistenciaMicroservicioModulo = `
                        SELECT 
                            (SELECT COUNT(*) FROM MICROSERVICIOS WHERE NOMBRE_MICROSERVICIO = ?) MICROSERVICIO_EXIST,
                            (SELECT COUNT(*) FROM MODULO WHERE NOMBRE_MODULO = ? ) MODULO_EXIST
                        FROM dual
                    `;
                    
                    pool.query(
                        queryVerificarExistenciaMicroservicioModulo,
                        [data.nombre_microservicio, data.nombre_modulo],
                        (error, result) => {
            
                            if (error){
                                return callback(`There is/are error(s), please contact with the administrator`, null, false);
                            }
                            
                            const resultToJson = JSON.parse(JSON.stringify(result))[0];
            
                            const microservicioExist = parseInt(resultToJson.MICROSERVICIO_EXIST);
                            const moduloExist = parseInt(resultToJson.MODULO_EXIST);
            
                            if (microservicioExist === 0 && moduloExist === 0){
                                return callback(`The microservice with NOMBRE_MICROSERVICIO: ${data.nombre_microservicio} and module with NOMBRE_MODULO: ${data.nombre_modulo} were not found`, null, false);
                            }else if(microservicioExist === 0){
                                return callback(`The microservice with NOMBRE_MICROSERVICIO: ${data.nombre_microservicio} was not found`, null, false);
                            }else if(moduloExist === 0){
                                return callback(`The module with NOMBRE_MODULO: ${data.nombre_modulo} was not found`, null, false);
                            }else if(microservicioExist > 0 && moduloExist > 0){
                                
                                const queryComprobarExistenciaConfiguracion = `
                                    SELECT * FROM CONFIGURACION_USUARIOS
                                        WHERE EMAIL = ? AND NOMBRE_MICROSERVICIO = ? AND NOMBRE_MODULO = ?
                                `;
            
                                pool.query(
                                    queryComprobarExistenciaConfiguracion,
                                    [data.email, data.nombre_microservicio, data.nombre_modulo],
                                    (error, result) => {

                                        if (error){
                                            return callback(`There is/are error(s), please contact with the administrator`, null, false);
                                        }
            
                                        const existenciaConfiguracionUsuario = JSON.parse(JSON.stringify(result))[0];
            
                                        if(result.length > 0){
                                            return callback(`The user configuration with EMAIL: ${data.email} and NOMBRE_MICROSERVICIO: ${data.nombre_microservicio} and NOMBRE_MODULO: ${data.nombre_modulo} already exist in the register with ID_CONFIGURACION_USUARIO: ${existenciaConfiguracionUsuario.ID_CONFIGURACION_USUARIO} `, null, false);
                                        }else if (result.length === 0){
            
                                            const queryVerificarConfiguracionMicroservicioModulo = `
                                                SELECT * FROM CONFIGURACION_MICROSERVICIOS_MODULOS
                                                    WHERE NOMBRE_MICROSERVICIO = ? AND NOMBRE_MODULO = ?
                                            `; //Verfica si la configuración del microservicio con el modulo existe, de lo contrario no se puede crear la configuracion usuarios 
                                            
                                            pool.query(
                                                queryVerificarConfiguracionMicroservicioModulo,
                                                [data.nombre_microservicio, data.nombre_modulo],
                                                (error, result) => {

                                                    if (error){
                                                        return callback(`There is/are error(s), please contact with the administrator`, null, false);
                                                    }
                                                    
                                                    if(result.length === 0){

                                                        return callback(`The microservice module configuration with NOMBRE_MICROSERVICIO: ${data.nombre_microservicio} and NOMBRE_MODULO: ${data.nombre_modulo} has not been associated in microservice module configuration, please set up this configuration first`, null, false);
                                                    
                                                    }else if(result.length > 0){
            
                                                        const queryCrearConfiguracionUsuario = `
                                                            INSERT
                                                                INTO CONFIGURACION_USUARIOS (
                                                                    ID_CONFIGURACION_USUARIO, 
                                                                    ID_USUARIO, 
                                                                    EMAIL, 
                                                                    ID_MICROSERVICIO, 
                                                                    NOMBRE_MICROSERVICIO, 
                                                                    ID_MODULO, 
                                                                    NOMBRE_MODULO, 
                                                                    FECHA_CREACION, 
                                                                    HORA_CREACION 
                                                                )
                                                                VALUES (
                                                                    UUID(), 
                                                                    (SELECT ID_USUARIO FROM USUARIOS WHERE EMAIL = ?), 
                                                                    ?,
                                                                    (SELECT ID_MICROSERVICIO FROM MICROSERVICIOS WHERE NOMBRE_MICROSERVICIO = ?),
                                                                    ?, 
                                                                    (SELECT ID_MODULO FROM MODULO WHERE NOMBRE_MODULO = ?),
                                                                    ?,
                                                                    CURDATE(), 
                                                                    CURTIME()
                                                                )
                                                        `;
                        
                                                        pool.query(
                                                            queryCrearConfiguracionUsuario,
                                                            [data.email, data.email, data.nombre_microservicio, data.nombre_microservicio, data.nombre_modulo, data.nombre_modulo],
                                                            (error, result) => {

                                                                if(error){
                                                                    return callback(`The user configuration with EMAIL: ${data.email} and NOMBRE_MICROSERVICIO: ${data.nombre_microservicio} and NOMBRE_MODULO: ${data.nombre_modulo} could not be created`, null, false);
                                                                }

                                                                return callback(null, null, true);
                                                            }
                                                        )
                                                    }
                                                }
                                            )
                                        }
                                    }
                                )
                            }
                        }
                    )
                }
            }
        )
    },
    consultar_configuracionUsuario_dinamico: (data, callback) => {

        let queryBaseConsultarConfiguracion = `
            SELECT
                ID_CONFIGURACION_USUARIO,
                CU.ID_USUARIO,
                U.NOMBRES,
                U.APELLIDOS,
                CU.EMAIL,
                CU.ID_MICROSERVICIO ID_MICROSERVICIO,
                CU.NOMBRE_MICROSERVICIO NOMBRE_MICROSERVICIO,
                M.URL_MICROSERVICIO URL_MICROSERVICIO,
                M.ALIAS_MICROSERIVICIO ALIAS_MICROSERIVICIO, 
                M.URL_ALIAS_MICROSERVICIO URL_ALIAS_MICROSERVICIO,
                M.ORDEN ORDEN_MICROSERVICIO,
                CU.ID_MODULO ID_MODULO,
                CU.NOMBRE_MODULO NOMBRE_MODULO,
                ML.URL_MODULO URL_MODULO,
                ML.ALIAS_MODULO ALIAS_MODULO,
                ML.URL_ALIAS_MODULO URL_ALIAS_MODULO,
                ML.ORDEN ORDEN_MODULO,
                CU.FECHA_CREACION FECHA_CREACION,
                CU.HORA_CREACION HORA_CREACION
            FROM CONFIGURACION_USUARIOS CU
            INNER JOIN USUARIOS U ON CU.ID_USUARIO = U.ID_USUARIO 
            INNER JOIN MICROSERVICIOS M ON CU.ID_MICROSERVICIO = M.ID_MICROSERVICIO 
            INNER JOIN MODULO ML ON CU.ID_MODULO = ML.ID_MODULO  
            ORDER BY M.ORDEN ASC, ML.ORDEN ASC          
        `;

        const queryConsultarConfiguracionDinamico = consultaDinamica(
            queryBaseConsultarConfiguracion,
            data.seleccionar,
            data.condicion,
            data.agrupar,
            data.ordenar
        );

        if(queryConsultarConfiguracionDinamico.query == null && queryConsultarConfiguracionDinamico.error === true){
            return callback(queryConsultarConfiguracionDinamico.message, null, false);
        }

        pool.query(
            queryConsultarConfiguracionDinamico.query,
            [],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){
                    return callback(`There is/are no record(s) for user configuration with the parameter(s) set`, null, false);
                }
                return callback(null, result, true);
            }
        )
    },
    eliminar_configuracionUsuario_ByID: (data, callback) => {

        const queryConsultarExistenciaConfiguracion = `
            SELECT * FROM CONFIGURACION_USUARIOS
                WHERE ID_CONFIGURACION_USUARIO = ?
        `;

        pool.query(
            queryConsultarExistenciaConfiguracion,
            [data.id_configuracion_usuario],
            (error, result) => {
                
                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){
                    return callback(`The register with ID_CONFIGURACION_USUARIO: ${data.id_configuracion_usuario} was not found`, null, false);
                }else if(result.length > 0){

                    const queryEliminarConfiguracionByID = `
                        DELETE FROM CONFIGURACION_USUARIOS
                            WHERE ID_CONFIGURACION_USUARIO = ? 
                    `;

                    pool.query(
                        queryEliminarConfiguracionByID,
                        [data.id_configuracion_usuario],
                        (error, result) => {

                            if(error){
                                return callback(`The register with ID_CONFIGURACION_USUARIO: ${data.id_configuracion_usuario} could not be deleted`, null, false);
                            }

                            return callback(null, null, true);
                        }
                    )
                }
            }
        )
    }
}