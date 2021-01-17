const pool = require("../../config/database");

module.exports={
    crear_Usuario: (data, callback)=>{

        data.tipo_doc_id = data.tipo_doc_id.toUpperCase();
        data.email = data.email.toLowerCase();

        pool.query(
            `
            SELECT * FROM USER
                WHERE (TIPO_DOC_ID = ? AND NUMERO_DOC_ID = ?) OR EMAIL = ? `,
            [data.tipo_doc_id, data.numero_doc_id, data.email],
            (error, result) => {
                if(result.length > 0){
                    return callback(`The register with email: ${data.email} was created`, null, false);
                } else if (result.length === 0){
                    pool.query(
                        `
                        INSERT 
                            INTO USER 
                            (NOMBRES, APELLIDOS, TIPO_DOC_ID, NUMERO_DOC_ID, EMAIL, PASSWORD, FECHA_CREACION, HORA_CREACION)
                        VALUES 
                            (?,?,?,?,?,?, CURDATE(), CURTIME())`,
                        [
                            data.nombres,
                            data.apellidos,
                            data.tipo_doc_id,
                            data.numero_doc_id,
                            data.email,
                            data.password
                        ],
                        (error, result) =>{
                            if(error){
                                return callback(`The register with email: ${data.email} was created`, null, false)
                            }
                            return callback(null, result, true)
                        }
                    );
                }
            }
        )
    },
    consultar_Usuarios: callback =>{
        pool.query(
            `SELECT * FROM USER`,
            [],
            (error, result, fields) =>{
                if(error){
                    return callback(error, null, false);
                }
                return callback(null, result, true);
            }
        );
    },
    consultar_usuarios_byID: (data, callback) => {
        
        const queryConsultarUsuarioByID = `
            SELECT 
                * 
            FROM USER 
            WHERE 
                ID_USER = ?`;

        pool.query(
            queryConsultarUsuarioByID,
            [data.id_user],
            (error, result)=>{
                if(result.length === 0){
                    return callback(`The user with ID_USER ${data.id_user} does not exist `, null, false);
                }
                return callback(null, result, true);
            }
        );
    },
    consultar_usuarios_byEmail: (data, callback) => {

        const queryConsultarUsuarioByEmail = `
            SELECT 
                *
            FROM USER U 
            WHERE 
                U.EMAIL LIKE '%${data.email}%'
        `;

        pool.query(
            queryConsultarUsuarioByEmail,
            [],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The user with email: ${data.email} does not exist `, null, false);
                }
                return callback(null, result, true);
            }
        )
    },
    actualizar_usuario_byId: (data, callBack) => {

        data.tipo_doc_id = data.tipo_doc_id.toUpperCase();
        data.email = data.email.toLowerCase();

        const queryConsutarExistenciaUsuarioByID = `
            SELECT 
                * 
            FROM USER 
            WHERE 
                ID_USER = ?
        `;

        pool.query(
            queryConsutarExistenciaUsuarioByID,
            [data.id_user],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The user with ID_USER ${data.id_user} does not exist `, null, false);
                }else if (result.length > 0){

                    const queryActualizarUsuarioByID = `
                        UPDATE USER
                            SET NOMBRES = ?,
                                APELLIDOS = ?,
                                TIPO_DOC_ID = ?,
                                NUMERO_DOC_ID = ?,
                                EMAIL = ?,
                                PASSWORD = ?,
                                FECHA_ACTUALIZACION = CURDATE(),
                                HORA_ACTUALIZACION = CURTIME()
                            WHERE ID_USER = ?`;
            
                    pool.query(
                        queryActualizarUsuarioByID,
                      [data.nombres, data.apellidos, data.tipo_doc_id, data.numero_doc_id, data.email, data.password, data.id_user],
                      (error, result) => {
                        if (error) {
                            return callback(`The register with ID_USER: ${data.id_user} could not be updated`, null, false);
                        }
                        return callBack(null, null, true);
                      }
                    )
                }
            }
        )
    },
    eliminar_usuario_byId: (data, callback) => {

        const queryConsutarExistenciaUsuarioByID = `
            SELECT 
                * 
            FROM USER 
            WHERE 
                ID_USER = ?
        `;

        pool.query(
            queryConsutarExistenciaUsuarioByID,
            [data.id_user],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The user with ID_USER ${data.id_user} does not exist `, null, false);
                }else if (result.length > 0){

                    const queryEliminarUsuarioById = `
                        DELETE FROM USER WHERE ID_USER = ?
                    `;
                    pool.query(
                        queryEliminarUsuarioById,
                        [data.id_user],
                        (error, result) => {
                        if (error) {
                            return callback(`The register with ID_USER: ${data.id_user} could not be deleted`, null, false);
                        }
                        return callback(null, null, true);
                        }
                    );
                }
            }
        )
    },
    autenticar_ByEmail: (data, callback) => {
        pool.query(
            `
                SELECT 
                    U.ID_USER,
                    U.NOMBRES,
                    U.APELLIDOS,
                    U.TIPO_DOC_ID,
                    U.NUMERO_DOC_ID,
                    U.EMAIL,
                    U.PASSWORD,
                    U.FECHA_CREACION, 
                    U.HORA_CREACION
                FROM USER U 
                WHERE 
                    U.EMAIL = ?
            `,
            [data.email],
            (error, result) => {
                if(result.length === 0){
                    return callback(`The user with email: ${data.email} does not exist `, null, false);
                }else if(result.length > 0){

                    const resultToJson = JSON.parse(JSON.stringify(result));

                    const LoginJson = resultToJson[0];

                    const queryRoles =  `
                        SELECT 
                            CR.ID_CONFIGURACION,
                            U.ID_USER, 
                            U.EMAIL,
                            CR.ID_ROL, 
                            (SELECT 
                                NOMBRE_ROL 
                            FROM ROLES R 
                            WHERE ID_ROL = CR.ID_ROL) NOMBRE_ROL, 
                            U.FECHA_CREACION, 
                            U.HORA_CREACION
                        FROM USER U 
                        INNER JOIN 
                            CONFIGURACION_ROLES CR 
                            ON U.ID_USER = CR.ID_USER
                        WHERE 
                            U.EMAIL = ?        
                    
                    `;

                    pool.query(
                        queryRoles
                        ,
                        [data.email],
                        (error, result) => {
                            if(result.length === 0) {

                                const resultRolesToJson = JSON.parse(JSON.stringify(result));

                                LoginJson[`ROLES`] = `The user with email: ${data.email} does not have any role asigned`

                                return callback(null, LoginJson, true); 

                            }else if(result.length > 0){
                                
                                const resultRolesToJson = JSON.parse(JSON.stringify(result));

                                resultRolesToJson.forEach(x => {
                                    LoginJson[`ROL_${x.NOMBRE_ROL}`] = true
                                });

                                return callback(null, LoginJson, true);
                            }
                        }
                    );
                }
            }
        )

    },
}