const pool = require("../../config/database");
const consultaDinamica = require("../../shared/consultaDinamica");

module.exports={
    crear_Usuario: (data, callback)=>{

        data.tipo_doc_id = data.tipo_doc_id.toUpperCase();
        data.email = data.email.toLowerCase();

        const queryConsultarExistenciaUsuario = `
            SELECT * FROM USUARIOS
            WHERE (TIPO_DOC_ID = ? AND NUMERO_DOC_ID = ?) OR EMAIL = ? 
        `;

        pool.query(
            queryConsultarExistenciaUsuario,
            [data.tipo_doc_id, data.numero_doc_id, data.email],
            (error, result) => {

                if(result.length > 0){

                    return callback(`The register with email: ${data.email} was created`, null, false);

                } else if (result.length === 0){

                    const queryCrearUsuario = `
                        INSERT 
                            INTO USUARIOS 
                            (ID_USUARIO, NOMBRES, APELLIDOS, TIPO_DOC_ID, NUMERO_DOC_ID, EMAIL, PASSWORD, FECHA_CREACION, HORA_CREACION)
                        VALUES 
                            (UUID(), ?,?,?,?,?,?, CURDATE(), CURTIME())
                    `;

                    pool.query(
                        queryCrearUsuario,
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
                                return callback(`The register with email: ${data.email} could not be created`, null, false)
                            }
                            return callback(null, null, true)
                        }
                    );
                }
            }
        )
    },
    consultar_Usuarios: (data, callback) =>{

        const queryBaseConsultarUsuario = `
            SELECT
                ID_USUARIO,
                NOMBRES,
                APELLIDOS,
                TIPO_DOC_ID,
                NUMERO_DOC_ID,
                EMAIL,
                FECHA_CREACION,
                HORA_CREACION,
                FECHA_ACTUALIZACION,
                HORA_ACTUALIZACION
            FROM USUARIOS
        `;

        const queryConsultarUsuarios = consultaDinamica(
            queryBaseConsultarUsuario,
            data.seleccionar,
            data.condicion,
            data.agrupar,
            data.ordenar
        );

        if(queryConsultarUsuarios.query == null && queryConsultarUsuarios.error === true){
            return callback(queryConsultarUsuarios.message, null, false);
        }

        pool.query(
            queryConsultarUsuarios.query,
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
    actualizar_usuario_byId: (data, callBack) => {

        data.tipo_doc_id = data.tipo_doc_id.toUpperCase();
        data.email = data.email.toLowerCase();

        const queryConsutarExistenciaUsuarioByID = `
            SELECT 
                * 
            FROM USUARIOS 
            WHERE 
                ID_USUARIO = ?
        `;

        pool.query(
            queryConsutarExistenciaUsuarioByID,
            [data.id_usuario],
            (error, result) => {

                if (error){
                    return callback(`There is/are error(s), please contact with the administrator`, null, false);
                }

                if(result.length === 0){
                    return callback(`The user with ID_USUARIO ${data.id_usuario} does not exist `, null, false);
                }else if (result.length > 0){

                    const queryActualizarUsuarioByID = `
                        UPDATE USUARIOS
                            SET NOMBRES = ?,
                                APELLIDOS = ?,
                                TIPO_DOC_ID = ?,
                                NUMERO_DOC_ID = ?,
                                EMAIL = ?,
                                PASSWORD = ?,
                                FECHA_ACTUALIZACION = CURDATE(),
                                HORA_ACTUALIZACION = CURTIME()
                            WHERE ID_USUARIO = ?`;
            
                    pool.query(
                        queryActualizarUsuarioByID,
                      [data.nombres, data.apellidos, data.tipo_doc_id, data.numero_doc_id, data.email, data.password, data.id_usuario],
                      (error, result) => {

                        if (error) {
                            return callback(`The register with ID_USER: ${data.id_usuario} could not be updated`, null, false);
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
            FROM USUARIOS 
            WHERE ID_USUARIO = ?
        `;

        pool.query(
            queryConsutarExistenciaUsuarioByID,
            [data.id_usuario],
            (error, result) => {

                if (error) {
                    return callback(`The register with ID_USER: ${data.id_usuario} could not be updated`, null, false);
                }

                if(result.length === 0){

                    return callback(`The user with ID_USER ${data.id_usuario} does not exist `, null, false);

                }else if (result.length > 0){

                    const queryEliminarUsuarioById = `
                        DELETE FROM USUARIOS WHERE ID_USUARIO = ?
                    `;

                    pool.query(
                        queryEliminarUsuarioById,
                        [data.id_usuario],
                        (error, result) => {

                            if (error) {
                                return callback(`The register with ID_USUARIO: ${data.id_usuario} could not be deleted`, null, false);
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