/*

Remember to set the language from AppleScript to Javascript!

Description:
	Sets the first track's disc number to FIRST_DISC, the second 
	to FIRST_DISC + INCREMENT, the third to FIRST_DISC + 2*INCREMENT,
	etc.

Example Selection:

Example Result:


*/

(function() {

	// ******* Constants *******

	var FIRST_DISC = 1;
	var INCREMENT = 1;
	
	// *************************
	
	var app = Application('iTunes');
	app.includeStandardAdditions = true;
	var window = app.windows[0];
	
	var selection = window.selection();
	
	for (var a = 0; a < selection.length; a++) {
		var track = selection[a];
		var disc = FIRST_DISC + a*INCREMENT;
		
		// Code that applies the changes:
		// track.discNumber.set(disc);
		
		this.console.log("Disc: " + disc + ", Name: " + track.name());
	}
	return "Done";
})();