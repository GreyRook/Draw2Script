var Pixigraphics = function () {};

Pixigraphics.prototype = Object.create(Pixitiny.prototype);

/**
* Generates a PIXI_graphics API String from a giving JSON-Object.
*
* @param json
* @return PIXI_graphics API String
*/
Pixigraphics.prototype.generate = function (json) {
    var objects = json.selection;
    var data = [];
    var type = "graphics";
    var instructions = {
        type : type
    };
    this.cropBox = json.cropBox;
    for (var i = objects.length - 1; i >= 0; i--) {
        if (objects[i].typename == "PathItem") {
            data = data.concat(this.parsePathItem(objects[i]));
        } else if (objects[i].typename == "GroupItem") {
            data = data.concat(this.parseGroupItem(objects[i]));
        } else if (objects[i].typename == "CompoundPathItem") {
            data = data.concat(this.parseCompoundPathItem(objects[i]));
        }
    }
    instructions.data = data;
    return JSON.stringify(instructions, null, 2);
}

/**
* Generates a PIXI_graphics API String from a givin PathItem Object.
*
* @param pathItem
* @return PIXI_graphics API String
*/
Pixigraphics.prototype.parsePathItem = function (pathItem) {
    var data = [];
    var pathPoints = pathItem.pathPoints;

    if (pathItem.filled) {
        data.push(this.makeDataItem("f", this.getColor(pathItem.fillColor, pathItem.opacity)));
    }
    if (pathItem.stroked) {
        data.push(this.makeDataItem("ss", pathItem.strokeWidth));
        data.push(this.makeDataItem("s", this.getColor(pathItem.strokeColor, pathItem.opacity)));
    }
    if (pathPoints.length > 0) {
        data.push(this.makeDataItem("p", this.convertPathItemToPathInstruction(pathItem)));
    }
    if (pathItem.stroked) {
        //End stroke
        data.push(this.makeDataItem("es", ""));
    }
    if (pathItem.filled) {
        //End fill
        data.push(this.makeDataItem("ef", ""));
    }
    return data;
}

Pixigraphics.prototype.parseGroupItem = function (groupItem) {
    var data = [];
    for (var i = 0; i < groupItem.groupItems.length; i++) {
        data = data.concat(this.parseGroupItem(groupItem.groupItems[i]));
    }
    for (var i = 0; i < groupItem.pathItems.length; i++) {
        data = data.concat(this.parsePathItem(groupItem.pathItems[i]));
    }
    for (var i = 0; i < groupItem.compoundPathItems.length; i++) {
        data = data.concat(this.parseCompoundPathItem(groupItem.compoundPathItems[i]));
    }
    return data;
}

Pixigraphics.prototype.parseCompoundPathItem = function (compoundPathItem) {
    var data = [];
    for (var i = 0; i < compoundPathItem.pathItems.length; i++) {
        data = data.concat(this.parsePathItem(compoundPathItem.pathItems[i]));
    }
    return data;
}

/**
* Converts an PIXI_tiny method call to an json object.
*
* @param cmd method to call in PIXI_tiny
* @param args arguments for the call
* @return json
*/
Pixigraphics.prototype.makeDataItem = function (cmd, args) {
    var dataItem = {};
    dataItem.cmd = cmd;
    dataItem.args = args;
    return dataItem;
}