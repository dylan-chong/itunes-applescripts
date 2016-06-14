/*

Remember to set the language from AppleScript to Javascript!

Description:
	Takes groups of discs, and sets each track to the disc's average play count,
	and sets the last played date to the last played date of the first track. If
	there are any tracks in a disc that has a play count of zero, the whole disc
	will be skipped.
	
	Note: 
		- It doesn't average the last played date, it only averages the play count.
		- It assumes there are disc numbers set (so please make sure all tracks
			have disc numbers)
	

Example Selection:
	Play Count: 15, Last Played: Mon Feb 08 2016 13:23:02 GMT+1300 (NZDT),
				Name: No. 4 in A Minor, RV 357 - I. Allegro
	
	Play Count: 23, Last Played: Mon Feb 08 2016 13:26:20 GMT+1300 (NZDT),
				Name: No. 4 in A Minor, RV 357 - II. Grave
	
	Play Count: 32, Last Played: Mon Feb 08 2016 13:29:22 GMT+1300 (NZDT),
				Name: No. 4 in A Minor, RV 357 - III. Allegro
	
	Play Count: 25, Last Played: Wed Mar 30 2016 18:59:31 GMT+1300 (NZDT),
				Name: No. 5 in A Major, RV 347 - I. Allegro
	
	Play Count: 35, Last Played: Wed Mar 30 2016 19:12:40 GMT+1300 (NZDT),
				Name: No. 5 in A Major, RV 347 - II. Largo
	
	Play Count: 24, Last Played: Wed Apr 15 2016 19:16:14 GMT+1300 (NZDT),
				Name: No. 5 in A Major, RV 347 - III. Allegro
	
Example Result:
	Play Count: 23, Last Played: Mon Feb 08 2016 13:23:02 GMT+1300 (NZDT),
				Name: No. 4 in A Minor, RV 357 - I. Allegro
	
	Play Count: 23, Last Played: Mon Feb 08 2016 13:23:02 GMT+1300 (NZDT),
				Name: No. 4 in A Minor, RV 357 - II. Grave
	
	Play Count: 23, Last Played: Mon Feb 08 2016 13:23:02 GMT+1300 (NZDT),
				Name: No. 4 in A Minor, RV 357 - III. Allegro
	
	Play Count: 28, Last Played: Wed Mar 30 2016 18:59:31 GMT+1300 (NZDT),
				Name: No. 5 in A Major, RV 347 - I. Allegro
	
	Play Count: 28, Last Played: Wed Mar 30 2016 18:59:31 GMT+1300 (NZDT),
				Name: No. 5 in A Major, RV 347 - II. Largo
	
	Play Count: 28, Last Played: Wed Mar 30 2016 18:59:31 GMT+1300 (NZDT),
				Name: No. 5 in A Major, RV 347 - III. Allegro
	
*/

(function() {
	var app = Application('iTunes');
	app.includeStandardAdditions = true;
	var window = app.windows[0];
	
	var selection = window.selection();
	
	var groups = getGroupsOfTracks(selection);
	
	for (var g = 0; g < groups.length; g++) {
		var group = groups[g];
		
		var minimumPlays = getMinimumPlays(group);
		if (minimumPlays == 0) continue;
		
		var averagePlays = getAveragePlays(group);
		var lastPlayedDate = getLastPlayedDate(group);
		
		for (var t = 0; t < group.length; t++) {
			var track = group[t];
			
			// Code that applies the changes:
			// track.playedCount.set(averagePlays);
			// track.playedDate.set(lastPlayedDate);
			
			logTrackDetails(averagePlays, lastPlayedDate,
				track.name(), this.console);
		}
		
		this.console.log("\n")
	}
	
	return "Done";
	
	// TODO externalise the below method?
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
	
	function getAveragePlays(tracks) {
		var totalPlays = 0;
		
		for (var t = 0; t < tracks.length; t++) {
			var track = tracks[t];
			totalPlays += track.playedCount();	
		}
		
		var average = totalPlays / tracks.length;
		average = Math.round(average);
		return average;
	}
	
	function getLastPlayedDate(tracks) {
		return tracks[0].playedDate();
	}
	
	function getMinimumPlays(tracks) {
		var min;
		
		for (var t = 0; t < tracks.length; t++) {
			var track = tracks[t];
			var c = track.playedCount();
			
			if (!min || c < min) min = c;
		}
		
		return min;
	}
	
	function logGroupsOfTracks(groups, console) {
		for (var g = 0; g < groups.length; g++) {
			logTracks(groups[g], this.console);
		}
	}
	
	// For debugging
	function logTracks(tracks, console) {
		for (var t = 0; t < tracks.length; t++) {
			var track = tracks[t];
			logTrack(track, console);
		}
	}
	
	function logTrack(track, console) {
		logTrackDetails(track.playedCount(),
			track.playedDate(), track.name(),
			console);
	}
	
	function logTrackDetails(playCount, playedDate, name, console) {
		var log = "Play Count: " + playCount;
		log += ", Last Played: " + playedDate;
		log += ",\n\t\t\tName: " + name + "\n";
		console.log(log);
	}
	
})();