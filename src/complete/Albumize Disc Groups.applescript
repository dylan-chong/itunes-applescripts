/*

Remember to set the language from AppleScript to Javascript!

Description:
	Takes groups of discs and sets an incremental track number for each track in each disc.
	Inspired by 'Albumize Selection' by Doug Adams:
	http://dougscripts.com/itunes/scripts/ss.php?sp=albumizeselection
	
	Note: The disc count of the tracks is sometimes not set to all tracks. You may have to
	run the script twice to get it to work (keeping iTunes in the foreground may help).
	

Example Selection:
	Disc Number: 24, Name: Joseph - Symphony No. 024 in D major - 1. Allegro 
	Disc Number: 24, Name: Joseph - Symphony No. 024 in D major - 2. Adagio 
	Disc Number: 24, Name: Joseph - Symphony No. 024 in D major - 3. Menuetto e Trio 
	Disc Number: 24, Name: Joseph - Symphony No. 024 in D major - 4. Allegro 
	Disc Number: 253, Name: Divertimento No 13 F-Dur - 1776 - 01 - Tema con variazioni (Andante) 
	Disc Number: 253, Name: Divertimento No 13 F-Dur - 1776 - 02 - Menuetto 
	Disc Number: 253, Name: Divertimento No 13 F-Dur - 1776 - 03 - Allegro assai
	
Example Result:
	Disc Number: 24, Track Number: 1 of 4, Name: Jogseph - Symphony No. 024 in D major - 1. Allegro
	Disc Number: 24, Track Number: 2 of 4, Name: Joseph - Symphony No. 024 in D major - 2. Adagio
	Disc Number: 24, Track Number: 3 of 4, Name: Joseph - Symphony No. 024 in D major - 3. Menuetto e Trio
	Disc Number: 24, Track Number: 4 of 4, Name: Joseph - Symphony No. 024 in D major - 4. Allegro
	Disc Number: 253, Track Number: 1 of 3, Name: Divertimento No 13 F-Dur - 1776 - 01 - Tema con variazioni (Andante)
	Disc Number: 253, Track Number: 2 of 3, Name: Divertimento No 13 F-Dur - 1776 - 02 - Menuetto
	Disc Number: 253, Track Number: 3 of 3, Name: Divertimento No 13 F-Dur - 1776 - 03 - Allegro assai
	
*/

(function() {
	var app = Application('iTunes');
	app.includeStandardAdditions = true;
	var window = app.windows[0];
	
	var selection = window.selection();
	
	var groups = getGroupsOfTracks(selection);
	
	for (var g = 0; g < groups.length; g++) {
		var group = groups[g];
		for (var t = 0; t < group.length; t++) {
			var track = group[t];
			var num = t+1;
			var count = group.length;
			
			// Code that applies the changes:
			// track.trackCount.set(count);
			for (var a = 0; a < 2; a++) {
				// track.trackNumber.set(num);
			}
			
			this.console.log("Track: " + num + " of " + count + ", Name: " + track.name());
		}
	}
	
	return "Done";
	
	function getGroupsOfTracks(originalTracksArray) {
		if (originalTracksArray == null || originalTracksArray.length == 0) 
			return null;
		
		var tracks = originalTracksArray.slice();
		var groups = [];
		while (true) {
			var group = [];
			group.push(tracks[0]);
			tracks = tracks.slice(1);
				
			while (true) {
				if (!tracks[0]) break;
				if (tracks[0].album() != group[0].album())
					break;
				if (tracks[0].artist() != group[0].artist())
					break;
				if (tracks[0].discNumber() != group[0].discNumber())
					break;
				group.push(tracks[0]);
				tracks = tracks.slice(1);
			}
		
			groups.push(group);
			if (!tracks[0]) break;
		}
	
		return groups;
	}
})();