const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

module.exports = {
    crear_configuracioMicroservicioModulo: (data, callback) => {

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
                        SELECT * FROM CONFIGURACION_MICROSERVICIOS_MODULOS
                            WHERE NOMBRE_MICROSERVICIO = ? AND NOMBRE_MODULO = ?
                    `;

                    pool.query(
                        queryComprobarExistenciaConfiguracion,
                        [data.nombre_microservicio, data.nombre_modulo],
                        (error, result) => {

                            if (error){
                                return callback(`There is/are error(s), please contact with the administrator`, null, false);
                            }

                            const existenciaConfiguracionVarJson = JSON.parse(JSON.stringify(result))[0];

                            if(result.length > 0){
                                return callback(`The microservice module configuration with NOMBRE_MICROSERVICIO: ${data.nombre_microservicio} and NOMBRE_MODULO: ${data.nombre_modulo} already exist in the register with ID_CONFIGURACION: ${existenciaConfiguracionVarJson.ID_CONFIGURACION}`, null, false);
                            }else if(result.length === 0){

                                const queryCrearConfiguracionMicroservicioModulo = `
                                    INSERT
                                        INTO CONFIGURACION_MICROSERVICIOS_MODULOS
                                        (ID_CONFIGURACION, ID_MICROSERVICIO, NOMBRE_MICROSERVICIO, ID_MODULO, NOMBRE_MODULO, FECHA_CREACION, HORA_CREACION)
                                    VALUES
                                        (UUID(), (SELECT ID_MICROSERVICIO FROM MICROSERVICIOS WHERE NOMBRE_MICROSERVICIO = ?), ?, (SELECT ID_MODULO FROM MODULO WHERE NOMBRE_MODULO = ?), ?, CURDATE(), CURTIME())
                                `;

                                pool.query(
                                    queryCrearConfiguracionMicroservicioModulo,
                                    [data.nombre_microservicio, data.nombre_microservicio, data.nombre_modulo, data.nombre_modulo],
                                    (error, result) => {

                                        if(error){
                                            return callback(`The microservice module configuration with NOMBRE_MICROSERVICIO: ${data.nombre_microservicio} and NOMBRE_MODULO: ${data.nombre_modulo} could not be created`, null, false);
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
    },
    consultar_configuracioMicroservicioModulo_dinamico: (data, callback) => {

        const queryBaseConsultarConfiguracion = `
            SELECT
                ID_CONFIGURACION,
                CMM.ID_MICROSERVICIO ID_MICROSERVICIO,
                CMM.NOMBRE_MICROSERVICIO NOMBRE_MICROSERVICIO,
                M.URL_MICROSERVICIO URL_MICROSERVICIO,
                M.ALIAS_MICROSERIVICIO ALIAS_MICROSERIVICIO, 
                M.URL_ALIAS_MICROSERVICIO URL_ALIAS_MICROSERVICIO,
                M.ICON_MICROSERVICIO ICON_MICROSERVICIO,
                M.ORDEN ORDEN_MICROSERVICIO,
                CMM.ID_MODULO ID_MODULO,
                CMM.NOMBRE_MODULO NOMBRE_MODULO,
                ML.URL_MODULO URL_MODULO,
                ML.ALIAS_MODULO ALIAS_MODULO,
                ML.URL_ALIAS_MODULO URL_ALIAS_MODULO,
                ML.ICON_MODULO ICON_MODULO,
                ML.ORDEN ORDEN_MODULO,
                CMM.FECHA_CREACION FECHA_CREACION,
                CMM.HORA_CREACION HORA_CREACION
            FROM CONFIGURACION_MICROSERVICIOS_MODULOS CMM
            INNER JOIN MICROSERVICIOS M ON CMM.ID_MICROSERVICIO = M.ID_MICROSERVICIO 
            INNER JOIN MODULO ML ON CMM.ID_MODULO = ML.ID_MODULO
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
                    return callback(`There is/are no record(s) for microservice module configuration with the parameter(s) set`, null, false);
                }
                return callback(null, result, true);
            }
        )
    },
    eliminar_configuracioMicroservicioModulo_ByID: (data, callback) => {

        const queryConsultarExistenciaConfiguracion = `
            SELECT * FROM CONFIGURACION_MICROSERVICIOS_MODULOS
                WHERE ID_CONFIGURACION = ?
        `;

        pool.query(
            queryConsultarExistenciaConfiguracion,
            [data.id_configuracion],
            (error, result) => {
                
                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){
                    return callback(`The register with ID_CONFIGURACION: ${data.id_configuracion} was not found`, null, false);
                }else if(result.length > 0){

                    const queryEliminarConfiguracionByID = `
                        DELETE FROM CONFIGURACION_MICROSERVICIOS_MODULOS
                            WHERE ID_CONFIGURACION = ? 
                    `;

                    pool.query(
                        queryEliminarConfiguracionByID,
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