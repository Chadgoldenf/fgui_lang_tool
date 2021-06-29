"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xml_js_1 = require("xml-js");
var fs_1 = require("fs");
var json2xls = require("json2xls");
var excelToJson = require('convert-excel-to-json');
var getFileExtension = function (filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};
var XmlToExcel = function (file, outfile) {
    if (outfile === void 0) { outfile = ""; }
    var filestr = fs_1.readFileSync(file, 'utf-8');
    console.log("file string:", filestr);
    var jobj = xml_js_1.xml2js(filestr);
    console.log("json obj:", jobj);
    var jsonobj = [];
    for (var _i = 0, _a = jobj["elements"]; _i < _a.length; _i++) {
        var elements = _a[_i];
        for (var id in elements) {
            for (var _b = 0, _c = elements[id]; _b < _c.length; _b++) {
                var obj = _c[_b];
                if (obj.name == 'string') {
                    var name_1 = obj.attributes.name;
                    var mz = obj.attributes.mz;
                    var value = obj.elements[0].text;
                    console.log("name:" + name_1 + " mz:" + mz + " " + value);
                    var row = {
                        "name": name_1,
                        "mz": mz,
                        "value": value
                    };
                    jsonobj.push(row);
                }
            }
        }
    }
    var ofile = outfile;
    if (ofile === "") {
        ofile = file;
    }
    var extIndex = ofile.lastIndexOf('.');
    if (extIndex == -1) {
        ofile += ".xlsx";
    }
    else {
        ofile = ofile.substr(0, extIndex) + ".xlsx";
    }
    var xls = json2xls(jsonobj);
    fs_1.writeFileSync(ofile, xls, 'binary');
    console.log("export " + ofile + " ok");
};
var ExcelToXml = function (file, outfile) {
    if (outfile === void 0) { outfile = ""; }
    var result = excelToJson({
        source: fs_1.readFileSync(file)
    });
    var xmlstr = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
    var one = true;
    for (var page in result) {
        for (var row in result[page]) {
            if (one) { //第一個不需要
                one = false;
                continue;
            }
            console.log("json", result[page][row]);
            var name_2 = result[page][row].A;
            var mz = result[page][row].B;
            var value = result[page][row].C;
            xmlstr += '<string name="' + name_2 + '" mz="' + mz + '">' + value + '</string>\n';
        }
    }
    xmlstr += '</resources>';
    var ofile = outfile;
    if (ofile === "") {
        ofile = file;
    }
    var extIndex = file.lastIndexOf('.');
    if (extIndex == -1) {
        ofile += ".xml";
    }
    else {
        ofile = ofile.substr(0, extIndex) + ".xml";
    }
    fs_1.writeFileSync(ofile, xmlstr, 'utf-8');
    console.log("export " + ofile + " ok");
};
var args = process.argv;
var input_file = args[2];
var output_file = args[3];
if (!input_file) {
    console.warn("no input file!!!");
}
else {
    var extension = getFileExtension(input_file);
    if (extension === "xml") {
        XmlToExcel(input_file, output_file);
    }
    else if (extension === "xlsx") {
        ExcelToXml(input_file, output_file);
    }
    else {
        console.warn("This file cannot be processed!");
    }
}
