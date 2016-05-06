JsOsaDAS1.001.00bplist00�Vscript_�(function() {
	var app = Application('iTunes');
	app.includeStandardAdditions = true;
	var window = app.windows[0];
	
	var selection = window.selection();
	
	for (var a = 0; a < selection.length; a++) {
		var track = selection[a];
		
		var numbers = track.name().match(/\d{3}/g);
		if (!numbers || numbers.length == 0) continue;
		
		var discNumber = get3DigitNumber(numbers);
		if (!discNumber) continue;
		
		track.discNumber.set(discNumber);
	}
	return "Done";
	
	function get3DigitNumber(arrayOfNums) {
		for (var a = 0; a < arrayOfNums.length; a++) {
			var n = arrayOfNums[a]
			if ((n + "").length === 3) {
				return n;
			}
		}
	}
})();                              � jscr  ��ޭ