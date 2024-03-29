const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");
const sendEmail = require("../../shared/sendEmail");
const crypto = require("crypto");
const base64url = require("base64url");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

module.exports={
    crear_dispositivo: (data, callback)=>{
        
        data.email_responsable = data.email_responsable.toLowerCase();

        if(data.nombre_microservicio != data.microservicio_interes && data.microservicio_interes != 'GLOBAL' ){
            return callback(`El nombre del microservicio: ${data.nombre_microservicio} no coincide con el microservicio de interes: ${data.microservicio_interes}`, null, false);
        }

        const queryConsultarExistenciaUsuario = `
            SELECT * FROM USUARIOS
            WHERE EMAIL = ? 
        `;

        pool.query(
            queryConsultarExistenciaUsuario,
            [data.email_responsable],
            (error, resultDevice) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(resultDevice.length === 0){

                    return callback(`The user with email: ${data.email_responsable} was not found`, null, false);

                }else if (resultDevice.length > 0){

                    const resultDeviceToJson = JSON.parse(JSON.stringify(resultDevice))[0];

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

                                // const key = process.env.TOKEN_KEY.toString();
                                // const expiresInDispositivo = parseInt(process.env.TOKEN_EXPIRE_IN_DISPOSITIVO);

                                // const payloald = {
                                //     marca: data.marca,
                                //     referencia: data.referencia,
                                //     latitud: data.latitud,
                                //     longitud: data.longitud,
                                //     nombre_microservicio: data.nombre_microservicio,
                                //     email_responsable: data.email_responsable,
                                // }
                                
                                // const jsonTokenDispositivo = sign(payloald, key, {
                                //     expiresIn: expiresInDispositivo,
                                // });
                                
                                jwt.verify(data.token, process.env.TOKEN_KEY_DEVICES, (err, decoded) => {      
                                    if (err) {
                                        return callback(`Invalid device token for ID: ${data.id_dispositivo}`, null, false)
                                    }
                                })

                                // let passWordAletoriaEncrypted = '';
                                // let passWordAletoria = base64url(crypto.randomBytes(15));
                                // const salt = genSaltSync(10);
                                // const encriptPass = new Promise((resolve, reject)=>{
                                //     passWordAletoriaEncrypted = hashSync(passWordAletoria,salt)
                                //     resolve()
                                // })


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
                                            
                                            FECHA_CREACION, 
                                            HORA_CREACION
                                        )
                                    VALUES (
                                        ?,
                                        ?,
                                        ?,
                                        ?,
                                        ?,
                                        ?,
                                        (SELECT ID_MICROSERVICIO FROM MICROSERVICIOS WHERE NOMBRE_MICROSERVICIO = ?),
                                        ?,
                                        ?,

                                        ?, 
                                        ?
                                    )
                                `;

                                //PASSWORD,

                                pool.query(
                                    queryCrearUsuario,
                                    [
                                        data.uuid,
                                        data.token,
                                        data.marca,
                                        data.referencia,
                                        data.latitud,
                                        data.longitud,
                                        data.nombre_microservicio,
                                        data.nombre_microservicio,
                                        data.email_responsable,
                                        data.fecha_creacion,
                                        data.hora_creacion
                                    ],
                                    (error, result) =>{

                                        if(error){
                                            return callback(`The device could not be created, please contatc with IT department`, null, false)
                                        }else{
                                            sendEmail(
                                                data.email_responsable,
                                                'Creación dispositivo ResCity',
                                                `Apreciado usuario ResCity: ${resultDeviceToJson.NOMBRES} ${resultDeviceToJson.APELLIDOS}, se ha registrado un dispositivo bajo su 
                                                responsabilidad.
                                                El token del dispositivo es: ${data.token}. Recuerde que la contraseña y el token pueden ser cambiados cuando el 
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
        
        //let queryBaseConsultarDispositivos = '';

        let queryBaseConsultarDispositivos = `
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
                    DISPOSITIVO_ACTIVO,

                    FECHA_CREACION,
                    HORA_CREACION,
                    FECHA_ACTUALIZACION,
                    HORA_ACTUALIZACION
                FROM DISPOSITIVOS
            `;
        
        // PASSWORD_ACTIVA,
        // FECHA_ACTUALIZACION_PASSWORD,
        // HORA_ACTUALIZACION_PASSWORD,
            
        queryBaseConsultarDispositivos = data.microservicio_interes === 'GLOBAL' ?  queryBaseConsultarDispositivos : `${queryBaseConsultarDispositivos} WHERE NOMBRE_MICROSERVICIO = '${data.microservicio_interes}' `;
        
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

        data.email_responsable = data.email_responsable.toLowerCase();

        if(data.nombre_microservicio != data.microservicio_interes && data.microservicio_interes != 'GLOBAL' ){
            return callback(`El nombre del microservicio: ${data.nombre_microservicio} no coincide con el microservicio de interes: ${data.microservicio_interes}`, null, false);
        }

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
                        WHERE ID_DISPOSITIVO = ?
                    `;

                    queryActualizarDispositivo = data.microservicio_interes === 'GLOBAL' ?  queryActualizarDispositivo : `${queryActualizarDispositivo} AND NOMBRE_MICROSERVICIO = '${data.microservicio_interes}' `;

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

                    let queryEliminarUsuarioById = `
                        DELETE FROM DISPOSITIVOS WHERE ID_DISPOSITIVO = ?
                    `;

                    queryEliminarUsuarioById = data.microservicio_interes === 'GLOBAL' ?  queryEliminarUsuarioById : `${queryEliminarUsuarioById} AND NOMBRE_MICROSERVICIO = '${data.microservicio_interes}' `;

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
    },
    validar_estado_contrasena: (data, callback) => {
        
        const queryConsutarExistenciaDispositivo = `
            SELECT 
                ID_DISPOSITIVO,
                PASSWORD_ACTIVA,
                PASSWORD_AUTENTICACION
            FROM DISPOSITIVOS 
            WHERE 
                ID_DISPOSITIVO = ? AND EMAIL_RESPONSABLE = ?
        `;

        pool.query(
            queryConsutarExistenciaDispositivo,
            [data.id_dispositivo, data.email_responsable],
            (error, resultDevice) => {
                
                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if (resultDevice.length > 0){

                    const resultDeviceToJson = JSON.parse(JSON.stringify(resultDevice))[0];

                    if(resultDeviceToJson.PASSWORD_ACTIVA === 0 && resultDeviceToJson.PASSWORD_AUTENTICACION === null){
                        return callback(null, true, true);
                    }else{
                        return callback(null, false, true);
                    }
                }
            }
        )
    },
    solicitar_cambio_contrasena: (data, callback) => { 

        let queryConsutarExistenciaDispositivo = `
            SELECT 
                * 
            FROM DISPOSITIVOS 
            WHERE 
                ID_DISPOSITIVO = ? AND EMAIL_RESPONSABLE = ?
        `;

        queryConsutarExistenciaDispositivo = data.microservicio_interes === 'GLOBAL' ?  `${queryConsutarExistenciaDispositivo} AND NOMBRE_MICROSERVICIO = '${data.nombre_microservicio}'` : `${queryConsutarExistenciaDispositivo} AND NOMBRE_MICROSERVICIO = '${data.microservicio_interes}' `;

        pool.query(
            queryConsutarExistenciaDispositivo,
            [data.id_dispositivo, data.email_responsable],
            (error, resultDevice) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }
                
                if(resultDevice.length === 0){

                    return callback(`The device with ID_DISPOSITIVO: ${data.id_dispositivo} does not exist `, null, false);

                }else if(resultDevice.length > 0){

                    const device = JSON.parse(JSON.stringify(resultDevice))[0];

                    let passWordAletoriaEncrypted = '';
                    let passWordAletoria = base64url(crypto.randomBytes(15));
                    const salt = genSaltSync(10);
                    const encriptPass = new Promise((resolve, reject)=>{
                        passWordAletoriaEncrypted = hashSync(passWordAletoria,salt)
                        resolve()
                    })

                    encriptPass
                        .then()
                        .catch((err)=>{
                            console.log(err);
                        });

                    queryActualizarDispositivoCambioContrasena = `
                        UPDATE DISPOSITIVOS
                            SET PASSWORD = ?,
                                PASSWORD_ACTIVA = false,
                                PASSWORD_AUTENTICACION = null,
                                FECHA_ACTUALIZACION_PASSWORD = CURDATE(),
                                HORA_ACTUALIZACION_PASSWORD = CURTIME()
                            WHERE ID_DISPOSITIVO = ? AND EMAIL_RESPONSABLE = ?`;

                    queryActualizarDispositivoCambioContrasena = data.microservicio_interes === 'GLOBAL' ?  `${queryActualizarDispositivoCambioContrasena} AND NOMBRE_MICROSERVICIO = '${data.nombre_microservicio}'` : `${queryActualizarDispositivoCambioContrasena} AND NOMBRE_MICROSERVICIO = '${data.microservicio_interes}' `;
                            
                    pool.query(
                        queryActualizarDispositivoCambioContrasena,
                        [passWordAletoriaEncrypted,data.id_dispositivo,data.email_responsable],
                        (error, result) => {

                            if (error) {
                                return callback(`The device with ID_DISPOSITIVO: ${data.id_dispositivo} can not update the password`, null, false);
                            }else{
                                sendEmail(
                                    data.email_responsable,
                                    `Recuperación contraseña dispositivo con ID: ${device.ID_DISPOSITIVO} ResCity`,
                                    `Apreciado usuario ResCity, Ha solicitado recuperar la contraseña del dispositivo con ID: ${device.ID_DISPOSITIVO}. Por favor ingresar a la plataforma ResCity Core, al servicio Autenticación, al módulo Dispositivos y con la siguiente contraseña temporal: ${passWordAletoria} realice la actuliazación de la contraseña del dispositivo. Durante este periodo el dispositivo permanece inactivo hasta que realice el cambio de contraseña. Si presenta algun tipo de inconveniente comunicarse con el administrador de la plataforma. Muchas gracias.`,
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
                    )
                }
            }
        )
    },
    actualizar_contrasena: (data, callback) => { 

        data.email_responsable = data.email_responsable.toLowerCase();

        
        if(data.nombre_microservicio != data.microservicio_interes && data.microservicio_interes != 'GLOBAL' ){
            return callback(`El nombre del microservicio: ${data.nombre_microservicio} no coincide con el microservicio de interes: ${data.microservicio_interes}`, null, false);
        }
        
        let queryConsutarExistenciaDispositivo = `
            SELECT 
            * 
            FROM DISPOSITIVOS 
            WHERE ID_DISPOSITIVO = ? AND EMAIL_RESPONSABLE = ?
        `;
        
        queryConsutarExistenciaDispositivo = data.microservicio_interes === 'GLOBAL' ? `${queryConsutarExistenciaDispositivo} AND NOMBRE_MICROSERVICIO = '${data.nombre_microservicio}'` : `${queryConsutarExistenciaDispositivo} AND NOMBRE_MICROSERVICIO = '${data.microservicio_interes}'`;

        pool.query(
            queryConsutarExistenciaDispositivo,
            [data.id_dispositivo, data.email_responsable],
            (error, resultDevice) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }
                
                if(resultDevice.length === 0){

                    return callback(`The device with ID_DISPOSITIVO: ${data.id_dispositivo} does not exist `, null, false);

                }else if(resultDevice.length > 0){

                    const device = JSON.parse(JSON.stringify(resultDevice))[0];
                    
                    let result = false;

                    if (device.PASSWORD_ACTIVA === 0) {
                        result = compareSync(data.old_password, device.PASSWORD);
                    }else if (device.PASSWORD_ACTIVA === 1){
                        result = compareSync(data.old_password, device.PASSWORD_AUTENTICACION);
                    }
                
                    if(result){

                        const salt = genSaltSync(10);
                        const encriptPass = new Promise((resolve, reject)=>{
                            data.password_auth = hashSync(data.password_auth,salt)
                            resolve()
                        })

                        encriptPass
                            .then()
                            .catch((err)=>{
                                console.log(err);
                            });


                        let queryActualizarDispositivoCambioContrasena = `
                            UPDATE DISPOSITIVOS
                                SET 
                                    PASSWORD_ACTIVA = true,
                                    PASSWORD_AUTENTICACION = ?,
                                    FECHA_ACTUALIZACION_PASSWORD = CURDATE(),
                                    HORA_ACTUALIZACION_PASSWORD = CURTIME()
                            WHERE ID_DISPOSITIVO = ? AND EMAIL_RESPONSABLE = ?
                        `;

                        queryActualizarDispositivoCambioContrasena = data.microservicio_interes === 'GLOBAL' ? `${queryActualizarDispositivoCambioContrasena} AND NOMBRE_MICROSERVICIO = '${data.nombre_microservicio}'` : `${queryActualizarDispositivoCambioContrasena} AND NOMBRE_MICROSERVICIO = '${data.microservicio_interes}'`

                        pool.query(
                            queryActualizarDispositivoCambioContrasena,
                            [data.password_auth, data.id_dispositivo, data.email_responsable],
                            (error, result) => {

                                if (error) {
                                    return callback(`The device with ID_DISPOSITIVO: ${data.id_dispositivo} can not update the password`, null, false);
                                }else{
                                    sendEmail(
                                        data.email_responsable,
                                        'Cambio contraseña dispositivo ResCity',
                                        `Apreciado usuario ResCity, la contraseña del dispositivo with ID: ${data.id_dispositivo} ha sido actualizada correctamente. A partir de este momento puede publicar datos si el dispositivo esta activado por el administrador de la plataforma.`,
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
                        )
                    }else {
                        return callback(`The the old password does not match with th password saved for the ID_DISPOSITIVO: ${data.id_dispositivo}`, null, false)
                    }
                }
            }
        )
    },
    actualizar_token_dispositivo: (data, callback)=>{
        
        data.email_responsable = data.email_responsable.toLowerCase();

        if(data.nombre_microservicio != data.microservicio_interes && data.microservicio_interes != 'GLOBAL' ){
            return callback(`El nombre del microservicio: ${data.nombre_microservicio} no coincide con el microservicio de interes: ${data.microservicio_interes}`, null, false);
        }

        let queryConsutarExistenciaDispositivo = `
            SELECT 
            * 
            FROM DISPOSITIVOS 
            WHERE ID_DISPOSITIVO = ? AND EMAIL_RESPONSABLE = ?
        `;
        
        queryConsutarExistenciaDispositivo = data.microservicio_interes === 'GLOBAL' ? `${queryConsutarExistenciaDispositivo} AND NOMBRE_MICROSERVICIO = '${data.nombre_microservicio}'` : `${queryConsutarExistenciaDispositivo} AND NOMBRE_MICROSERVICIO = '${data.microservicio_interes}'`;

        pool.query(
            queryConsutarExistenciaDispositivo,
            [data.id_dispositivo, data.email_responsable],
            (error, resultDevice) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(resultDevice.length === 0){

                    return callback(`The device with ID: ${data.id_dispositivo} was not found`, null, false);

                }else if (resultDevice.length > 0){

                    const resultDeviceToJson = JSON.parse(JSON.stringify(resultDevice))[0];

                    // const key = process.env.TOKEN_KEY.toString();
                    // const expiresInDispositivo = parseInt(process.env.TOKEN_EXPIRE_IN_DISPOSITIVO);

                    // const payloald = {
                    //     marca: data.marca,
                    //     referencia: data.referencia,
                    //     latitud: data.latitud,
                    //     longitud: data.longitud,
                    //     nombre_microservicio: data.nombre_microservicio,
                    //     email_responsable: data.email_responsable,
                    // }
                    
                    // const jsonTokenDispositivo = sign(payloald, key, {
                    //     expiresIn: expiresInDispositivo,
                    // });

                    jwt.verify(data.token, process.env.TOKEN_KEY_DEVICES, (err, decoded) => {      
                        if (err) {
                            return callback(`Invalid device token for ID: ${data.id_dispositivo}`, null, false)
                        }
                    })

                    let queryActualizarTokenDispositivo = `
                        UPDATE DISPOSITIVOS
                            SET TOKEN = ?
                        WHERE ID_DISPOSITIVO = ? AND EMAIL_RESPONSABLE = ? 
                    `;

                    queryActualizarTokenDispositivo = data.microservicio_interes === 'GLOBAL' ? `${queryActualizarTokenDispositivo} AND NOMBRE_MICROSERVICIO = '${data.nombre_microservicio}'` : `${queryActualizarTokenDispositivo} AND NOMBRE_MICROSERVICIO = '${data.microservicio_interes}'`

                    pool.query(
                        queryActualizarTokenDispositivo,
                        [
                            //jsonTokenDispositivo,
                            data.token,
                            data.id_dispositivo,
                            data.email_responsable
                        ],
                        (error, result) =>{

                            if(error){
                                return callback(`There is/are error(s), please contact with the administrator`, null, false)
                            }else{
                                sendEmail(
                                    data.email_responsable,
                                    `Cambio token dispositivo: ${data.id_dispositivo} ResCity`,
                                    `Apreciado usuario ResCity, se ha solicitado el cambio de token para el dipositivo con ID: ${data.id_dispositivo}
                                    El token del dispositivo es: ${data.token}`,
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
    },
}