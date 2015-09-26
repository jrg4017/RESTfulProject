/**
 * a function designed to get the requested tagname data from the data
 * and put it in an array
 * @return arry
 */
function getArray(data, tagName){
    var arry = [];
    $(tagName, data).each(function(){

        var txt = $(this).text();

        if(txt === null || txt === "" || txt === "null" ){
            txt = " ";
        }

        arry[arry.length] = txt;
    })

    return arry;
}

/**
 * checks to see if a key is null
 * @param keyVar
 */
function ifNull(keyVar){
    if(keyVar === null || keyVar == "" || keyVar== "null"){
        keyVar = " ";
    }

    return keyVar;
}

/**
 * the prints requested data in a row and returns it
 * @param label
 * @param info
 */
function getRow(label, info){
    //load var and return to function
    var row = "<tr><td>" + label + "</td><td>" + info +  "</td></tr>";

    return row;
}