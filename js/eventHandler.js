function onClickButtonSelect() {
	// @TODO Text aus dem TextFeld in die Zwischenablage kopieren.
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
	// Dropdown HTML Element in einer Variablen hinterlegen
	var scriptTypesElement = document.getElementById("scriptType");
	// Den aktuellen Wert der Variablen auslesen.
	var scriptTypesValue = scriptTypesElement.options[scriptTypesElement.selectedIndex].value;
	// Das Textfeld für die Ausgabe in einer Variablen hinterlegen
	var textField = document.getElementById("output");
	var prefixField = document.getElementById("prefix");
	new CSInterface().evalScript("generateJSON()", function(json) {
		if(scriptTypesValue == scriptTypesElement.options[0].value) {
			textField.value = prefixField.value + new createjs().generate(JSON.parse(json));
		} else if(scriptTypesValue == scriptTypesElement.options[1].value) {
			textField.value = prefixField.value + new pixitiny().generate(JSON.parse(json));
		} else if(scriptTypesValue == scriptTypesElement.options[2].value) {
			textField.value = generatePixiGraphics(JSON.parse(json));
		}
	});
}

function onLoaded() {
	themeManager.init();
}