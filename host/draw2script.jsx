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
	for(var i = objects.length -  1; i >= 0; i--) {
		if(objects[i].typename == "PathItem") {
			instruction += createJSParsePathItem(objects[i]);
		} else if(objects[i].typename == "GroupItem") {
			instruction += createJSParseGroupItem(objects[i]);
		}
	}
	instruction += ".cp()";
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
	return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
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
		
		instruction += ".f('" + getColor(pathItem.fillColor, pathItem.opacity) + "')";
	}
	if(pathItem.stroked) {
		instruction += ".ss(" + getStrokeStyle(pathItem) + ")";
		instruction += ".s('" + getColor(pathItem.strokeColor, pathItem.opacity) + "')";
	}
	if(pathItem.stroked) {
		var strokeDashes = pathItem.strokeDashes;
		var strokeDashOffset = 0;
		instruction += ".sd([" + strokeDashes + "]," + strokeDashOffset + ")";
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
				var previousX = pathPoints[i].anchor[0];
				var previousY = -1*pathPoints[i].anchor[1];

				if(pathPoints[i].pointType == "PointType.CORNER") {
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
				} else {			 
					var anchorX = pathPoints[(i+1)%pathPoints.length].anchor[0] - pathPoints[(i+1)%pathPoints.length].leftDirection[0];
					var anchorY = -1*pathPoints[(i+1)%pathPoints.length].anchor[1] + 1*pathPoints[(i+1)%pathPoints.length].leftDirection[1];
					
					var leftDirectionX = pathPoints[(i+1)%pathPoints.length].leftDirection[0] - pathPoints[(i)%pathPoints.length].rightDirection[0];
					var leftDirectionY = -1*pathPoints[(i+1)%pathPoints.length].leftDirection[1] + 1*pathPoints[(i)%pathPoints.length].rightDirection[1] ;
					
					var rightDirectionX = pathPoints[(i)%pathPoints.length].rightDirection[0] - previousX;
					var rightDirectionY = -1*pathPoints[(i)%pathPoints.length].rightDirection[1] - previousY;
					
					bitInstruction = instructions["bezierCurveTo"] + sizeOfPositions[sizeOfPosition] + unusedBits +
					converNumberToBits(rightDirectionX, sizeOfPosition) + converNumberToBits(rightDirectionY, sizeOfPosition) +
					converNumberToBits(leftDirectionX, sizeOfPosition) + converNumberToBits(leftDirectionY, sizeOfPosition) +
					converNumberToBits(anchorX, sizeOfPosition) + converNumberToBits(anchorY, sizeOfPosition);
					
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