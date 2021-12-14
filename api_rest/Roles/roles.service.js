const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

module.exports = {
    crear_rol: (data, callback) => {

        const regexNombreRol = /^[A-Za-z0-9_]+$/; //Expresión regular que el nombre accepte solo estos caracteres

        if(regexNombreRol.test(data.nombre_rol) === false){
            return callback(`The register with NOMBRE_ROL: ${data.nombre_rol} contains characters not allowed, letters, numbers and underscore are allowed `, null, false);
        }

        data.nombre_rol = data.nombre_rol.toUpperCase();

        const queryConsultarExistenciaRol = `
            SELECT * FROM ROLES
            WHERE NOMBRE_ROL = ? 
        `;

        pool.query(
            queryConsultarExistenciaRol,
            [data.nombre_rol],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length > 0){

                    return callback(`The role: ${data.nombre_rol} already exist`, null, false);

                }else if(result.length === 0){

                    const queryCrearRol = `
                        INSERT
                            INTO ROLES
                            (ID_ROL, NOMBRE_ROL, DETALLES, FECHA_CREACION, HORA_CREACION)
                        VALUES
                            (UUID(), ?, ?, CURDATE(), CURTIME()) 
                    `;

                    pool.query(
                        queryCrearRol,
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
    consultar_rolesDinamico: (data, callback) => {

        const queryBaseConsultaRoles = `
            SELECT 
                ID_ROL,
                NOMBRE_ROL,
                DETALLES,
                FECHA_CREACION,
                HORA_CREACION
            FROM ROLES
        `;

        const queryConsultarRolesDinamico = consultaDinamica(
            queryBaseConsultaRoles,
            data.seleccionar,
            data.condicion,
            data.agrupar,
            data.ordenar
        );

        if(queryConsultarRolesDinamico.query == null && queryConsultarRolesDinamico.error === true){
            return callback(queryConsultarRolesDinamico.message, null, false);
        }

        pool.query(
            queryConsultarRolesDinamico.query,
            [],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){
                    return callback(`There is/are no record(s) for role module with the parameter(s) set`, null, false);
                }

                return callback(null, result, true);
            }
        )
    },
    eliminar_rol_ByID: (data, callback) => {

        const queryConsultarExistenciaRol = `
            SELECT * FROM ROLES
            WHERE ID_ROL = ? 
        `;


        pool.query(
            queryConsultarExistenciaRol,
            [data.id_rol],
            (error, result) => {
                
                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){

                    return callback(`The register with ID: ${data.id_rol} was not found`, null, false);

                } else if(result.length > 0){

                    const queryEliminarRol = `
                        DELETE FROM ROLES
                        WHERE ID_ROL = ?
                    `;

                    pool.query(
                        queryEliminarRol,
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