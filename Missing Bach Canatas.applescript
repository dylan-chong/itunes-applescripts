/* 

Remember to set the language from AppleScript to Javascript!

Description:
	Takes the disc number (which represents the BWV number of the cantata) of each
	cantata (within the selection) and then finds what Bach cantatas you are missing.
	It doesn't include cantatas that have a letter in the BWV designation.

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
	
	var idealDiscNumbers = getIdealDiscNumbers(FIRST_DISC_NUMBER, LAST_DISC_NUMBER);
	this.console.log(idealDiscNumbers);
	return;
	
	
	for (var a = 0; a < selection.length; a++) {
		var currentTrack = selection[a];
		
		// TODO NEXT check for each 
		
	}
	return "Done";
	
	function getIdealDiscNumbers(first, last) {
		var numbers = [];
		
		for (var a = first; a <= last; a++) {
			numbers.push(a);
		}
		
		return numbers;
	}

})();