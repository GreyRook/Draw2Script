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
	if(scriptTypesValue == scriptTypesElement.options[0].value) {
		new CSInterface().evalScript("generateCreateJS({hexColor : false })", function(codeString) {
			textField.value = prefixField.value + codeString;
		});
	} else if(scriptTypesValue == scriptTypesElement.options[1].value) {
		new CSInterface().evalScript("generateCreateJS({hexColor : true })", function(codeString) {
			textField.value = prefixField.value + codeString;
		});
	}
}