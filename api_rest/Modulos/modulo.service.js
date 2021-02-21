const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

module.exports = {
    crear_modulo: (data, callback) => {
        
        const regexNombreModulo = /^[A-Za-z0-9_]+$/; //Expresión regular que el nombre accepte solo estos caracteres

        if(regexNombreModulo.test(data.nombre_modulo) === false){
            return callback(`The register with NOMBRE_MODULO: ${data.nombre_modulo} contains characters not allowed, letters, numbers and underscore are allowed `, null, false);
        }

        data.nombre_modulo = data.nombre_modulo.toUpperCase();

        const queryConsultarExisteciaModulo = `
            SELECT * FROM MODULO 
                WHERE NOMBRE_MODULO = ?
        `;

        pool.query(
            queryConsultarExisteciaModulo,
            [data.nombre_modulo],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length > 0){
                    return callback(`The module with NOMBRE_MODULO: ${data.nombre_modulo} already exist`,  null, false);
                }else if(result.length === 0){
                    
                    const queryCrearModulo = `
                        INSERT 
                            INTO MODULO
                            (ID_MODULO, NOMBRE_MODULO, DETALLES, URL_MODULO, ALIAS_MODULO, URL_ALIAS_MODULO, ORDEN, FECHA_CREACION, HORA_CREACION)
                        VALUES
                            (UUID(), ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME())
                    `;

                    pool.query(
                        queryCrearModulo,
                        [data.nombre_modulo, data.detalles, data.url_modulo, data.alias_modulo, data.url_alias_modulo, data.orden],
                        (error, result) => {

                            if(error){
                                return callback(`The module with NOMBRE_MODULO: ${data.nombre_microservicio} could not be created`, null, false);
                            }

                            return callback(null, null, true);
                        }
                    )
                }
            }
        )
    },
    consultar_moduloDinamico: (data, callback) => {
        
        const queryBaseConsultarModulo = `
            SELECT 
                ID_MODULO,
                NOMBRE_MODULO,
                DETALLES,
                URL_MODULO,
                ALIAS_MODULO,
                URL_ALIAS_MODULO,
                ORDEN,
                FECHA_CREACION,
                HORA_CREACION,
                FECHA_ACTUALIZACION,
                HORA_ACTUALIZACION
            FROM MODULO
        `;

        const queryConsultarModuloDinamico = consultaDinamica(
            queryBaseConsultarModulo,
            data.seleccionar,
            data.condicion,
            data.agrupar,
            data.ordenar
        );

        if(queryConsultarModuloDinamico.query == null && queryConsultarModuloDinamico.error === true){
            return callback(queryConsultarModuloDinamico.message, null, false);
        }

        pool.query(
            queryConsultarModuloDinamico.query,
            [],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){
                    return callback(`There is/are no record(s) for microservice module with the parameter(s) set`, null, false);
                }

                return callback(null, result, true);
            }
        )
    },
    actualizar_modulo_ByID: (data, callback) => {

        const regexNombreModulo = /^[A-Za-z0-9_]+$/; //Expresión regular que el nombre accepte solo estos caracteres

        if(regexNombreModulo.test(data.nombre_modulo) === false){
            return callback(`The register with NOMBRE_MODULO: ${data.nombre_modulo} contains characters not allowed, letters, numbers and underscore are allowed `, null, false);
        }

        data.nombre_modulo = data.nombre_modulo.toUpperCase();

        const queryConsultarExisteciaModulo = `
            SELECT * FROM MODULO 
                WHERE ID_MODULO = ?
        `;

        pool.query(
            queryConsultarExisteciaModulo,
            [data.id_modulo],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){
                    
                    return callback(`The register with ID_MODULO: ${data.id_modulo} was not found`, null, false);

                }else if(result.length > 0){

                    //Verificar si al actualizar no existe una modulo igual
                    const queryComprobarExistenciaModuloAntesActualizar = `
                        SELECT * FROM MODULO
                            WHERE NOMBRE_MODULO = ? 
                    `;

                    pool.query(
                        queryComprobarExistenciaModuloAntesActualizar,
                        [data.nombre_modulo],
                        (error, result) => {

                            if (error){
                                return callback(`There is/are error(s), please contact with the administrator`, null, false);
                            }

                            const existenciaModuloJson = JSON.parse(JSON.stringify(result))[0] ? JSON.parse(JSON.stringify(result))[0] : {ID_MODULO: data.id_modulo} ;

                            if(existenciaModuloJson.ID_MODULO != data.id_modulo){
                                return callback(`The moduloe with ID_MODULO: ${data.id_modulo} and NOMBRE_MODULO: ${data.nombre_modulo} already exist in the module register with ID_MODULO: ${existenciaModuloJson.ID_MODULO}`, null, false);
                            }else if(existenciaModuloJson.ID_MODULO === data.id_modulo){

                                const queryActualizarMicroservicio = `
                                    UPDATE MODULO
                                        SET 
                                            NOMBRE_MODULO = ?,
                                            DETALLES = ?,
                                            URL_MODULO = ?,
                                            ALIAS_MODULO = ?,
                                            URL_ALIAS_MODULO = ?,
                                            ORDEN = ?,
                                            FECHA_ACTUALIZACION = CURDATE(),
                                            HORA_ACTUALIZACION = CURTIME()
                                        WHERE ID_MODULO = ?
                                `;
            
                                pool.query(
                                    queryActualizarMicroservicio,
                                    [data.nombre_modulo, data.detalles, data.url_modulo, data.alias_modulo, data.url_alias_modulo, data.orden, data.id_modulo],
                                    (error, result) => {

                                        if(error){
                                            return callback(`The register with ID_MODULO: ${data.id_modulo} could not be updated`, null, false);
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
    eliminar_modulo_byId: (data, callback) => {

        const queryConsultarExisteciaModulo = `
            SELECT * FROM MODULO 
                WHERE ID_MODULO = ?
        `;

        pool.query(
            queryConsultarExisteciaModulo,
            [data.id_modulo],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){

                    return callback(`The register with ID_MODULO: ${data.id_modulo} was not found`, null, false);
                    
                }else if(result.length > 0){

                    const queryEliminarModulo = `
                        DELETE FROM MODULO
                            WHERE ID_MODULO = ?
                    `;

                    pool.query(
                        queryEliminarModulo,
                        [data.id_modulo],
                        (error, result) => {

                            if(error){
                                return callback(`The register with ID_MODULO: ${data.id_modulo} could not be deleted`, null, false);
                            }

                            return callback(null, null, true);
                        }
                    )
                }
            }
        )
    }
}