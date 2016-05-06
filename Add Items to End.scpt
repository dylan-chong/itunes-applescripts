JsOsaDAS1.001.00bplist00�Vscript_�(function() {
	var INITIAL_DISK_NUMBER = 1;
	
	// *************************
	
	var app = Application('iTunes');
	app.includeStandardAdditions = true;
	var window = app.windows[0];
	
	var selection = window.selection();
	
	var discNumber = INITIAL_DISK_NUMBER;
	var previousTrackName = null;
	
	
	for (var a = 0; a < selection.length; a++) {
		var currentTrack = selection[a];
		var currentTrackName = currentTrack.name();
		
		if (!shouldKeepSameDiscNumber(currentTrackName, previousTrackName)) 
			discNumber++;
		
		previousTrackName = currentTrackName;
		
		currentTrack.discNumber.set(discNumber);
		this.console.log(currentTrackName + ": " + discNumber + "\n");
	}
	return "Done";

	function shouldKeepSameDiscNumber(trackName, previousTrackName) {
		if (!previousTrackName) return true;
		
		var firstPrefix = trackName.split("-")[0];
		var secondPrefix = previousTrackName.split("-")[0];
		
		if (firstPrefix == secondPrefix) return true;
		return false;
	}
})();                              �jscr  ��ޭ