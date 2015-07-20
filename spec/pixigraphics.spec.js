// hack for executing code on node.js
if(typeof module !== 'undefined') {
    fs = require('fs');
	var code = fs.readFileSync('js/parser/createjs.js', 'utf-8');
	eval(code);
	code = fs.readFileSync('js/parser/pixitiny.js', 'utf-8');
    eval(code);
    code = fs.readFileSync('js/parser/pixigraphics.js', 'utf-8');
    eval(code);
}


// actual test-case
describe("PIXI_graphics Parser Test Suite", function() {
	
	var pixigraphics = new Pixigraphics();
	
	it("testGenerate", function() {
		var pathItem = {
	        "typename" : "PathItem",
	        "closed" : true,
	        "filled" : true,
	        "fillColor" : {
	            "red" : 0,
				"green" : 0,
				"blue" : 0,
	            "typename" : "RGBColor"
	        },
	        "opacity" : 100,
	        "stroked" : false,
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
		
		var groupItem = {
			"typename": "GroupItem",
			"groupItems": [],
			"pathItems": [pathItem],
			"compoundPathItems": []
		};
		
		var json = {
			"cropBox" : [0,0],
			"selection" : [groupItem]
		}
		
		pixigraphics.cropBox = json.cropBox;
		
		var expectedData = [{cmd : "f", args: "0x000000"},{
				cmd: "p", args: pixigraphics.convertPathItemToPathInstruction(pathItem)},
				{cmd: "ef", args: ""}];
		var expectedResult = {
			type : "graphics",
			data : expectedData
		};
		this.cropBox = json.cropBox;
		var result = pixigraphics.generate(json);
		
		expect(result).toBe(JSON.stringify(expectedResult, null, 2));
	});
	
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
		
		pathItem = {
	        "typename" : "PathItem",
	        "closed" : true,
	        "filled" : false,
	        "fillColor" : {
	            "gray" : 0,
	            "typename" : "GrayColor"
	        },
	        "opacity" : 100,
	        "stroked" : false,
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
		
		expectedResult = [{
				cmd: "p", args: pixigraphics.convertPathItemToPathInstruction(pathItem)}];
		result = pixigraphics.parsePathItem(pathItem);
		
		for(var i = 0; i < expectedResult.length; i++) {
			expect(result[i].cmd).toBe(expectedResult[i].cmd);
			expect(result[i].args).toBe(expectedResult[i].args);
		}
		
		pathItem = {
	        "typename" : "PathItem",
	        "closed" : true,
	        "filled" : true,
	        "fillColor" : {
	            "red" : 0,
				"green" : 0,
				"blue" : 0,
	            "typename" : "RGBColor"
	        },
	        "opacity" : 100,
	        "stroked" : false,
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
		
		expectedResult = [{cmd : "f", args: "0x000000"},{
				cmd: "p", args: pixigraphics.convertPathItemToPathInstruction(pathItem)},
				{cmd: "ef", args: ""}];
		result = pixigraphics.parsePathItem(pathItem);
		
		for(var i = 0; i < result.length; i++) {
			expect(result[i].cmd).toBe(expectedResult[i].cmd);
			expect(result[i].args).toBe(expectedResult[i].args);
		}
	});
	
	it("testParseGroupItem", function() {
		pixigraphics.cropBox = [0,0];
		var groupItem = {
		"typename": "GroupItem",
		"groupItems": [],
		"pathItems": [],
		"compoundPathItems": []
		}
		var result = pixigraphics.parseGroupItem(groupItem);
		var expectedResult = [];
		for(var i = 0; i < result.length; i++) {
			expect(result[i]).toBe(expectedResult[i]);
		}
		
		pathItem = {
	        "typename" : "PathItem",
	        "closed" : true,
	        "filled" : true,
	        "fillColor" : {
	            "red" : 0,
				"green" : 0,
				"blue" : 0,
	            "typename" : "RGBColor"
	        },
	        "opacity" : 100,
	        "stroked" : false,
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
		
		groupItem = {
			"typename": "GroupItem",
			"groupItems": [],
			"pathItems": [pathItem,pathItem],
			"compoundPathItems": []
		};
		expectedResult = [{cmd : "f", args: "0x000000"},{
				cmd: "p", args: pixigraphics.convertPathItemToPathInstruction(pathItem)},
				{cmd: "ef", args: ""},{cmd : "f", args: "0x000000"},{
				cmd: "p", args: pixigraphics.convertPathItemToPathInstruction(pathItem)},
				{cmd: "ef", args: ""}];
				
		result = pixigraphics.parseGroupItem(groupItem);
		
		for(var i = 0; i < result.length; i++) {
			expect(result[i].cmd).toBe(expectedResult[i].cmd);
			expect(result[i].args).toBe(expectedResult[i].args);
		}
		
		groupItem2 =  {
			"typename": "GroupItem",
			"groupItems": [groupItem],
			"pathItems": [pathItem],
			"compoundPathItems": []
		};
		
		expectedResult = [{cmd : "f", args: "0x000000"},{
				cmd: "p", args: pixigraphics.convertPathItemToPathInstruction(pathItem)},
				{cmd: "ef", args: ""},{cmd : "f", args: "0x000000"},{
				cmd: "p", args: pixigraphics.convertPathItemToPathInstruction(pathItem)},
				{cmd: "ef", args: ""},{cmd : "f", args: "0x000000"},{
				cmd: "p", args: pixigraphics.convertPathItemToPathInstruction(pathItem)},
				{cmd: "ef", args: ""}];
				
		result = pixigraphics.parseGroupItem(groupItem);
		
		for(var i = 0; i < result.length; i++) {
			expect(result[i].cmd).toBe(expectedResult[i].cmd);
			expect(result[i].args).toBe(expectedResult[i].args);
		}
		
		
	});
});