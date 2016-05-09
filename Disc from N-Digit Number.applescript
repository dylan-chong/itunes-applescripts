/*

Remember to set the language from AppleScript to Javascript!

Description:
	When NUMBER_LENGTH is set to 3, this script finds a 
	3-digit number in the track name and sets the disc 
	number to that number (if it exists).

Example Selection:
	Name: Divertimento in E flat major KV 113 - Allegro
	Name: Divertimento in E flat major KV 113 - Andante
	Name: Divertimento in E flat major KV 113 - Menuetto
	Name: Divertimento in E flat major KV 113 - Allegro
	Name: Divertimento in D major KV 131 - Allegro
	Name: Divertimento in D major KV 131 - Adagio
	Name: Divertimento in D major KV 131 - Menuetto
	Name: Divertimento in D major KV 131 - Allegretto
	Name: Divertimento in D major KV 131 - Menuetto
	Name: Divertimento in D major KV 131 - Adagio
	Name: Divertimento in D major KV 131 - Allegro assai
	Name: Divertimento in D major KV 136 - Allegro
	Name: Divertimento in D major KV 136 - Andante
	Name: Divertimento in D major KV 136 - Presto
	Name: Divertimento in B flat major KV 137 - Andante
	Name: Divertimento in B flat major KV 137 - Allegro di molto
	Name: Divertimento in B flat major KV 137 - Allegro assai
	Name: Divertimento in F major KV 138 - Allegro
	Name: Divertimento in F major KV 138 - Andante
	Name: Divertimento in F major KV 138 - Presto
	
Example Result:
	Disc Number: 113, Name: Divertimento in E flat major KV 113 - Allegro
	Disc Number: 113, Name: Divertimento in E flat major KV 113 - Andante
	Disc Number: 113, Name: Divertimento in E flat major KV 113 - Menuetto
	Disc Number: 113, Name: Divertimento in E flat major KV 113 - Allegro
	Disc Number: 131, Name: Divertimento in D major KV 131 - Allegro
	Disc Number: 131, Name: Divertimento in D major KV 131 - Adagio
	Disc Number: 131, Name: Divertimento in D major KV 131 - Menuetto
	Disc Number: 131, Name: Divertimento in D major KV 131 - Allegretto
	Disc Number: 131, Name: Divertimento in D major KV 131 - Menuetto
	Disc Number: 131, Name: Divertimento in D major KV 131 - Adagio
	Disc Number: 131, Name: Divertimento in D major KV 131 - Allegro assai
	Disc Number: 136, Name: Divertimento in D major KV 136 - Allegro
	Disc Number: 136, Name: Divertimento in D major KV 136 - Andante
	Disc Number: 136, Name: Divertimento in D major KV 136 - Presto
	Disc Number: 137, Name: Divertimento in B flat major KV 137 - Andante
	Disc Number: 137, Name: Divertimento in B flat major KV 137 - Allegro di molto
	Disc Number: 137, Name: Divertimento in B flat major KV 137 - Allegro assai
	Disc Number: 138, Name: Divertimento in F major KV 138 - Allegro
	Disc Number: 138, Name: Divertimento in F major KV 138 - Andante
	Disc Number: 138, Name: Divertimento in F major KV 138 - Presto


*/

(function() {

	// ******* Constants *******

	var NUMBER_LENGTH = 2;
	
	// *************************

	var app = Application('iTunes');
	app.includeStandardAdditions = true;
	var window = app.windows[0];
	
	var selection = window.selection();
	
	for (var a = 0; a < selection.length; a++) {
		var track = selection[a];
		
		var regex = new RegExp("\\d{" + NUMBER_LENGTH + "}", "g");
		var numbers = track.name().match(regex);
		if (!numbers || numbers.length == 0) continue;
		
		var discNumber = get3DigitNumber(numbers);
		if (!discNumber) continue;
		
		this.console.log("Disc: " + discNumber + ", Name: " + track.name());
		// Code that applies the changes:
		// track.discNumber.set(discNumber);
	}
	return "Done";
	
	function get3DigitNumber(arrayOfNums) {
		for (var a = 0; a < arrayOfNums.length; a++) {
			var n = arrayOfNums[a]
			if ((n + "").length === NUMBER_LENGTH) {
				return n;
			}
		}
	}
})();