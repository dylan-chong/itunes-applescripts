/* 

Remember to set the language from AppleScript to Javascript!

Description:
	Takes the selection and checks whether then next should be part of the same disk
	as the previous by checking the track name before the first DELIMITER (a hyphen
	in the below example). It sets the disc numbers starting from INITIAL_DISK_NUMBER,
	increasing by one for each disk.

Example Selection:
	Concerto Grosso Op.3 No.1 in B flat major - I. Allegro
	Concerto Grosso Op.3 No.1 in B flat major - II. Largo
	Concerto Grosso Op.3 No.1 in B flat major - III. Allegro
	Concerto Grosso Op.3 No.2 in B flat major - I. Vivace
	Concerto Grosso Op.3 No.2 in B flat major - II. Largo
	Concerto Grosso Op.3 No.2 in B flat major - III. Allegro
	Concerto Grosso Op.3 No.2 in B flat major - IV. Moderato
	Concerto Grosso Op.3 No.2 in B flat major - V. Allegro
	Concerto Grosso Op.3 No.3 in G major - I. Largo, e staccato - allegro
	Concerto Grosso Op.3 No.3 in G major - II. Andante
	Concerto Grosso Op.3 No.3 in G major - III. Allegro
	Concerto Grosso Op.3 No.4 in F major - I. Largo
	Concerto Grosso Op.3 No.4 in F major - II. Andante
	Concerto Grosso Op.3 No.4 in F major - III. Allegro
	Concerto Grosso Op.3 No.4 in F major - IV. Allegro
	Concerto Grosso Op.3 No.5 in D minor - I. Largo
	Concerto Grosso Op.3 No.5 in D minor - II. Fuga, allegro
	Concerto Grosso Op.3 No.5 in D minor - III. Adagio
	Concerto Grosso Op.3 No.5 in D minor - IV. Allegro, ma non troppo
	Concerto Grosso Op.3 No.5 in D minor - V. Allegro
	Concerto Grosso Op.3 No.6 in D major - I. Vivace
	Concerto Grosso Op.3 No.6 in D major - II. Allegro

Example Result:
Disc Number: 1, Name: Concerto Grosso Op.3 No.1 in B flat major - I. Allegro
	Disc Number: 1, Name: Concerto Grosso Op.3 No.1 in B flat major - II. Largo
	Disc Number: 1, Name: Concerto Grosso Op.3 No.1 in B flat major - III. Allegro
	Disc Number: 2, Name: Concerto Grosso Op.3 No.2 in B flat major - I. Vivace
	Disc Number: 2, Name: Concerto Grosso Op.3 No.2 in B flat major - II. Largo
	Disc Number: 2, Name: Concerto Grosso Op.3 No.2 in B flat major - III. Allegro
	Disc Number: 2, Name: Concerto Grosso Op.3 No.2 in B flat major - IV. Moderato
	Disc Number: 2, Name: Concerto Grosso Op.3 No.2 in B flat major - V. Allegro
	Disc Number: 3, Name: Concerto Grosso Op.3 No.3 in G major - I. Largo, e staccato - allegro
	Disc Number: 3, Name: Concerto Grosso Op.3 No.3 in G major - II. Andante
	Disc Number: 3, Name: Concerto Grosso Op.3 No.3 in G major - III. Allegro
	Disc Number: 4, Name: Concerto Grosso Op.3 No.4 in F major - I. Largo
	Disc Number: 4, Name: Concerto Grosso Op.3 No.4 in F major - II. Andante
	Disc Number: 4, Name: Concerto Grosso Op.3 No.4 in F major - III. Allegro
	Disc Number: 4, Name: Concerto Grosso Op.3 No.4 in F major - IV. Allegro
	Disc Number: 5, Name: Concerto Grosso Op.3 No.5 in D minor - I. Largo
	Disc Number: 5, Name: Concerto Grosso Op.3 No.5 in D minor - II. Fuga, allegro
	Disc Number: 5, Name: Concerto Grosso Op.3 No.5 in D minor - III. Adagio
	Disc Number: 5, Name: Concerto Grosso Op.3 No.5 in D minor - IV. Allegro, ma non troppo
	Disc Number: 5, Name: Concerto Grosso Op.3 No.5 in D minor - V. Allegro
	Disc Number: 6, Name: Concerto Grosso Op.3 No.6 in D major - I. Vivace
	Disc Number: 6, Name: Concerto Grosso Op.3 No.6 in D major - II. Allegro
	
*/

(function() {

	// ******* Constants *******

	var INITIAL_DISK_NUMBER = 1;
	var DELIMITER = "-";
	
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
		
		// Code that applies the changes:
		// currentTrack.discNumber.set(discNumber);
		
		this.console.log(currentTrackName + ": " + discNumber + "\n");
	}
	return "Done";

	function shouldKeepSameDiscNumber(trackName, previousTrackName) {
		if (!previousTrackName) return true;
		
		var firstPrefix = trackName.split(DELIMITER)[0];
		var secondPrefix = previousTrackName.split(DELIMITER)[0];
		
		if (firstPrefix == secondPrefix) return true;
		return false;
	}
})();