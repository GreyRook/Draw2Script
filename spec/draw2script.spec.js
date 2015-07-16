// hack for executing code on node.js
if(typeof module !== 'undefined') {
    fs = require('fs');
    var code = fs.readFileSync('host/draw2script.jsx', 'utf-8');
    eval(code);
}


// actual test-case
describe("Draw2Script Test Suite", function() {

    it("testGetColor", function () {
	    var testColor = {
		    typename: 'RGBColor',
		    red: '0',
		    green: '0',
		    blue: '0'
	    };

	    var testOpactiy = 100;
	    expect(getColor(testColor, testOpactiy)).toBe("'rgba(0,0,0,1)'");

	    testColor = {
			    typename: 'RGBColor',
			    red: '255',
			    green: '255',
			    blue: '255'
	    };
	    expect(getColor(testColor, testOpactiy)).toBe("'rgba(255,255,255,1)'");

	    testColor = {
			    typename: 'CMYKColor',
			    cyan: '0',
			    black: '100',
			    magenta: '0',
			    yellow: '0'
	    }
	    expect(getColor(testColor, testOpactiy)).toBe("'rgba(0,0,0,1)'");

	    hexColor = true;
	    expect(getColor(testColor, testOpactiy)).toBe("0x000000");
    });


    it('testConvertBitToBase64', function () {
	    var bits = ["000000", "000001", "111111000000"];
	    var base64 = ["A", "B", "/A"];
	    for(var i = 0; i < bits.length; i++) {
		    expect(convertBitToBase64(bits[i])).toBe(base64[i]);
	    }
    });

    it('testConvertToHex', function () {
	    var number = [0,2,5,6,255,100];
	    var hex = ["00","02","05","06","ff","64"];
	    for(var i = 0; i < number.length; i++) {
		    expect(convertToHex(number[i])).toBe(hex[i]);
	    }
    });

    it('testConvertNumberToBits', function () {
	    var number = [0,0.2,0.4,0.6,0.8,10.0,100.0,200000.0,-0.1,-2.0];
	    var bits12 = ["000000000000","000000000010","000000000100","000000000110","000000001000",
	                  "000001100100","001111101000","overflow","100000000001","100000010100"];
	    var bits18 = ["000000000000000000","000000000000000010","000000000000000100",
	                  "000000000000000110","000000000000001000","000000000001100100",
	                  "000000001111101000","overflow","100000000000000001","100000000000010100"];
	    for(var i = 0; i < number.length; i++) {
		    expect(convertNumberToBits(number[i],12)).toBe(bits12[i]);
		    expect(convertNumberToBits(number[i],18)).toBe(bits18[i]);
	    }
    });
});
