// hack for executing code on node.js
if(typeof module !== 'undefined') {
    fs = require('fs');
    var code = fs.readFileSync('js/parser/pixigraphics.js', 'utf-8');
    eval(code);
}


// actual test-case
describe("PIXI_graphics Parser Test Suite", function() {
	
	var pixigraphics = new Pixigraphics();
	
	it("testMakeDataItem", function() {
		var cmd = "p";
		var args = "0x000000";
		
		var expectedResult = {
			cmd: "p",
			args: "0x000000"
		}
		expect(JSON.stringify(pixigraphics.makeDataItem(cmd,args))).toBe(JSON.stringify(expectedResult));
	});
	
	it("testParsePathItem", function() {
		pixigraphics.cropBox = [0,0];
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
	        "strokeCap" : {},
	        "strokeJoin" : {},
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
		
		var expectedResult = [{cmd: "ss", args:6},{cmd: "s", args :"0x000000"},{
				cmd: "p", args: pixigraphics.convertPathItemToPathInstruction(pathItem)}];
		var result = pixigraphics.parsePathItem(pathItem);
		
		for(var i = 0; i < expectedResult.length; i++) {
			expect(result[i].cmd).toBe(expectedResult[i].cmd);
			expect(result[i].args).toBe(expectedResult[i].args);
		}
	});
});