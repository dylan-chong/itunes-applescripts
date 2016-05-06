/*

Remember to set the language from AppleScript to Javascript!

Description:
	Adds the item from DATA onto the the end of each track name
	(with the DATA_PREFIX in between).

Example Selection:
	Concerto Grosso Op.3 No.1 in B flat major
	Concerto Grosso Op.3 No.1 in B flat major
	Concerto Grosso Op.3 No.1 in B flat major
	Concerto Grosso Op.3 No.2 in B flat major
	Concerto Grosso Op.3 No.2 in B flat major
	Concerto Grosso Op.3 No.2 in B flat major
	Concerto Grosso Op.3 No.2 in B flat major
	Concerto Grosso Op.3 No.2 in B flat major
	Concerto Grosso Op.3 No.3 in G major
	Concerto Grosso Op.3 No.3 in G major
	Concerto Grosso Op.3 No.3 in G major
	Concerto Grosso Op.3 No.4 in F major
	Concerto Grosso Op.3 No.4 in F major
	Concerto Grosso Op.3 No.4 in F major
	Concerto Grosso Op.3 No.4 in F major
	Concerto Grosso Op.3 No.5 in D minor
	Concerto Grosso Op.3 No.5 in D minor
	Concerto Grosso Op.3 No.5 in D minor
	Concerto Grosso Op.3 No.5 in D minor
	Concerto Grosso Op.3 No.5 in D minor
	Concerto Grosso Op.3 No.6 in D major
	Concerto Grosso Op.3 No.6 in D major
	
Example DATA and DATA_PREFIX:
	var DATA_PREFIX = " - ";
	var DATA = "I. Allegro\n" +
        "II. Largo\n" +
        "III. Allegro\n" +
        "I. Vivace\n" +
        "II. Largo\n" +
        "III. Allegro\n" +
        "IV. Moderato\n" +
        "V. Allegro\n" +
        "I. Largo, e staccato Ñ allegro\n" +
        "II. Andante\n" +
        "III. Allegro\n" +
        "I. Largo\n" +
        "II. Andante\n" +
        "III. Allegro\n" +
        "IV. Allegro\n" +
        "I. Largo\n" +
        "II. Fuga, allegro\n" +
        "III. Adagio\n" +
        "IV. Allegro, ma non troppo\n" +
        "V. Allegro\n" +
        "I. Vivace\n" +
        "II. Allegro";	

Example Result:
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

*/

(function() {

	// The text to put in between the original
	// track name, and a piece of data
	var DATA_PREFIX = " - ";
	
	// Don't leave any empty lines in DATA
	// (or start/end with \n)
	var DATA = "I. Allegro\n" +
        "II. Largo\n" +
        "III. Allegro\n" +
        "I. Vivace\n" +
        "II. Largo\n" +
        "III. Allegro\n" +
        "IV. Moderato\n" +
        "V. Allegro\n" +
        "I. Largo, e staccato Ñ allegro\n" +
        "II. Andante\n" +
        "III. Allegro\n" +
        "I. Largo\n" +
        "II. Andante\n" +
        "III. Allegro\n" +
        "IV. Allegro\n" +
        "I. Largo\n" +
        "II. Fuga, allegro\n" +
        "III. Adagio\n" +
        "IV. Allegro, ma non troppo\n" +
        "V. Allegro\n" +
        "I. Vivace\n" +
        "II. Allegro";
		
	function getNewName(oldName) {
		return oldName + DATA_PREFIX + dataItems[a];
	}
	
	// *************************
	
	var app = Application('iTunes');
	app.includeStandardAdditions = true;
	var window = app.windows[0];
	
	var selection = window.selection();
	
	var dataItems = DATA.split("\n");
	
	for (var a = 0; a < selection.length; a++) {
		if (a >= dataItems.length) break;
	
		var currentTrack = selection[a];
		var currentTrackName = currentTrack.name();
		var newTrackName = getNewName(currentTrackName);
		
		// Code that applies the changes:
		// currentTrack.name.set(newTrackName);
		
		this.console.log(newTrackName);
	}
	return "Done";
})();