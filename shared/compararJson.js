const compararJson = (JsonOriginal, JsonComparar) => {

    try {
        var aKeys = Object.keys(JsonOriginal).sort();
        var bKeys = Object.keys(JsonComparar).sort();

        const validacionVariables = []

        for (var i = 0; i < bKeys.length; i++) {
            validacionVariables.push(aKeys.find(x => x === bKeys[i]) ? true : bKeys[i]);
        }
        
        const variablesErrorArray = []

        if(validacionVariables.find(x => x !== true)){
            
            (validacionVariables.filter(x => x !== true)).forEach( x => {
                variablesErrorArray.push(`${x}`)
            })
        }

        return variablesErrorArray

    } catch (error) {
        return error
    }
}

module.exports = compararJson
