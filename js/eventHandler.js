function onClickButtonSelect() {
	var textField = document.getElementById("output");
	textField.select();
}

function onClickWrap() {
	var textField = document.getElementById("output");
	var checkboxWrap = document.getElementById("wrap");
	if(checkboxWrap.checked) {
		textField.wrap = hard;
	} else {
		textField.wrap = soft;
	}
}

function onClickButtonGenerate() {
	var scriptTypesElement = document.getElementById("scriptType");
	var scriptTypesValue = scriptTypesElement.options[scriptTypesElement.selectedIndex].value;
	var textField = document.getElementById("output");
	var prefixField = document.getElementById("prefix");
	new CSInterface().evalScript("generateJSON()", function(json) {
		if(scriptTypesValue == scriptTypesElement.options[0].value) {
			textField.value = prefixField.value + (new Createjs()).generate(JSON.parse(json));
		} else if(scriptTypesValue == scriptTypesElement.options[1].value) {
			textField.value = prefixField.value + (new Pixitiny()).generate(JSON.parse(json));
		} else if(scriptTypesValue == scriptTypesElement.options[2].value) {
			textField.value = (new Pixigraphics()).generate(JSON.parse(json));
		} else if(scriptTypesValue == scriptTypesElement.options[3].value) {
			textField.value = json;
		}
	});
}

function onLoaded() {
	themeManager.init();
}