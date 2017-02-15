// paths
var elementsFile = "src/json/periodic-table-of-elements.json";
var elementsNameFile = "src/json/elements-symbols.json";
// global vars with json
var elements = [];
var elementsNames = [];

$(document).ready(function () {

    // on generate button click
    // $("#generate-button").click(function (e) {

    $("#input-name").keyup(function (e) {

        // avoid firing 2 times
        //e.stopImmediatePropagation();

        var name = $("#input-name").val();

        // load elements json file
        // console.log("elements size: " + elements.length);
        // console.log("elementsNames size: " + elementsNames.length);
        // load json if needed
        if (elements.length === 0 || elementsNameFile.length === 0) {

            $.getJSON(elementsFile, function (data) {
                elements = data.elements;

                // load elements  symbols json file
                $.getJSON(elementsNameFile, function (data) {
                    elementsNames = data;

                    renderResultsToPage(name);
                });

            });
        } // json was already loaded
        else {
            renderResultsToPage(name);
        }
    });

});

function renderResultsToPage(name) {

    var symbolsInName = getElementsInWord(name, elements).asHtml;
    var elementsInName = getElementsInWord(name, elements).elements.asHtml;

    $("#output-name").empty();
    $("#output-name").append(symbolsInName);
    $("#output-name").append(elementsInName);
    //console.log($("#output-name"));
}

// Create function with word as input and elements names as output
function getElementsInWord(word, elements) {

    // console.log("Testing with < " + word + " >");
    // console.log("Word length: " + word.length + "\n");
    // console.log("There are " + elements.length + " elements in the periodic table");

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
        for (var i = 0; i < elements.length; i++) {

            var currentSymbol = elements[i].symbol;
            if (currentLetter === currentSymbol.toString().toLowerCase()) {
                //console.log("\tperfect letter match: " + currentLetter + " --> " + currentSymbol);
                nameObject[currentLetter].match.value = currentSymbol.toString();
                nameObject[currentLetter].match.isBest = true;
                nameObject[currentLetter].match.isPartial = false;
                matchingElements[l] = currentSymbol.toString();
            }
            //
            else {
                var firstTwoLettersOfSymbol = currentSymbol.toString().toLowerCase().substring(0, 2);
                //console.log(firstTwoLettersOfSymbol);
                if (currentLetter === firstTwoLettersOfSymbol[0]) {

                    // if we're not at the last letter
                    if (l < word.length) {

                        // select the best one from the partial matches
                        var firstTwoCurrentLetters = nextLetter ? currentLetter + nextLetter : currentLetter;

                        // if the current letter and the next one are == to the current symbol
                        // pick the current symbol as best match
                        var bestMatch = firstTwoCurrentLetters === firstTwoLettersOfSymbol ? firstTwoLettersOfSymbol : undefined;

                        if (bestMatch) {
                            //console.log("\tbest match: " + currentLetter + " --> " + bestMatch.toUpperCase());
                            nameObject[currentLetter].match.value = bestMatch;
                            nameObject[currentLetter].match.isBest = true;
                            nameObject[currentLetter].match.isPartial = false;
                            matchingElements[l] = currentSymbol.toString();
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

    // console.log("ended, matching elements: ");
    // console.log(matchingElements);

    //console.log("\nended, name object: ");
    //console.log(nameObject);

    // for storing the matching elements (without empty arrays)
    var cleanedElements = [];

    //var matchesToBeFound = Object.keys(nameObject).length;

    // console.log("matches to be found without repetition: " + matchesToBeFound);
    // console.log("matching elements length: " + matchingElements.length);

    // loop through all matching symbols (an array of chemical symbols contained in the name)
    for (var e = 0; e < matchingElements.length; e++) {
        var currentElement = matchingElements[e];
        if (currentElement.length > 0) {
            cleanedElements.push(currentElement);
        }
    }

    // for storing all of the names of elements contained in the input name
    var namesOfElementsInInputName = [];

    // loop through all symbols
    for (var i = 0; i < cleanedElements.length; i++) {

        var currentElementInName = cleanedElements[i];
        // make first letter uppercase and second lowercase
        // so that we can check correctly
        if (cleanedElements[i].length > 1) {
            currentElementInName = cleanedElements[i][0].toUpperCase() + cleanedElements[i][1].toLowerCase();
        }
        // TODO: avoid looping through all elements, use a previously saved index
        // loop through all elements
        for (var e = 0; e < elements.length; e++) {

            var currentMatchedElement = elements[e];

            if (currentElementInName === currentMatchedElement.symbol) {
                namesOfElementsInInputName.push(currentMatchedElement.name);
            }
        }
    }

    var elementsSymbolsAsString = cleanedElements.toString().replace(/,/g, " - ");
    var elementNamesAsString = namesOfElementsInInputName.toString().replace(/,/g, " - ");

    return {
        asHtml: "<h3>" + elementsSymbolsAsString + "</h3>",
        elements: {
            asHtml: "<h5>" + elementNamesAsString + "</h5>"
        }
    };
}