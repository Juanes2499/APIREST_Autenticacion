const compararJson = require('./compararJson');

module.exports = {
    verificarParametrosJson: (JsonOriginal, JsonComparar) => {

        try {
            const CopararParametrosFaltantes = compararJson(JsonComparar, JsonOriginal);
            
            const CompararIgualdadParametros = compararJson(JsonOriginal, JsonComparar);

            let finalArryReturn = [];

            if(CopararParametrosFaltantes.length > 0){
                finalArryReturn.push(CopararParametrosFaltantes)
            }else{
                finalArryReturn.push([])
            }

            if(CompararIgualdadParametros.length > 0 ){
                finalArryReturn.push(CompararIgualdadParametros)
            }else {
                finalArryReturn.push([])
            }

            return finalArryReturn;

        } catch (error) {
            return error
        }
    },
    MensajeverificarParametrosJson: (JsonOriginal, keysJsonComparar) => {

        let JsonComparar = {};
            
        keysJsonComparar.forEach(x => {
            JsonComparar[x] = true;
        })

        const CopararParametrosFaltantes = compararJson(JsonComparar, JsonOriginal);
            
        const CompararIgualdadParametros = compararJson(JsonOriginal, JsonComparar);

        let arrayResult = [];

        if(CopararParametrosFaltantes.length > 0){
            arrayResult.push(CopararParametrosFaltantes)
        }else{
            arrayResult.push([])
        }

        if(CompararIgualdadParametros.length > 0 ){
            arrayResult.push(CompararIgualdadParametros)
        }else {
            arrayResult.push([])
        }

        let messageReturn = {
            error: false,
            messageFaltantes: null,
        };

        if (arrayResult[0].length > 0){
            messageReturn.error = true;
            messageReturn.messageFaltantes = `this/these parameter(s) is/are missing: ${arrayResult[0].toString().replace(",", ", ")}`;
        }

        return messageReturn;
    }
}



