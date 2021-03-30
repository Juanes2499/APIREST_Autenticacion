const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");
const sendEmail = require("../../shared/sendEmail");
const crypto = require("crypto");
const base64url = require("base64url");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports={
    crear_dispositivo: (data, callback)=>{
        
        data.email = data.email.toLowerCase();

        const queryConsultarExistenciaUsuario = `
            SELECT * FROM USUARIOS
            WHERE EMAIL = ? 
        `;

        pool.query(
            queryConsultarExistenciaUsuario,
            [data.email_responsable],
            (error, resultUser) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(resultUser.length === 0){

                    return callback(`The user with email: ${data.email_responsable} was not found`, null, false);

                }else if (resultUser.length > 0){

                    const resultUserToJson = JSON.parse(JSON.stringify(resultUser))[0];

                    const queryVerificarExistenciaMicroservicio = `
                        SELECT 
                            (SELECT COUNT(*) FROM MICROSERVICIOS WHERE NOMBRE_MICROSERVICIO = ?) MICROSERVICIO_EXIST
                        FROM dual
                    `;

                    pool.query(
                        queryVerificarExistenciaMicroservicio,
                        [data.nombre_microservicio],
                        (error, result) => {

                            if (error){
                                return callback(`There is/are error(s), please contact with the administrator`, null, false);
                            }
                            
                            const resultToJson = JSON.parse(JSON.stringify(result))[0];

                            const microservicioExist = parseInt(resultToJson.MICROSERVICIO_EXIST); 

                            if(microservicioExist === 0){
                                return callback(`The microservice with NOMBRE_MICROSERVICIO: ${data.nombre_microservicio} was not found`, null, false);
                            }else if(microservicioExist > 0 ){

                                const key = process.env.TOKEN_KEY.toString();
                                const expiresInDispositivo = parseInt(process.env.TOKEN_EXPIRE_IN_DISPOSITIVO);

                                const jsonTokenDispositivo = sign(payloald, key, {
                                    expiresIn: expiresInDispositivo,
                                });
                                
                                let passWordAletoriaEncrypted = '';
                                let passWordAletoria = base64url(crypto.randomBytes(15));
                                const salt = genSaltSync(10);
                                const encriptPass = new Promise((resolve, reject)=>{
                                    passWordAletoriaEncrypted = hashSync(passWordAletoria,salt)
                                    resolve()
                                })

                                const queryCrearUsuario = `
                                    INSERT 
                                        INTO DISPOSITIVOS (
                                            ID_DISPOSITIVO, 
                                            TOKEN, 
                                            MARCA,
                                            REFERENCIA, 
                                            LATITUD, 
                                            LONGITUD,
                                            ID_MICROSERVICIO, 
                                            NOMBRE_MICROSERVICIO,
                                            EMAIL_RESPONSABLE,
                                            PASSWORD,
                                            FECHA_CREACION, 
                                            HORA_CREACION,
                                        )
                                    VALUES (
                                        UUID(),
                                        ?,
                                        ?,
                                        ?,
                                        ?,
                                        ?,
                                        (SELECT ID_MICROSERVICIO FROM MICROSERVICIOS WHERE NOMBRE_MICROSERVICIO = ?),
                                        ?,
                                        ?,
                                        ?, 
                                        CURDATE(), 
                                        CURTIME()
                                    )
                                `;

                                pool.query(
                                    queryCrearUsuario,
                                    [
                                        jsonTokenDispositivo,
                                        data.marca,
                                        data.referencia,
                                        data.latitud,
                                        data.longitud,
                                        data.nombre_microservicio,
                                        data.nombre_microservicio,
                                        data.email_responsable,
                                        passWordAletoriaEncrypted
                                    ],
                                    (error, result) =>{

                                        if(error){
                                            return callback(`The device could not be created, please contatc with IT department`, null, false)
                                        }else{
                                            sendEmail(
                                                data.email,
                                                'Creación dispositivo ResCity',
                                                `Apreciado usuario ResCity: ${resultUserToJson.NOMBRES} ${resultUserToJson.APELLIDOS}, se ha registrado un dispositivo bajo su 
                                                responsabilidad, por favor cambiar la contraseña del dispositivo usando esta contraseña inicial: ${passWordAletoriaEncrypted}. 
                                                El token del dispositivo es: ${jsonTokenDispositivo}. Recuerde que la contraseña y el token pueden ser cambiados cuando el 
                                                usuario lo desee. el ID del dispositivo, el token y la contraseña son necesarias para para el envío de datos.`,
                                                (result) => {
                                                    if(result === false) {
                                                        return callback('Email could not be sended', null, false)
                                                    }else{
                                                        return callback(null, null, true)
                                                    }
                                                }
                                            )
                                        }
                                    }
                                );
                            }
                        }
                    )
                }
            }
        )
    },
    consultar_dispositivos: (data, callback) =>{

        const queryBaseConsultarDispositivos = `
            SELECT
                ID_DISPOSITIVO,
                TOKEN,
                MARCA,
                REFERENCIA,
                LATITUD,
                LONGITUD,
                ID_MICROSERVICIO,
                NOMBRE_MICROSERVICIO,
                EMAIL_RESPONSABLE,
                PASSWORD_ACTIVA,
                DISPOSITIVO_ACTIVO,
                FECHA_ACTUALIZACION_PASSWORD,
                HORA_ACTUALIZACION_PASSWORD,
                FECHA_CREACION,
                HORA_CREACION,
                FECHA_ACTUALIZACION,
                HORA_ACTUALIZACION
            FROM USUARIOS
        `;

        const queryConsultarDispositivos = consultaDinamica(
            queryBaseConsultarDispositivos,
            data.seleccionar,
            data.condicion,
            data.agrupar,
            data.ordenar
        );

        if(queryConsultarDispositivos.query == null && queryConsultarDispositivos.error === true){
            return callback(queryConsultarDispositivos.message, null, false);
        }

        pool.query(
            queryConsultarDispositivos.query,
            [],
            (error, result) =>{

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){
                    return callback(`There is/are no record(s) for users module with the parameter(s) set`, null, false);
                }

                return callback(null, result, true);
            }
        );
    },
    actualizar_dispositivo_byId: (data, callBack) => {

        data.email = data.email.toLowerCase();

        const queryConsutarExistenciaDispositivo = `
            SELECT 
                * 
            FROM DISPOSITIVOS 
            WHERE 
                ID_DISPOSITIVO = ?
        `;

        pool.query(
            queryConsutarExistenciaDispositivo,
            [data.id_dispositivo],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){
                    return callback(`The device with ID_DISPOSITIVO ${data.id_dispositivo} does not exist `, null, false);
                }else if (result.length > 0){

                    let queryActualizarDispositivo = `
                        UPDATE DISPOSITIVOS
                            SET 
                                MARCA = ?,
                                REFERENCIA = ?,
                                LATITUD = ?,
                                LONGITUD = ?,
                                ID_MICROSERVICIO = (SELECT ID_MICROSERVICIO FROM MICROSERVICIOS WHERE NOMBRE_MICROSERVICIO = ?),
                                NOMBRE_MICROSERVICIO = ?,
                                EMAIL_RESPONSABLE = ?,
                                DISPOSITIVO_ACTIVO = ?,
                                FECHA_ACTUALIZACION = CURDATE(),
                                HORA_ACTUALIZACION = CURTIME()
                        WHERE ID_DISPOSITIVO = ?`;

                    let arrayParams = [
                        data.marca,
                        data.referencia,
                        data.latitud,
                        data.longitud,
                        data.nombre_microservicio,
                        data.nombre_microservicio,
                        data.email_responsable,
                        data.dispositivo_activo,
                        data.id_dispositivo
                    ]
           
                    pool.query(
                        queryActualizarDispositivo,
                        arrayParams,
                        (error, result) => {

                        if (error) {
                            return callback(`The register with ID_DISPOSITIVO: ${data.id_dispositivo} could not be updated`, null, false);
                        }

                        return callBack(null, null, true);
                      }
                    )
                }
            }
        )
    },
    eliminar_dispositivo_byId: (data, callback) => {

        const queryConsutarExistenciaDispositivo = `
            SELECT 
                * 
            FROM DISPOSITIVOS 
            WHERE 
                ID_DISPOSITIVO = ?
        `;

        pool.query(
            queryConsutarExistenciaDispositivo,
            [data.id_dispositivo],
            (error, result) => {

                if (error) {
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){

                    return callback(`The user with ID_DISPOSITIVO ${data.id_dispositivo} does not exist `, null, false);

                }else if (result.length > 0){

                    const queryEliminarUsuarioById = `
                        DELETE FROM DISPOSITIVOS WHERE ID_DISPOSITIVO = ?
                    `;

                    pool.query(
                        queryEliminarUsuarioById,
                        [data.id_dispositivo],
                        (error, result) => {

                            if (error) {
                                return callback(`The register with ID_DISPOSITIVO: ${data.id_dispositivo} could not be deleted`, null, false);
                            }

                            return callback(null, null, true);
                        }
                    );
                }
            }
        )
    }
}