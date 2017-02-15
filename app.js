const fs = require('fs');
const path = require('path');

const elementsFile = "periodic-table-of-elements.json";
const elementsNameFile = "elements-symbols.json";

// load elements json file
fs.readFile(path.join(__dirname, elementsFile), "utf-8", function (err, data) {

    // store all elements in var
    var elements = JSON.parse(data).elements;

    // read json with only symbols name
    fs.readFile(path.join(__dirname, elementsNameFile), "utf-8", function (err, data) {
        if (err) console.log(err);

        // store symbol names in var
        var elementsSymbols = JSON.parse(data);

        var results = getElementsInWord("Valerio", elementsSymbols);
        var elementsNames = [];

        console.log("\n----- RESULTS -----\n");
        console.log(results.stringified);

        // the symbols in our processed name
        var symbolsInName = results.array;

        // Loop through all symbol in our name
        for(var i = 0; i < symbolsInName.length; i++){

            var currentElementInName = symbolsInName[i];
            // make first letter uppercase and second lowercase
            // so that we can check correctly
            if(symbolsInName[i].length > 1){
                currentElementInName = symbolsInName[i][0].toUpperCase() + symbolsInName[i][1].toLowerCase();
            }
            // TODO: avoid looping through all elements, use a previously saved index
            // loop through all elements
            for(var e = 0; e < elements.length; e++){

                var currentMatchedElement = elements[e];

                if(currentElementInName === currentMatchedElement.symbol){
                    elementsNames.push(currentMatchedElement.name);
                }
            }
        }
        console.log(elementsNames);
    });

});

// 2. Create function with letter as input and element name as output
function getElementsInWord(word, symbols) {

    console.log("Testing with < " + word + " >");
    console.log("Word length: " + word.length + "\n");
    console.log("There are " + symbols.length + " elements in the periodic table");
    
    word = word.toLowerCase();
    // our object for storing chemical element matches
    var nameObject = {};

    var matchingElements = [];

    // loop through letters of word
    for (var l = 0; l < word.length; l++) {

        var currentLetter = word.toLowerCase()[l];
        var nextLetter = word.toLowerCase()[l + 1];
        //console.log(currentLetter);

        nameObject[currentLetter] = {};

        nameObject[currentLetter].match = {
            value: "",
            isBest: false,
            isPartial: false
        };

        matchingElements.push([]);
        //console.log(matchingElements);

        // loop inside symbols
        for (var i = 0; i < symbols.length; i++) {

            var currentSymbol = symbols[i];
            if (currentLetter === currentSymbol.toString().toLowerCase()) {
                //console.log("\tperfect letter match: " + currentLetter + " --> " + currentSymbol);
                nameObject[currentLetter].match.value = currentSymbol.toString().toUpperCase();
                nameObject[currentLetter].match.isBest = true;
                nameObject[currentLetter].match.isPartial = false;
                matchingElements[l] = currentSymbol.toString().toUpperCase();
            }
            //
            else {
                var firstTwoLettersOfSymbol = currentSymbol.toString().toLowerCase().substring(0, 2);
                //console.log(firstTwoLettersOfSymbol);
                if (currentLetter === firstTwoLettersOfSymbol[0]) {

                    // if we're not at the last letter
                    if (l < symbols.length) {

                        // select the best one from the partial matches
                        var firstTwoCurrentLetters = nextLetter ? currentLetter + nextLetter : currentLetter;

                        // if the current letter and the next one are == to the current symbol
                        // pick the current symbol as best match
                        var bestMatch = firstTwoCurrentLetters === firstTwoLettersOfSymbol ? firstTwoLettersOfSymbol : undefined;

                        if (bestMatch) {
                            //console.log("\tbest match: " + currentLetter + " --> " + bestMatch.toUpperCase());
                            nameObject[currentLetter].match.value = bestMatch.toUpperCase();
                            nameObject[currentLetter].match.isBest = true;
                            nameObject[currentLetter].match.isPartial = false;
                            matchingElements[l] = currentSymbol.toString().toUpperCase();
                            // skip the next letter since we already processed it
                            l++;
                        }
                        // no best match, pick the better we can
                        else {
                            if (!nameObject[currentLetter].match.isBest && !nameObject[currentLetter].match.isPartial) {
                                //console.log("\tpartial match: " + currentLetter + " --> " + firstTwoLettersOfSymbol);
                                var partialMatch = firstTwoLettersOfSymbol[0].toUpperCase() + firstTwoLettersOfSymbol[1];
                                nameObject[currentLetter].match.value = partialMatch;
                                nameObject[currentLetter].match.isPartial = true;
                                nameObject[currentLetter].match.isBest = false;
                                matchingElements[l] = currentSymbol.toString();
                            }
                        }
                    }
                    // we're at the last letter
                    else {
                        nameObject[currentLetter].match.value = firstTwoLettersOfSymbol;
                        nameObject[currentLetter].match.isBest = false;
                        nameObject[currentLetter].match.isPartial = true;
                        matchingElements[l] = currentSymbol.toString();
                    }
                }
            }
        }
    }

    console.log("\nended, matching elements: ");
    console.log(matchingElements);

    //console.log("\nended, name object: ");
    //console.log(nameObject);

    var finalName = [];
    var matchesToBeFound = Object.keys(nameObject).length;

    console.log("\nmatches to be found without repetition: " + matchesToBeFound);

    console.log("matching elements length: " + matchingElements.length);

    for (var e = 0; e < matchingElements.length; e++) {
        //console.log(matchingElements[e]);

        var currentRow = matchingElements[e];
        if (currentRow.length > 0) {
            finalName.push(currentRow);
        }
    }

    var finalNameString = finalName.toString().replace(/,/g, " - ");
    return finalName = {
        stringified: finalNameString,
        array: finalName
    };
}