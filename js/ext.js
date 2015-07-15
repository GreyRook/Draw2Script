function onClickButtonCopy() {
	// @TODO Text aus dem TextFeld in die Zwischenablage kopieren.
	var textField = document.getElementById("output");
	textField.select();
}


function onClickButtonGenerate() {
	// Dropdown HTML Element in einer Variablen hinterlegen
	var scriptTypesElement = document.getElementById("scriptType");
	// Den aktuellen Wert der Variablen auslesen.
	var scriptTypesValue = scriptTypesElement.options[scriptTypesElement.selectedIndex].value;
	// Das Textfeld für die Ausgabe in einer Variablen hinterlegen
	var textField = document.getElementById("output");
	if(scriptTypesValue == scriptTypesElement.options[0].value) {
		new CSInterface().evalScript("generateCreateJS({hexColor : false })", function(codeString) {
			textField.value = codeString;
		});
	} else if(scriptTypesValue == scriptTypesElement.options[1].value) {
		new CSInterface().evalScript("generateCreateJS({hexColor : true })", function(codeString) {
			textField.value = codeString;
		});
	}
}