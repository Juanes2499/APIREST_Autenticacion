const pool = require("../../config/database");

module.exports ={
    autenticar_ByEmail: (data, callback) => {
        
        const queryConsultarUsuario = ` 
            SELECT 
                U.ID_USUARIO,
                U.NOMBRES,
                U.APELLIDOS,
                U.EMAIL,
                U.PASSWORD,
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
                        ORDER BY CU.NOMBRE_MICROSERVICIO ASC      
                    
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

                                LoginJson[`PERMISOS`] = `The user with email: ${data.email} does not have any role asigned`

                                return callback(null, LoginJson, true); 

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
                                
                                return callback(null, LoginJson, true);
                            }
                        }
                    );
                }
            }
        )

    },
}