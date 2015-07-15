testGetColor();
testConvertBitToBase64();
testConvertToHex();
testConvertNumberToBits();

function testGetColor() {
	var testColor = {
		typename: 'RGBColor',
		red: '0',
		green: '0',
		blue: '0'
	};
	
	var testOpactiy = 100;
	expect(getColor(testColor, testOpactiy)).to.eql("'rgba(0,0,0,1)'");	
	
	testColor = {
			typename: 'RGBColor',
			red: '255',
			green: '255',
			blue: '255'
	};
	expect(getColor(testColor, testOpactiy)).to.eql("'rgba(255,255,255,1)'");	
	
	testColor = {
			typename: 'CMYKColor',
			cyan: '0',
			black: '100',
			magenta: '0',
			yellow: '0'
	}
	expect(getColor(testColor, testOpactiy)).to.eql("'rgba(0,0,0,1)'");

	hexColor = true;
	expect(getColor(testColor, testOpactiy)).to.eql("0x000000");
}

function testConvertBitToBase64() {
	var bits = ["000000", "000001", "111111000000"];
	var base64 = ["A", "B", "/A"];
	for(var i = 0; i < bits.length; i++) {
		expect(convertBitToBase64(bits[i])).to.eql(base64[i]);
	}
}

function testConvertToHex() {
	var number = [0,2,5,6,255,100];
	var hex = ["00","02","05","06","ff","64"];
	for(var i = 0; i < number.length; i++) {
		expect(convertToHex(number[i])).to.eql(hex[i]);
	}
}

function testConvertNumberToBits() {
	var number = [0,0.2,0.4,0.6,0.8,10.0,100.0,200000.0,-0.1,-2.0];
	var bits12 = ["000000000000","000000000010","000000000100","000000000110","000000001000",
	              "000001100100","001111101000","overflow","100000000001","100000010100"];
	var bits18 = ["000000000000000000","000000000000000010","000000000000000100",
	              "000000000000000110","000000000000001000","000000000001100100",
	              "000000001111101000","overflow","100000000000000001","100000000000010100"];
	for(var i = 0; i < number.length; i++) {
		expect(convertNumberToBits(number[i],12)).to.eql(bits12[i]);
		expect(convertNumberToBits(number[i],18)).to.eql(bits18[i]);
	}
}