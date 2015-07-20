var Createjs = function () {};

Createjs.prototype.BASE_64 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
    "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g",
    "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"];

//Map instructions to values
Createjs.prototype.instructions = {
    "moveTo" : "000",
    "lineTo" : "001",
    "quadraticCurveTo" : "010",
    "bezierCurveTo" : "011",
    "closePath" : "100"
};

//Map instructions to parameter count
Createjs.prototype.paramCount = {
    "moveTo" : 2,
    "lineTo" : 2,
    "quadraticCurveTo" : 4,
    "bezierCurveTo" : 6,
    "closePath" : 0
};

//Map size of position property to bits
Createjs.prototype.sizeOfPositions = {
    "12" : 0,
    "18" : 1
};

Createjs.prototype.unusedBits = "00";

Createjs.prototype.cropBox;


/**
* Generates a CreateJS Tiny API String from a giving JSON-Object.
*
* @param json
* @return CreateJS Tiny API String
*/
Createjs.prototype.generate = function (json) {
    var objects = json.selection;
    var instruction = "";
    this.cropBox = json.cropBox;
    for (var i = objects.length - 1; i >= 0; i--) {
        if (objects[i].typename == "PathItem") {
            instruction += this.parsePathItem(objects[i]);
        } else if (objects[i].typename == "GroupItem") {
            instruction += this.parseGroupItem(objects[i]);
        } else if (objects[i].typename == "CompoundPathItem") {
            instruction += this.parseCompoundPathItem(objects[i]);
        }
    }
    if (objects.length > 0) {
        instruction += ".cp()";
    }
    return instruction;
}

/**
* Generates a CreateJS Tiny API String from a givin PathItem Object.
*
* @param pathItem
* @return CreateJS Tiny API String
*/
Createjs.prototype.parsePathItem = function (pathItem) {
    var instruction = "";
    var pathPoints = pathItem.pathPoints;

    if (pathItem.filled) {
        instruction += ".f(" + this.getColor(pathItem.fillColor, pathItem.opacity) + ")";
    }
    if (pathItem.stroked) {
        instruction += ".ss(" + this.getStrokeStyle(pathItem) + ")";
        instruction += ".s(" + this.getColor(pathItem.strokeColor, pathItem.opacity) + ")";
    }
    if (pathItem.stroked) {
        var strokeDashes = pathItem.strokeDashes;
        var strokeDashOffset = 0;
        instruction += ".sd([" + strokeDashes + "]," + strokeDashOffset + ")";
    }
    if (pathPoints.length > 0) {
        instruction += ".p('" + this.convertPathItemToPathInstruction(pathItem) + "')";
    }
    if (pathItem.stroked) {
        //End stroke
        instruction += ".es()";
    }
    if (pathItem.filled) {
        //End fill
        instruction += ".ef()";
    }
    return instruction;
}

Createjs.prototype.parseGroupItem = function (groupItem) {
    var instruction = "";
    for (var i = 0; i < groupItem.groupItems.length; i++) {
        instruction += this.parseGroupItem(groupItem.groupItems[i]);
    }
    for (var i = 0; i < groupItem.pathItems.length; i++) {
        instruction += this.parsePathItem(groupItem.pathItems[i]);
    }
    for (var i = 0; i < groupItem.compoundPathItems.length; i++) {
        instruction += this.parseCompoundPathItem(groupItem.compoundPathItems[i]);
    }
    return instruction;
}

Createjs.prototype.parseCompoundPathItem = function (compoundPathItem) {
    var instruction = "";
    for (var i = 0; i < compoundPathItem.pathItems.length; i++) {
        instruction += this.parsePathItem(compoundPathItem.pathItems[i]);
    }
    return instruction;
}

