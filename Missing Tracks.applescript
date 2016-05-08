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
	var LAST_DISC_NUMBER = 10;
	
	// *************************
	
	var app = Application('iTunes');
	app.includeStandardAdditions = true;
	var window = app.windows[0];
	
	var selection = window.selection();
	var discObjects = getSortedSelection(selection);
	
	//logDiscObjects(this.console, discObjects);
	
	var missingDiscs = getMissingDiscs(discObjects);
	this.console.log(missingDiscs);
	
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
	
	function logDiscObjects(console, discObjects) {
		for (var d = 0; d < discObjects.length; d++) {
			console.log(discObjToString(discObjects[d]));
		}
	}
	
	// Note: the tracks aren't necessarily added to each discObj's tracks
	// array in the correct order - it depends on the order of the selection.
	function getSortedSelection(selection) {
		var discObjects = getDiscObjects(FIRST_DISC_NUMBER, LAST_DISC_NUMBER);
		
		for (var s = 0; s < selection.length; s++) {
			var track = selection[s];
			var discNumber = track.discNumber();
			
			if (discNumber > LAST_DISC_NUMBER) continue;
			if (discNumber < FIRST_DISC_NUMBER) continue;
			
			// TODO fix out of range errors
			var discObj = discObjects[discNumber-1];
			discObj.tracks.push(track);
			discObj.trackCount = track.trackCount();
		}
		
		return discObjects;
	}
	
	function getMissingDiscs(discObjects) {
		var missingDiscNumbers = [];
	
		for (var a = 0; a < discObjects.length; a++) {
			var discObj = discObjects[a];
			if (discObj.trackCount == -1) {
				missingDiscNumbers.push(discObj.discNumber);
				continue;
			}
		}
		
		return missingDiscNumbers;
	}
	
	function getMissingTracks(discObjects) {
		var missingTrackObjects = [];
	
		for (var a = 0; a < discObjects.length; a++) { 
			var missingTrackObj = getMissingTrackObjectForDiscObject(discObjects);
			if (missingTrackObj) missingTrackObjects.push(missingTrackObj);
		}
	}
	
	function getMissingTrackObjectForDiscObject(discObj) {
		if (discObj.trackCount == discObj.tracks.length) return null;
		
		var obj = {
			idealTrackCount: discObj.trackCount,
			missingTrackNumbers: []
		};
		
		// TODO go each track number and see if there is a missing track
		//for (var a = 1; a <= 
		
		return obj;
	}

})();