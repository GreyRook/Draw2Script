var Pixitiny = function () {};

Pixitiny.prototype = Object.create(Createjs.prototype);

/**
* Generates a PIXI_tiny API String from a givin PathItem Object.
*
* @param pathItem
* @return PIXI_tiny API String
*/
Pixitiny.prototype.parsePathItem = function (pathItem) {
    var instruction = "";
    var pathPoints = pathItem.pathPoints;

    if (pathItem.filled) {
        instruction += ".f(" + this.getColor(pathItem.fillColor, pathItem.opacity) + ")";
    }
    if (pathItem.stroked) {
		instruction += ".ss(" +pathItem.strokeWidth + ")";
        instruction += ".s(" + this.getColor(pathItem.strokeColor, pathItem.opacity) + ")";
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

/**
* Converts an color object to a PIXI_tiny compatible hex value.
*
* @param color an color object in the format {typename: "RGBColor", red: 0-255, green: 0-255, blue: 0-255} or
* {typename: "CMYKColor", cyan: 0-1, yellow: 0-1, magenta: 0-1, black: 0-1}
* @param opacity the alpha component of the rgba string. 0 is transparent, 1 is opaque.
* @return hex value in the format "0xFFFFFF"
*/
Pixitiny.prototype.getColor = function (color, opacity) {
    var r;
	var g;
	var b;
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
    return "0x" + this.convertToHex(r) + this.convertToHex(g) + this.convertToHex(b);
}

/*
 * Convers a number to a two letter hex value
 */
Pixitiny.prototype.convertToHex = function (number) {
    var hex = Math.round(number).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}