/**
* Generates a encoded path string by converting a series of pathPoints to an bit string, which is
* then encoded to a BASE_64 string.
*
* @param pathItem
* @return a encoded path string
*/
Createjs.prototype.convertPathItemToPathInstruction = function (pathItem) {

    var pathPoints = pathItem.pathPoints;

    //Easeljs uses absolute movement for the first command
    var moveToX = pathPoints[0].anchor[0] + this.cropBox[0];
    var moveToY = -1 * pathPoints[0].anchor[1] + this.cropBox[1];

    //12 bits you can used numbers up to 2047, 18 bits you can use numbers up to 131071.
    var sizeOfPosition = 18;

    var bitInstruction = this.instructions["moveTo"] + this.sizeOfPositions[sizeOfPosition] +
        this.unusedBits + this.convertNumberToBits(moveToX, sizeOfPosition) +
        this.convertNumberToBits(moveToY, sizeOfPosition);

    var pathInstruction = this.convertBitToBase64(bitInstruction);

    if (pathPoints.length > 1) {
        for (var i = 0; i < (pathItem.closed ? pathPoints.length : (pathPoints.length - 1)); i++) {
            var previousPoint = pathPoints[i % pathPoints.length];
            var currentPoint = pathPoints[(i + 1) % pathPoints.length];

            if (currentPoint.anchor[0] == currentPoint.leftDirection[0] &&
					currentPoint.anchor[0] == currentPoint.rightDirection[0] &&
					currentPoint.anchor[1] == currentPoint.leftDirection[1] &&
					currentPoint.anchor[1] == currentPoint.rightDirection[1]) {
                var lineToX = currentPoint.anchor[0] - previousPoint.anchor[0];
                var lineToY = -1 * currentPoint.anchor[1] + previousPoint.anchor[1];

                bitInstruction = this.instructions["lineTo"] + this.sizeOfPositions[sizeOfPosition] + this.unusedBits +
                    this.convertNumberToBits(lineToX, sizeOfPosition) + this.convertNumberToBits(lineToY, sizeOfPosition);

                pathInstruction += this.convertBitToBase64(bitInstruction);
            } else {
                var anchorX = currentPoint.anchor[0] - currentPoint.leftDirection[0];
                var anchorY = -1 * currentPoint.anchor[1] + currentPoint.leftDirection[1];

                var leftDirectionX = currentPoint.leftDirection[0] - previousPoint.rightDirection[0];
                var leftDirectionY = -1 * currentPoint.leftDirection[1] + previousPoint.rightDirection[1];

                var rightDirectionX = previousPoint.rightDirection[0] - previousPoint.anchor[0];
                var rightDirectionY = -1 * previousPoint.rightDirection[1] + previousPoint.anchor[1];

                bitInstruction = this.instructions["bezierCurveTo"] +
                    this.sizeOfPositions[sizeOfPosition] + this.unusedBits +
                    this.convertNumberToBits(rightDirectionX, sizeOfPosition) +
                    this.convertNumberToBits(rightDirectionY, sizeOfPosition) +
                    this.convertNumberToBits(leftDirectionX, sizeOfPosition) +
                    this.convertNumberToBits(leftDirectionY, sizeOfPosition) +
                    this.convertNumberToBits(anchorX, sizeOfPosition) +
                    this.convertNumberToBits(anchorY, sizeOfPosition);

                pathInstruction += this.convertBitToBase64(bitInstruction);
            }
        }
    }
    return pathInstruction;
}

/**
* Converts an color object to a css compatible rgba string.
*
* @param color an color object in the format {typename: "RGBColor", red: 0-255, green: 0-255, blue: 0-255} or
* {typename: "CMYKColor", cyan: 0-1, yellow: 0-1, magenta: 0-1, black: 0-1}
* @param opacity the alpha component of the rgba string. 0 is transparent, 1 is opaque.
* @return a css compatible color string in the format "rgba(255,255,255,1)"
*/
Createjs.prototype.getColor = function (color, opacity) {
    var r,
    g,
    b;
    var a = opacity / 100;

    if (color.typename == "RGBColor") {
        r = color.red;
        g = color.green;
        b = color.blue;
    } else if (color.typename == "CMYKColor") {
        //CYMK Color Codes
        var k = color.black;
        var c = color.cyan;
        var m = color.magenta;
        var y = color.yellow;

        //RGB Color Codes
        r = 255 * (1 - c / 100) * (1 - k / 100);
        g = 255 * (1 - m / 100) * (1 - k / 100);
        b = 255 * (1 - y / 100) * (1 - k / 100);
    }
    return "'rgba(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + "," + a + ")'";
}

/**
* Filters needed properties from a pathItem and converts them to arguments for the ss method.
*
* @return ss arguments
*/
Createjs.prototype.getStrokeStyle = function (pathItem) {
    var strokeWidth = pathItem.strokeWidth;
    var strokeCap;
    var strokeJoin;
    var strokeMiterLimit = pathItem.strokeMiterLimit;

    if (pathItem.strokeCap == "StrokeCap.BUTTENDCAP") {
        strokeCap = 0;
    } else if (pathItem.strokeCap == "StrokeCap.PROJECTINGENDCAP") {
        strokeCap = 1;
    } else if (pathItem.strokeCap == "StrokeCap.ROUNDENDCAP") {
        strokeCap = 2;
    }

    if (pathItem.strokeJoin == "StrokeJoin.MITERENDJOIN") {
        strokeJoin = 0;
    } else if (pathItem.strokeJoin == "StrokeJoin.ROUNDENDJOIN") {
        strokeJoin = 1;
    } else if (pathItem.strokeJoin == "StrokeJoin.BEVELENDJOIN") {
        strokeJoin = 2;
    }
    return strokeWidth + "," + strokeCap + "," + strokeJoin + "," + strokeMiterLimit;
}

/*
 * Converts a string of bits to a base64 string
 */
Createjs.prototype.convertBitToBase64 = function (bits) {
    var base64String = "";
    var loops = bits.length / 6;
    for (var i = 0; i < loops; i++) {
        var bitsChunk = bits.substring(i * 6, i * 6 + 6);
        var intFromBitsChunk = parseInt(bitsChunk, 2);
        var base64Char = this.BASE_64[intFromBitsChunk];
        base64String += base64Char;
    }
    return base64String;
}

/**
 * Floors a number an then converts it to a bit String. When the number is negative the MSB will
 * be 1, when it is positive the MSB will be 0.
 *
 * @param number Number which will be converted to a bit String
 * @param size Number of bits which will be used to represent number
 * @return bit string
 */
Createjs.prototype.convertNumberToBits = function (number, size) {
    //Easeljs has an accuracy of 1/10 of a pixel.
    number = number * 10;
    var sign = (number < 0 ? "1" : "0");
    var result = Math.abs(Math.round(number)).toString(2);
    while (result.length < size - 1) {
        result = "0" + result;
    }
	if(result.length - 1 > size) {
		return "overflow";
	}
    return sign + result;
}