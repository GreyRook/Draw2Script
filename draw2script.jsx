//Array of Base64 characters
var BASE_64 = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];

//Map instructions to values
var instructions = {"moveTo": "000", "lineTo": "001", "quadraticCurveTo": "010", "bezierCurveTo": "011", "closePath": "100"};

//Map instructions to parameter count
var paramCount = {"moveTo": 2, "lineTo": 2, "quadraticCurveTo": 4, "bezierCurveTo": 6, "closePath": 0};

//Map size of position property to bits
var sizeOfPositions = {"12": 0, "18": 1};

var unusedBits = "00";

function generateCreateJS() {
	var objects = app.activeDocument.selection;
	var instruction = "graphics";
	for(var i = 0; i < objects.length; i++) {
		if(objects[i].typename == "PathItem") {
			instruction += createJSParsePathItem(objects[i]);
		} else if(objects[i].typename == "GroupItem") {
			instruction += createJSParseGroupItem(objects[i]);
		}
	}
	instruction += ".cp()";
	return instruction;
	
}

function createJSParsePathItem(pathItem) {
	var instruction = "";
	var pathPoints = pathItem.selectedPathPoints;
	if(pathItem.filled) {
		
		//CYMK Color Codes
		var k = pathItem.fillColor.black;
		var c = pathItem.fillColor.cyan;
		var m = pathItem.fillColor.magenta;
		var y = pathItem.fillColor.yellow;
		
		//RGB Color Codes
		var r = 255 * (1 - c/100) * (1 - k/100);
		var g = 255 * (1 - m/100) * (1 - k/100);
		var b = 255 * (1 - y/100) * (1 - k/100);
		var a = 1;
		
		//Begin fill with RGBA values
		instruction += ".f('rgba(" + r + ", " + g + ", " + b + ", " + a + ")')";
	}
	if(pathItem.stroked) {
		var strokeWidth = pathItem.strokeWidth;
		instruction += ".ss(" + strokeWidth + ")";
		
		//CMYK Color Codes
		var k = pathItem.strokeColor.black;
		var c = pathItem.strokeColor.cyan;
		var m = pathItem.strokeColor.magenta;
		var y = pathItem.strokeColor.yellow;
		
		//RGB Color Codes
		var r = 255 * (1 - c/100) * (1 - k/100);
		var g = 255 * (1 - m/100) * (1 - k/100);
		var b = 255 * (1 - y/100) * (1 - k/100);
		var a = 1;
		
		//Begin stroke with RGBA values
		instruction += ".s('rgba(" + r + ", " + g + ", " + b + ", " + a + ")')";
	}		
	
	if(pathPoints.length > 0) {
		//Easeljs uses absolute movement for the first command
		var moveToX = pathPoints[0].anchor[0];
		var moveToY = -1*pathPoints[0].anchor[1];

		//12 bits you can used numbers up to 2047, 18 bits you can use numbers up to 131071. 
		var sizeOfPosition = 18;

		var bitInstruction = instructions["moveTo"] + sizeOfPositions[sizeOfPosition] + unusedBits +
		converNumberToBits(moveToX, sizeOfPosition) + converNumberToBits(moveToY, sizeOfPosition);

		instruction += ".p('" + convertBitToBase64(bitInstruction);
		if(pathPoints.length > 1) {
			for(var i = 0; i < (pathItem.closed ? pathPoints.length : (pathPoints.length - 1)); i++) {
				//Easeljs uses absolute movement for the first command
				var previousX = pathPoints[i].anchor[0];
				var previousY = -1*pathPoints[i].anchor[1];

				/*
				 * Illustrator uses negative y-values, when Easeljs uses positive y-values. So y-value must
				 * be multiplied by -1 to archive the same result.
				 * Easeljs uses relative movement after the first command.
				 */
				var lineToX = pathPoints[(i+1)%pathPoints.length].anchor[0] - previousX;
				var lineToY = -1*pathPoints[(i+1)%pathPoints.length].anchor[1] - previousY;

				bitInstruction = instructions["lineTo"] + sizeOfPositions[sizeOfPosition] + unusedBits +
				converNumberToBits(lineToX, sizeOfPosition) + converNumberToBits(lineToY, sizeOfPosition);

				instruction += convertBitToBase64(bitInstruction);
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

function createJSParseGroupItem(groupItem) {
	var instruction = "";
	for(var i = 0; i < groupItem.groupItems.length; i++) {
		instruction += createJSParseGroupItem(groupItem.groupItems[i]);
	}
	for(var i = 0; i < groupItem.pathItems.length; i++) {
		instruction += createJSParsePathItem(groupItem.pathItems[i]);
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
 * Floors a number an then converts it to a bit String. When the number is negative the MSB will
 * be 1, when it is positive the MSB will be 0.
 * @param number Number which will be converted to a bit String
 * @param size Number of bits which will be used to represent number
 */
function converNumberToBits(number, size) {
  //Easeljs has an accuracy of 1/10 of a pixel.
    number = number*10;
	var sign = (number < 0 ? "1" : "0");
    var result = Math.abs(number).toString(2);
    while(result.length < size-1) {
        result = "0" + result;
    }
    var bitsCount = result.length;
    return sign + result;
}

generateCreateJS();