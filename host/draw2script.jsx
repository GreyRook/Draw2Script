//Minified JSON2
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,u,f,a=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(i)){for(u=i.length,r=0;u>r;r+=1)f[r]=str(r,i)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+a+"]":"["+f.join(",")+"]",gap=a,o}if(rep&&"object"==typeof rep)for(u=rep.length,r=0;u>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,i),o&&f.push(quote(n)+(gap?": ":":")+o));else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i),o&&f.push(quote(n)+(gap?": ":":")+o));return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+a+"}":"{"+f.join(",")+"}",gap=a,o}}var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value);var gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r]);return reviver.call(t,e,o)}var j;if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

﻿//Array of Base64 characters
var BASE_64 = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U",
               "V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p",
               "q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+",
               "/"];

//Map instructions to values
var instructions = {"moveTo": "000", "lineTo": "001", "quadraticCurveTo": "010", 
		"bezierCurveTo": "011", "closePath": "100"};

//Map instructions to parameter count
var paramCount = {"moveTo": 2, "lineTo": 2, "quadraticCurveTo": 4, "bezierCurveTo": 6,
		"closePath": 0};

//Map size of position property to bits
var sizeOfPositions = {"12": 0, "18": 1};

var unusedBits = "00";

var cropBox;

var hexColor = false;

