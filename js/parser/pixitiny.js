var pixitiny = function() {
	/*
	 * Convers a number to a two letter hex value
	 */
	this.convertToHex = function(number) {
		var hex = Math.round(number).toString(16);
		if(hex.length < 2) {
			hex = "0" + hex;
		}
		return hex;
	}
}

pixitiny.prototype = new createjs;

pixitiny.prototype.getColor = function(color, opacity) {
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
		return "0x" + convertToHex(r) + convertToHex(g) + convertToHex(b);
	};

