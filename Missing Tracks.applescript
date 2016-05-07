/* 

Remember to set the language from AppleScript to Javascript!

Description:
	Finds missing discs between FIRST_DISC_NUMBER and LAST_DISC_NUMBER
	and finds missing tracks.

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
	
	var discObjects = getDiscObjects(FIRST_DISC_NUMBER, LAST_DISC_NUMBER);
	this.console.log(getDiscObjects);

	// TODO sort selection into discObjects
	
	// TODO go through discObjects
	return;
	
	
	for (var a = 0; a < selection.length; a++) {
		var currentTrack = selection[a];
		
	}
	return "Done";
	
	function getDiscObjects(first, last) {
		var numbers = [];
		
		for (var a = first; a <= last; a++) {
			numbers.push({
				discNumber: a,
				tracks: [],
				trackCount: -1
			});
		}
		
		return numbers;
	}

})();