function generatePixiJson() {
	var codeString = generateCreateJS({hexColor: true});
	if(codeString == "No objects are selected") {
		return codeString;
	} else if(codeString.indexOf("overflow") > -1) {
		return codeString;
	}
	var type = "graphics";
	var data = [];
	var json = {
			"type": type,
	};
	var splitDot = codeString.split(".");
	for(var i = 0; i < splitDot.length; i++) {
		if(splitDot[i].length != 0) {
			var splitBracket = splitDot[i].split(/[(]+/);
			var cmd = splitBracket[0];
			var args = splitBracket[1].substring(0,splitBracket[1].length-1).replace(/'/g, "").split(",");
			var dataItem = {
					"cmd": cmd,
					"args": args,
			}
			data.push(dataItem);
		}
	}
	json.data = data;
	return JSON.stringify(json,null, 2);
}

function generateCreateJS(params) {
	var objects = app.activeDocument.selection;
	var instruction = "";
	hexColor = params.hexColor;
	cropBox = app.activeDocument.cropBox;
	for(var i = objects.length -  1; i >= 0; i--) {
		if(objects[i].typename == "PathItem") {
			instruction += createJSParsePathItem(objects[i]);
		} else if(objects[i].typename == "GroupItem") {
			instruction += parseGroupItem(objects[i]);
		} else if(objects[i].typename == "CompoundPathItem") {
			instruction += parseCompoundPathItem(objects[i]);
		}
	}
	instruction += ".cp()";
	if(objects.length == 0) {
		return "select: No objects are selected";
	} else if(instruction.indexOf("overflow") > -1) {
		return "overflow: Please scale your graphic down. Only up to 131071 Pixel are supported.";
	}
 	return instruction;
	
}


function getColor(color, opacity) {
	var r,g,b;
	var a = opacity/100;
	
	if(color.typename == "RGBColor") {
		r = color.red;
		g = color.green;
		b = color.blue;
	} else if(color.typename == "CMYKColor") {
		//CYMK Color Codes
		var k = color.black;
		var c = color.cyan;
		var m = color.magenta;
		var y = color.yellow;

		//RGB Color Codes
		r = 255 * (1 - c/100) * (1 - k/100);
		g = 255 * (1 - m/100) * (1 - k/100);
		b = 255 * (1 - y/100) * (1 - k/100);		 
	}
	//Begin fill with RGBA values
	if(hexColor) {
		return "0x" + convertToHex(r) + convertToHex(g) + convertToHex(b); 
	} else {
		return "'rgba(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + "," + a + ")'";
	}
}

function getStrokeStyle(pathItem) {
	var strokeWidth = pathItem.strokeWidth;
	var strokeCap;
	var strokeJoin;
	var strokeMiterLimit = pathItem.strokeMiterLimit;

	if(pathItem.strokeCap == "StrokeCap.BUTTENDCAP") {
		strokeCap = 0;
	} else if(pathItem.strokeCap == "StrokeCap.PROJECTINGENDCAP")  {
		strokeCap = 1;
	} else if(pathItem.strokeCap == "StrokeCap.ROUNDENDCAP") {
		strokeCap = 2;
	}

	if(pathItem.strokeJoin == "StrokeJoin.MITERENDJOIN") {
		strokeJoin = 0;
	} else if(pathItem.strokeJoin == "StrokeJoin.ROUNDENDJOIN") {
		strokeJoin = 1;
	} else if(pathItem.strokeJoin == "StrokeJoin.BEVELENDJOIN") {
		strokeJoin = 2;
	}
	return strokeWidth + "," + strokeCap + "," + strokeJoin + "," + strokeMiterLimit;
}

function createJSParsePathItem(pathItem) {
	var instruction = "";
	var pathPoints = pathItem.selectedPathPoints;

	if(pathItem.filled) {
		instruction += ".f(" + getColor(pathItem.fillColor, pathItem.opacity) + ")";
	}
	if(pathItem.stroked) {
		instruction += ".ss(" + getStrokeStyle(pathItem) + ")";
		instruction += ".s(" + getColor(pathItem.strokeColor, pathItem.opacity) + ")";
	}
	if(pathItem.stroked) {
		var strokeDashes = pathItem.strokeDashes;
		var strokeDashOffset = 0;
		instruction += ".sd([" + strokeDashes + "]," + strokeDashOffset + ")";
	}
	if(pathPoints.length > 0) {
		//Easeljs uses absolute movement for the first command
		var moveToX = pathPoints[0].anchor[0] + cropBox[0];
		var moveToY = -1*pathPoints[0].anchor[1] + cropBox[1];

		//12 bits you can used numbers up to 2047, 18 bits you can use numbers up to 131071. 
		var sizeOfPosition = 18;

		var bitInstruction = instructions["moveTo"] + sizeOfPositions[sizeOfPosition] + unusedBits +
		convertNumberToBits(moveToX, sizeOfPosition) + convertNumberToBits(moveToY, sizeOfPosition);

		instruction += ".p('" + convertBitToBase64(bitInstruction);

		if(pathPoints.length > 1) {
			for(var i = 0; i < (pathItem.closed ? pathPoints.length : (pathPoints.length - 1)); i++) {
				var previousPoint = pathPoints[i%pathPoints.length];
				var currentPoint = pathPoints[(i+1)%pathPoints.length];
				
				if(currentPoint.anchor == currentPoint.leftDirection && currentPoint.anchor == currentPoint.rightDirection) {
					var lineToX = currentPoint.anchor[0] - previousPoint.anchor[0];
					var lineToY = -1*currentPoint.anchor[1] + previousPoint.anchor[1];

					bitInstruction = instructions["lineTo"] + sizeOfPositions[sizeOfPosition] + unusedBits +
					convertNumberToBits(lineToX, sizeOfPosition) + convertNumberToBits(lineToY, sizeOfPosition);

					instruction += convertBitToBase64(bitInstruction);
				} else {			 
					var anchorX = currentPoint.anchor[0] - currentPoint.leftDirection[0];
					var anchorY = -1*currentPoint.anchor[1] + currentPoint.leftDirection[1];

					var leftDirectionX = currentPoint.leftDirection[0] - previousPoint.rightDirection[0];
					var leftDirectionY = -1*currentPoint.leftDirection[1] + previousPoint.rightDirection[1] ;

					var rightDirectionX = previousPoint.rightDirection[0] - previousPoint.anchor[0];
					var rightDirectionY = -1*previousPoint.rightDirection[1] + previousPoint.anchor[1];

					bitInstruction = instructions["bezierCurveTo"] + 
						sizeOfPositions[sizeOfPosition] + unusedBits +
						convertNumberToBits(rightDirectionX, sizeOfPosition) + 
						convertNumberToBits(rightDirectionY, sizeOfPosition) +
						convertNumberToBits(leftDirectionX, sizeOfPosition) + 
						convertNumberToBits(leftDirectionY, sizeOfPosition) +
						convertNumberToBits(anchorX, sizeOfPosition) + 
						convertNumberToBits(anchorY, sizeOfPosition);
					
					instruction += convertBitToBase64(bitInstruction);
				}
			}
		}
		instruction += "')";
	}
	if(pathItem.stroked) {
		//End stroke
		instruction += ".es()";
	}
	if(pathItem.filled) {
		//End fill
		instruction += ".ef()";
	}
	return instruction;
}

function parseGroupItem(groupItem) {
	var instruction = "";
	for(var i = 0; i < groupItem.groupItems.length; i++) {
		instruction += parseGroupItem(groupItem.groupItems[i]);
	}
	for(var i = 0; i < groupItem.pathItems.length; i++) {
		instruction += createJSParsePathItem(groupItem.pathItems[i]);
	}
	for(var i = 0; i < groupItem.compoundPathItems.length; i++) {
		instruction += parseCompoundPathItem(groupItem.compoundPathItems[i]);
	}
	return instruction;
}

function parseCompoundPathItem(compoundPathItem) {
	var instruction = "";
	for(var i = 0; i < compoundPathItem.pathItems.length; i++) {
		instruction += createJSParsePathItem(compoundPathItem.pathItems[i]);
	}
	return instruction;
}
/*
 * Converts a string of bits to a base64 string
 */
function convertBitToBase64(bits) {
	var base64String = "";
	var loops = bits.length/6;
	for(var i = 0; i < loops; i++) {
		var bitsChunk = bits.substring(i*6, i*6+6);
		var intFromBitsChunk = parseInt(bitsChunk, 2);
		var base64Char = BASE_64[intFromBitsChunk];
		base64String += base64Char;
	}
	return base64String;
}

/*
 * Convers a number to a two letter hex value
 */
function convertToHex(number) {
    var hex = Math.round(number).toString(16);
    if(hex.length < 2) {
    	hex = "0" + hex;
    }
    return hex;
}	

/*
 * Floors a number an then converts it to a bit String. When the number is negative the MSB will
 * be 1, when it is positive the MSB will be 0.
 * @param number Number which will be converted to a bit String
 * @param size Number of bits which will be used to represent number
 */
function convertNumberToBits(number, size) {
  //Easeljs has an accuracy of 1/10 of a pixel.
    number = number*10;
	var sign = (number < 0 ? "1" : "0");
    var result = Math.abs(Math.round(number)).toString(2);
    while(result.length < size-1) {
        result = "0" + result;
    }
    if(result.length > size) {
    	return "overflow";
    } else {
    	return sign + result;
    }
}
