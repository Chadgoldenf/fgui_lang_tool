import { json2xml, xml2js, xml2json } from "xml-js";
import { readFileSync, writeFileSync } from 'fs';
var json2xls = require("json2xls"); 
const excelToJson = require('convert-excel-to-json');

let getFileExtension=function(filename:string) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}
let XmlToExcel=function(file:string,outfile:string=""){
    const filestr = readFileSync(file, 'utf-8');
    console.log("file string:",filestr);
    let jobj = xml2js(filestr);
    console.log("json obj:",jobj);
    let jsonobj=[];
    for(let elements of jobj["elements"]){
        for(let id in elements){
            for( let obj of elements[id]){
                if( obj.name == 'string'){
                    let name = obj.attributes.name;
                    let mz = obj.attributes.mz;
                    let value = obj.elements[0].text;
                    console.log("name:"+name+" mz:"+mz+" "+value);
                    let row={
                        "name":name,
                        "mz":mz,
                        "value":value
                    };
                    jsonobj.push(row);
                }
            }
        }
    }
    let ofile = outfile;
    if( ofile === ""){
        ofile = file;
    }
    let extIndex = ofile.lastIndexOf('.');
	if (extIndex == -1) {
	    ofile += ".xlsx";
	}
    else{
        ofile = ofile.substr(0, extIndex)+".xlsx";
    }
    let xls = json2xls(jsonobj);
    writeFileSync(ofile,xls,'binary');
    console.log("export "+ofile+" ok");
}

let ExcelToXml=function(file:string,outfile:string=""){
    const result = excelToJson({
        source: readFileSync(file)
    });
    let xmlstr = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
    let one=true;
    for(let page in result){
        for(let row in result[page]){
            if( one ){//第一個不需要
                one = false;
                continue;
            }
            console.log("json",result[page][row])
            let name = result[page][row].A;
            let mz = result[page][row].B;
            let value = result[page][row].C;
            xmlstr+='<string name="'+name+'" mz="'+mz+'">'+value+'</string>\n';
        }
    }
    xmlstr+='</resources>';
    let ofile = outfile;
    if( ofile === ""){
        ofile = file;
    }
    let extIndex = file.lastIndexOf('.');
	if (extIndex == -1) {
	    ofile += ".xml";
	}
    else{
        ofile = ofile.substr(0, extIndex)+".xml";
    }
    writeFileSync(ofile,xmlstr,'utf-8');
    console.log("export "+ofile+" ok");
}

let args = process.argv;
let input_file = args[2];
let output_file = args[3];
if( !input_file ){
    console.warn("no input file!!!");
}
else{
    let extension = getFileExtension(input_file);
    if( extension === "xml"){
        XmlToExcel(input_file,output_file);
    }
    else if( extension === "xlsx" ){
        ExcelToXml(input_file,output_file);
    }
    else{
        console.warn("This file cannot be processed!")
    }
}
