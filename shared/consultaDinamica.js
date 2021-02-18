const compararJson = require('./compararJson');
const { MensajeverificarParametrosJson } = require('./verificarParametrosJson');

const consultaDinamica = (queryBase, Select, Where, GroupBy, OrderBy) => {
    
    let select = Select;
    let where =  Where;
    let groupBy = GroupBy;
    let orderBy = OrderBy;

    let errorReturn = false;
    let messageReturn = null;

    let consutaDinamicaReturn = {};

    const lengthWhere = Object.keys(where).length;
    
    if(select.length === 0){
        select = "*";
        select.toUpperCase();
    }

    if(lengthWhere === 0){
        where = "";
    }else if(lengthWhere > 0){


        //Formar where
        let whereArray = [];
        
        let whereKeys = Object.keys(where);
        let whereValues = Object.values(where);

        for (var i = 0; i < lengthWhere; i++) {     

            //Verificar si los parámetros de las condiciones estan completos y estan bien escritos
            let whereValuesJsonOriginal = {
                conector_logico: true,
                operador: true,
                valor_condicion: true
            }
            
            let ArraywhereValuesJsonComparar = Object.keys(whereValues[i]);
            
            const verificarParametrosCondiciones = MensajeverificarParametrosJson(whereValuesJsonOriginal, ArraywhereValuesJsonComparar)

            if(verificarParametrosCondiciones.error === true || verificarParametrosCondiciones.messageFaltantes != null || verificarParametrosCondiciones.messageMalEscritos != null ){
                return consutaDinamicaReturn = {
                    query: null,
                    error: true,
                    message: `${verificarParametrosCondiciones.messageFaltantes} or ${verificarParametrosCondiciones.messageMalEscritos} in the condition: ${whereKeys[i].toUpperCase()}, please set a all required parameters`
                };
            }
            
            //Verifico si apartir del ciclo i = 1+ el operador lógico tiene algo
            if(i >= 1 && whereValues[i].conector_logico === "" ){
                return consutaDinamicaReturn = {
                    query: null,
                    error: true,
                    message: `There is no any logic connector in the condition: ${whereKeys[i].toUpperCase()}, please set a logic connector`
                };
            }

            whereValues[i].conector_logico ? whereValues[i].conector_logico = whereValues[i].conector_logico.toUpperCase() : whereValues[i].conector_logico = "" ; //Valido si hay un conector lógico y lo convierto a mayuscula

            whereValues[i].operador = whereValues[i].operador.toUpperCase(); //convierto a mayuscula el operador

            whereArray.push(`${whereValues[i].conector_logico} ${whereKeys[i].toUpperCase()} ${whereValues[i].operador} '${whereValues[i].valor_condicion}'`);  //Formo el arreglo del where

        }

        where =  `WHERE ${whereArray.toString().replace(","," ")}`; //Genero string del where
    }

    // Formo el group by
    if(groupBy.length === 0){
        groupBy = "";
    }else if(groupBy.length > 0){
        groupBy = `GROUP BY ${groupBy.toUpperCase()}`;
    }

    // Formo el order by
    if(orderBy.length === 0){
        orderBy = "";
    }else if(orderBy.length > 0){
        orderBy = `ORDER BY ${orderBy.toUpperCase()}`;
    }

    const queryConsultadDinamica = `
        SELECT ${select} FROM (
            ${queryBase}
            ) SWS 
        ${where}
        ${groupBy}
        ${orderBy}
    `;

    consutaDinamicaReturn = {
        query: queryConsultadDinamica,
        error: errorReturn,
        message: messageReturn
    };

    return consutaDinamicaReturn;
}

module.exports = consultaDinamica;