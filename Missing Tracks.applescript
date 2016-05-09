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
	
	// Completely Missing
	var missingDiscs = getMissingDiscs(discObjects);
	this.console.log("Completely missing discs: " + missingDiscs);
	
	// Partially Missing
	for (var a = 0; a < discObjects.length; a++) {
		var obj = getMissingTrackObjectForDiscObject(discObjects[a]);
		if (!obj) continue;
		
		this.console.log(missingTrackObjectToString(obj));
	}
	
	
	// TODO log partially missing discs (need for loop)
	
	
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
	
	function getMissingTrackObjectForDiscObject(discObj) { // TODO fix bugs in here
		var obj = {
			discNumber: discObj.discNumber,
			idealTrackCount: discObj.trackCount,
			missingTrackNumbers: null,
			extraTrackNumbers: null,
		};
		
		var missing = [];
		var extra = [];
		
		// Add the ideal track numbers
		for (var a = 0; a < obj.idealTrackCount; a++) {
			missing.push(a + 1);
		}
		
		// Remove the existing track numbers
		for (var a = 0; a < discObj.tracks.length; a++) {
			var track = discObj.tracks[a];
			if (missing.indexOf(track.trackNumber()) != -1) {
				missing.splice(missing.indexOf(track.trackNumber(), 1));
			} else {
				extra.push(track.trackNumber());
			}
		}
		
		if (missing.length == 0) return null;
		
		obj.missingTrackNumbers = missing;
		obj.extraTrackNumbers = extra;
		
		return obj;
	}
	
	function missingTrackObjectToString(obj) {
		var str = "Disc Number: " + obj.disc;
		str += "\n\t" + "Ideal Track Count: " + obj.idealTrackCount;
		str += "\n\t" + "Missing Track Numbers: " + obj.missingTrackNumbers.toString();
		if (obj.extraTracks.length > 0) 
			str += "\n\t" + "Extra Track Numbers: " + obj.extraTracks.toString();
		return str;
	}

})();