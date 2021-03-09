const pool = require("../../config/database");
const sendEmail = require("../../shared/sendEmail");
const crypto = require("crypto");
const base64url = require("base64url");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");

module.exports ={
    autenticar_ByEmail: (data, callback) => {
        
        const queryConsultarUsuario = ` 
            SELECT 
                U.ID_USUARIO,
                U.NOMBRES,
                U.APELLIDOS,
                U.EMAIL,
                U.PASSWORD,
                U.ACTIVO,
                U.FECHA_CREACION, 
                U.HORA_CREACION
            FROM USUARIOS U 
            WHERE 
                U.EMAIL = ?
        `;

        pool.query(
            queryConsultarUsuario,
            [data.email],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }
                
                if(result.length === 0){

                    return callback(`The user with email: ${data.email} does not exist `, null, false);

                }else if(result.length > 0){

                    const resultToJson = JSON.parse(JSON.stringify(result));

                    const LoginJson = resultToJson[0];

                    if(LoginJson.ACTIVO === 1){

                        const queryRoles = `
                            SELECT 
                                CR.ID_CONFIGURACION_ROLES,
                                U.ID_USUARIO ,
                                U.EMAIL,
                                CR.ID_ROL, 
                                CR.NOMBRE_ROL,
                                U.FECHA_CREACION, 
                                U.HORA_CREACION
                            FROM CONFIGURACION_ROLES CR 
                            INNER JOIN USUARIOS U ON CR.ID_USUARIO = U.ID_USUARIO
                            WHERE U.EMAIL = ?
                        `;

                        pool.query(
                            queryRoles
                            ,
                            [data.email],
                            (error, result) => {

                                if (error){
                                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                                }

                                if(result.length === 0) {

                                    LoginJson[`ROLES`] = `The user with email: ${data.email} does not have any role asigned`

                                }else if(result.length > 0){

                                    const resultConfiguracionRolesToJson = JSON.parse(JSON.stringify(result));
                
                                    let arrayroles = [];

                                    let i = 0;
                                    resultConfiguracionRolesToJson.forEach(x => {
                                        arrayroles[i] = x.NOMBRE_ROL
                                        i += 1;
                                    });

                                    let arrayrolesSinDuplicados = arrayroles.filter((v, i, a) => a.indexOf(v) === i); //Eliminar duplicados

                                    let roles = {};

                                    arrayrolesSinDuplicados.forEach(x => {
                                        roles[`ROL_${x}`] = true;
                                    })
                                    
                                    LoginJson['ROLES'] = roles;
                                }
                            }
                        )

                        const queryConfiguracionUsuario =  `
                            SELECT
                                ID_CONFIGURACION_USUARIO,
                                CU.ID_USUARIO,
                                U.NOMBRES,
                                U.APELLIDOS,
                                CU.EMAIL,
                                CU.ID_MICROSERVICIO ID_MICROSERVICIO,
                                CU.NOMBRE_MICROSERVICIO NOMBRE_MICROSERVICIO,
                                M.URL_MICROSERVICIO URL_MICROSERVICIO,
                                CU.ID_MODULO ID_MODULO,
                                CU.NOMBRE_MODULO NOMBRE_MODULO,
                                ML.URL_MODULO URL_MODULO,
                                CU.FECHA_CREACION FECHA_CREACION,
                                CU.HORA_CREACION HORA_CREACION
                            FROM CONFIGURACION_USUARIOS CU
                            INNER JOIN USUARIOS U ON CU.ID_USUARIO = U.ID_USUARIO 
                            INNER JOIN MICROSERVICIOS M ON CU.ID_MICROSERVICIO = M.ID_MICROSERVICIO 
                            INNER JOIN MODULO ML ON CU.ID_MODULO = ML.ID_MODULO
                            WHERE 
                                CU.EMAIL = ?  
                            ORDER BY M.ORDEN ASC, ML.ORDEN
                        `;

                        pool.query(
                            queryConfiguracionUsuario
                            ,
                            [data.email],
                            (error, result) => {

                                if (error){
                                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                                }

                                if(result.length === 0) {

                                    LoginJson[`PERMISOS`] = `The user with email: ${data.email} does not have any permission asigned`

                                }else if(result.length > 0){
                                    
                                    const resultConfiguracionUsuarioToJson = JSON.parse(JSON.stringify(result));

                                    let arrayMicroservicios = [];

                                    let i = 0;
                                    resultConfiguracionUsuarioToJson.forEach(x => {
                                        arrayMicroservicios[i] = x.NOMBRE_MICROSERVICIO
                                        i += 1;
                                    });

                                    let arrayMicroserviciosSinDuplicados = arrayMicroservicios.filter((v, i, a) => a.indexOf(v) === i); //Eliminar duplicados

                                    let permisosMicroservicio = {};

                                    arrayMicroserviciosSinDuplicados.forEach(x => {
                                    
                                        let modulosFiltradosPorMicroservicio = resultConfiguracionUsuarioToJson.filter(i => {
                                            if (i.NOMBRE_MICROSERVICIO === x){
                                                return i.NOMBRE_MODULO;
                                            }
                                        })

                                        let permisosModulos = {};
                                        modulosFiltradosPorMicroservicio.forEach(k => {
                                            permisosModulos[`MOD_${k.NOMBRE_MODULO}`] = true;
                                        })

                                        permisosMicroservicio[`MS_${x}`] = permisosModulos;

                                        //LoginJson[`MS_${x}`] = permisosModulos;
                                        LoginJson['PERMISOS'] = permisosMicroservicio;
                                    
                                    })
                                }
                                
                                return callback(null, LoginJson, true);
                            }
                        );
                    }else if(LoginJson.ACTIVO === 0){
                        return callback(`The user with email: ${data.email} is not active `, null, false);
                    }
                }
            }
        )
    },
    solicitar_cambio_contrasena: (data, callback) => { 

        const queryConsultarUsuario = ` 
            SELECT 
                NOMBRES,
                APELLIDOS
            FROM USUARIOS U 
            WHERE 
                U.EMAIL = ?
        `;

        pool.query(
            queryConsultarUsuario,
            [data.email],
            (error, resultUser) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }
                
                if(resultUser.length === 0){

                    return callback(`The user with email: ${data.email} does not exist `, null, false);

                }else if(resultUser.length > 0){

                    const usuario = JSON.parse(JSON.stringify(resultUser))[0];

                    let passWordAletoria = base64url(crypto.randomBytes(15));

                    let passWordAletoriaEncrypted = '';

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

                    queryActualizarUsuarioCambioContrasena = `
                        UPDATE USUARIOS
                            SET PASSWORD = ?,
                                PASSWORD_ACTIVA = false,
                                PASSWORD_AUTENTICACION = null,
                                ACTIVO = false,
                                FECHA_ACTUALIZACION_PASSWORD = CURDATE(),
                                HORA_ACTUALIZACION_PASSWORD = CURTIME()
                            WHERE EMAIL = ?`;

                    pool.query(
                        queryActualizarUsuarioCambioContrasena,
                        [passWordAletoriaEncrypted,data.email],
                        (error, result) => {

                            if (error) {
                                return callback(`The register with EMAIL: ${data.email} can not update the password`, null, false);
                            }

                            sendEmail(
                                data.email,
                                'Recuperación contraseña usuario ResCity',
                                `Apreciado usuario ResCity: ${usuario.NOMBRES} ${usuario.APELLIDOS}, Ha solicitado recuperar su contraseña. Por favor ingresar sesión con la siguiente contraseña temporal: ${passWordAletoria} para realizar la actuliazación de la misma. Durante este periodo su cuenta permanece inactiva hasta que realice el cambio de contraseña. Si presenta algun tipo de inconveniente comunicarse con el administrador de la plataforma. Muchas gracias.`,
                                (result) => {
                                    if(result === false) {
                                        return callback('Email could not be sended', null, false)
                                    }else{
                                        return callback(null, null, true)
                                    }
                                }
                            )
                        }
                    )
                }
            }
        )
    }
}