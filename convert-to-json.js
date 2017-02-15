const csv = require('csvtojson');
const csvFilePath = "periodic-table-of-elements.csv";
const fs = require('fs');

const csvOptions = {
    noheader: true
};

var i = 0;
var mainObj = {
    elements: []
}

csv(csvOptions)
    .fromFile(csvFilePath)
    .on("json", function(jsonObject) {

        var element = {};
        if (i > 0) {
            element.atomic_number = parseInt(jsonObject.field1);
            element.name = jsonObject.field2;
            element.symbol = jsonObject.field3;
            element.atomic_weight = parseInt(jsonObject.field4);
            element.period = parseInt(jsonObject.field5);
            element.group = parseInt(jsonObject.field6);
            element.phase = jsonObject.field7;
            element.most_stable_crystal = jsonObject.field8;
            element.type = jsonObject.field9;
            element.ionic_radius = parseFloat(jsonObject.field10);
            element.atomic_radius = parseFloat(jsonObject.field11);
            element.electronegativity = parseFloat(jsonObject.field12);
            element.first_ionization_potential = parseFloat(jsonObject.field13);
            element.density = parseFloat(jsonObject.field14);
            element.melting_point = parseFloat(jsonObject.field15);
            element.boiling_point = parseFloat(jsonObject.field16);
            element.isotopes = parseInt(jsonObject.field17);
            element.discoverer = jsonObject.field18;
            element.year_of_discovery = jsonObject.field19;
            element.specific_heat_capacity = parseFloat(jsonObject.field20);
            element.electron_configuration = jsonObject.field21;
            element.display_row = parseInt(jsonObject.field22);
            element.display_column = parseInt(jsonObject.field23);
            mainObj.elements.push(element);
        }
        // debug
        if (i === 0 || i === 1 || i === 2) {
            console.log("iteration " + i);
            console.log(parseInt(jsonObject.field1));
            console.log(jsonObject);
            // console.log(element);
        }
        i++;
    })
    .on("done", function(err) {
        if (err) console.log(err);
        console.log("total elements: " + i);
        fs.writeFile("periodic-table-of-elements.json", JSON.stringify(mainObj), "utf-8", function(err) {
            console.log("file written");
        })
        console.log("ended conversion.");
    });
