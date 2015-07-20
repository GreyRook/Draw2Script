// actual test-case
describe("Createjs Parser Test Suite", function() {

	var createjs = new Createjs();

	it("testConvertPathItemToPathInstruction", function() {
		createjs.cropBox = [0,0];
		var pathItem = {
	        "pathPoints" : [{
	                "anchor" : [
	                    0,
	                    0
	                ],
	                "leftDirection" : [
	                    0,
	                    0
	                ],
	                "rightDirection" : [
	                    0,
	                    0
	                ]
	            }
	        ]
	    };
		expect(createjs.convertPathItemToPathInstruction(pathItem)).toBe("EAAAAAA");
		
		pathItem = {
		    "pathPoints" : [{
		            "anchor" : [
		                0,
		                0
		            ],
		            "leftDirection" : [
		                0,
		                0
		            ],
		            "rightDirection" : [
		                0,
		                0
		            ]
		        }, {
		            "anchor" : [
		                10,
		                0
		            ],
		            "leftDirection" : [
		                10,
		                0
		            ],
		            "rightDirection" : [
		                10,
		                0
		            ]
		        }
		    ]
		};
		expect(createjs.convertPathItemToPathInstruction(pathItem)).toBe("EAAAAAAMABkAAA");
	});
	
    it("testGetColor", function () {
	    var testColor = {
		    typename: 'RGBColor',
		    red: '0',
		    green: '0',
		    blue: '0'
	    };

	    var testOpactiy = 100;
	    expect(createjs.getColor(testColor, testOpactiy)).toBe("'rgba(0,0,0,1)'");

	    testColor = {
			    typename: 'RGBColor',
			    red: '255',
			    green: '255',
			    blue: '255'
	    };
	    expect(createjs.getColor(testColor, testOpactiy)).toBe("'rgba(255,255,255,1)'");

	    testColor = {
			    typename: 'CMYKColor',
			    cyan: '0',
			    black: '100',
			    magenta: '0',
			    yellow: '0'
	    }
	    expect(createjs.getColor(testColor, testOpactiy)).toBe("'rgba(0,0,0,1)'");
    });
	
	it('testGetStrokeStyle', function() {
		var pathItem = {
	        "typename" : "PathItem",
	        "closed" : true,
	        "filled" : false,
	        "fillColor" : {
	            "gray" : 0,
	            "typename" : "GrayColor"
	        },
	        "opacity" : 100,
	        "stroked" : true,
	        "strokeColor" : {
	            "cyan" : 0,
	            "magenta" : 0,
	            "yellow" : 0,
	            "black" : 100,
	            "typename" : "CMYKColor"
	        },
	        "strokeDashes" : [

	        ],
	        "strokeDashOffset" : 0,
	        "strokeCap" : "StrokeCap.BUTTENDCAP",
	        "strokeJoin" : "StrokeJoin.MITERENDJOIN",
	        "strokeMiterLimit" : 10,
	        "strokeWidth" : 6,
	        "pathPoints" : [{
	                "anchor" : [
	                    0,
	                    0
	                ],
	                "leftDirection" : [
	                    0,
	                    0
	                ],
	                "rightDirection" : [
	                    0,
	                    0
	                ]
	            }, {
	                "anchor" : [
	                    10,
	                    0
	                ],
	                "leftDirection" : [
	                    10,
	                    0
	                ],
	                "rightDirection" : [
	                    10,
	                    0
	                ]
	            }, {
	                "anchor" : [
	                    10,
	                    10
	                ],
	                "leftDirection" : [
	                    10,
	                    10
	                ],
	                "rightDirection" : [
	                    10,
	                    10
	                ]
	            }, {
	                "anchor" : [
	                    0,
						10
	                ],
	                "leftDirection" : [
	                     0,
						10
	                ],
	                "rightDirection" : [
	                     0,
						10
	                ]
	            }
	        ]
	    };
		
		expect(createjs.getStrokeStyle(pathItem)).toBe("6,0,0,10");
	});


    it('testConvertBitToBase64', function () {
	    var bits = ["000000", "000001", "111111000000"];
	    var base64 = ["A", "B", "/A"];
	    for(var i = 0; i < bits.length; i++) {
		    expect(createjs.convertBitToBase64(bits[i])).toBe(base64[i]);
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
		    expect(createjs.convertNumberToBits(number[i],12)).toBe(bits12[i]);
		    expect(createjs.convertNumberToBits(number[i],18)).toBe(bits18[i]);
	    }
    });
});
