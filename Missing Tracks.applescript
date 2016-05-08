/* 

Remember to set the language from AppleScript to Javascript!

Description:
	Finds missing discs between FIRST_DISC_NUMBER and LAST_DISC_NUMBER
	and finds missing tracks (as long as the track count is set). This
	script doesn't apply any changes to the tracks so there's nothing 
	that needs to be uncommented to run.

Example Selection:


Example Result:
	
*/

(function() {

	// ******* Constants *******

	var FIRST_DISC_NUMBER = 1;
	var LAST_DISC_NUMBER = 210;
	
	// *************************
	
	var app = Application('iTunes');
	app.includeStandardAdditions = true;
	var window = app.windows[0];
	
	var selection = window.selection();
	var discObjects = getSortedSelection(selection);
	
	for (var d = 0; d < discObjects.length; d++) {
		this.console.log(discObjToString(discObjects[d]));
	}
	
	return;

	// TODO go through discObjects
	
	
	return "Done";
	
	
	function getDiscObjects(first, last) {
		var numbers = [];
		
		for (var a = first; a <= last; a++) {
			numbers.push({
				discNumber: a, // this matches the index of the array, 
				// so it's just for debugging
				tracks: [],
				trackCount: -1,
			});
		}
		
		return numbers;
	}
	
	function discObjToString(discObj) {
		var ret = "Disc number: " + discObj.discNumber + ",\n";
		ret += "\tTrack count: " + discObj.trackCount + ",\n";
		ret += "\tTracks:\n";
		
		for (var t = 0; t < discObj.tracks.length; t++) {
			var track = discObj.tracks[t];
			var line = "\t\tTrack: ";
			
			line += track.trackNumber() + " of " + track.trackCount();
			line += ", Name: " + track.name();
		
			ret += line + "\n";
		}
		
		return ret;
	}
	
	// Note: the tracks aren't necessarily added to each discObj's tracks
	// array in the correct order - it depends on the order of the selection.
	function getSortedSelection(selection) {
		var discObjects = getDiscObjects(FIRST_DISC_NUMBER, LAST_DISC_NUMBER);
		
		for (var s = 0; s < selection.length; s++) {
			var track = selection[s];
			var discNumber = track.discNumber();
			
			// TODO fix out of range errors
			var discObj = discObjects[discNumber-1];
			discObj.tracks.push(track);
			discObj.trackCount = track.trackCount();
		}
		
		return discObjects;
	}

})();