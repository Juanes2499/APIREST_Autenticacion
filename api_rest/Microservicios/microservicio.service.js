const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

module.exports = {
    crear_microservicio: (data, callback) => {
        
        const regexNombreMicroservicio = /^[A-Za-z0-9_]+$/; //Expresión regular que el nombre accepte solo estos caracteres

        if(regexNombreMicroservicio.test(data.nombre_microservicio) === false){
            return callback(`The register with NOMBRE_MODULO: ${data.nombre_microservicio} contains characters not allowed, letters, numbers and underscore are allowed `, null, false);
        }

        data.nombre_microservicio = data.nombre_microservicio.toUpperCase();

        const queryConsultarExisteciaMicroservicio = `
            SELECT * FROM MICROSERVICIOS 
                WHERE NOMBRE_MICROSERVICIO = ?
        `;

        pool.query(
            queryConsultarExisteciaMicroservicio,
            [data.nombre_microservicio],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length > 0){
                    return callback(`The microservice: ${data.nombre_microservicio} already exist`,  null, false);
                }else if(result.length === 0){
                    
                    const queryCrearMicroservicio = `
                        INSERT 
                            INTO MICROSERVICIOS
                            (ID_MICROSERVICIO, NOMBRE_MICROSERVICIO, DETALLES, URL_MICROSERVICIO, FECHA_CREACION, HORA_CREACION)
                        VALUES
                            (UUID(), ?, ?, ?, CURDATE(), CURTIME())
                    `;

                    pool.query(
                        queryCrearMicroservicio,
                        [data.nombre_microservicio, data.detalles, data.url_microservicio],
                        (error, result) => {

                            if(error){
                                return callback(`The microservice: ${data.nombre_microservicio} could not be created`, null, false);
                            }

                            return callback(null, null, true);
                        }
                    )
                }
            }
        )
    },
    consultar_microservicioDinamico: (data, callback) => {
        
        const queryBaseConsultarMicroservicio = `
            SELECT 
                ID_MICROSERVICIO,
                NOMBRE_MICROSERVICIO,
                DETALLES,
                URL_MICROSERVICIO,
                FECHA_CREACION,
                HORA_CREACION,
                FECHA_ACTUALIZACION,
                HORA_ACTUALIZACION
            FROM MICROSERVICIOS
        `;

        const queryConsultarMicroservicioDinamico = consultaDinamica(
            queryBaseConsultarMicroservicio,
            data.seleccionar,
            data.condicion,
            data.agrupar,
            data.ordenar
        );

        if(queryConsultarMicroservicioDinamico.query == null && queryConsultarMicroservicioDinamico.error === true){
            return callback(queryConsultarMicroservicioDinamico.message, null, false);
        }

        pool.query(
            queryConsultarMicroservicioDinamico.query,
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
    actualizar_microservicio_ByID: (data, callback) => {

        const regexNombreMicroservicio = /^[A-Za-z0-9_]+$/; //Expresión regular que el nombre accepte solo estos caracteres

        if(regexNombreMicroservicio.test(data.nombre_microservicio) === false){
            return callback(`The register with NOMBRE_MODULO: ${data.nombre_microservicio} contains characters not allowed, letters, numbers and underscore are allowed `, null, false);
        }

        data.nombre_microservicio = data.nombre_microservicio.toUpperCase();

        const queryConsultarExisteciaMicroservicio = `
            SELECT * FROM MICROSERVICIOS 
                WHERE ID_MICROSERVICIO = ?
        `;

        pool.query(
            queryConsultarExisteciaMicroservicio,
            [data.id_microservicio],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){
                    
                    return callback(`The register with ID_MICROSERVICIO: ${data.id_microservicio} was not found`, null, false);

                }else if(result.length > 0){

                    //Verificar si al actualizar no existe una variable igual
                    const queryComprobarExistenciaMicroservicioAntesActualizar = `
                        SELECT * FROM MICROSERVICIOS
                            WHERE NOMBRE_MICROSERVICIO = ? 
                    `;

                    pool.query(
                        queryComprobarExistenciaMicroservicioAntesActualizar,
                        [data.nombre_microservicio],
                        (error, result) => {

                            if (error){
                                return callback(`There is/are error(s), please contact with the administrator`, null, false);
                            }

                            const existenciaMicroservicioJson = JSON.parse(JSON.stringify(result))[0] ? JSON.parse(JSON.stringify(result))[0] : {ID_MICROSERVICIO: data.id_microservicio} ;

                            if(existenciaMicroservicioJson.ID_MICROSERVICIO != data.id_microservicio){
                                return callback(`The microservice with ID_MICROSERVICIO: ${data.id_microservicio} and NOMBRE_MICROSERVICIO: ${data.nombre_microservicio} already exist in the microservice register with NOMBRE_MICROSERVICIO: ${existenciaMicroservicioJson.ID_MICROSERVICIO}`, null, false);
                            }else if(existenciaMicroservicioJson.ID_MICROSERVICIO === data.id_microservicio){

                                const queryActualizarMicroservicio = `
                                    UPDATE MICROSERVICIOS
                                        SET 
                                            NOMBRE_MICROSERVICIO = ?,
                                            DETALLES = ?,
                                            URL_MICROSERVICIO = ?,
                                            FECHA_ACTUALIZACION = CURDATE(),
                                            HORA_ACTUALIZACION = CURTIME()
                                        WHERE ID_MICROSERVICIO = ?
                                `;
            
                                pool.query(
                                    queryActualizarMicroservicio,
                                    [data.nombre_microservicio, data.detalles, data.url_microservicio, data.id_microservicio],
                                    (error, result) => {

                                        if(error){
                                            return callback(`The register with ID_VARIABLE: ${data.id_variable} could not be updated`, '02VNS_03PUT_PUT06', null, false);
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
    eliminar_microservicio_byId: (data, callback) => {

        const queryConsultarMicroservicio = `
            SELECT * FROM MICROSERVICIOS
                WHERE ID_MICROSERVICIO = ?
        `;

        pool.query(
            queryConsultarMicroservicio,
            [data.id_microservicio],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){

                    return callback(`The register with ID_MICROSERVICIO: ${data.id_microservicio} was not found`, null, false);
                    
                }else if(result.length > 0){

                    const queryEliminarMicroservicio = `
                        DELETE FROM MICROSERVICIOS
                            WHERE ID_MICROSERVICIO = ?
                    `;

                    pool.query(
                        queryEliminarMicroservicio,
                        [data.id_microservicio],
                        (error, result) => {

                            if(error){
                                return callback(`The register with ID_MICROSERVICIO: ${data.id_microservicio} could not be deleted`, null, false);
                            }

                            return callback(null, null, true);
                        }
                    )
                }
            }
        )
    }
}