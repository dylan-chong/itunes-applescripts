/*

Remember to set the language from AppleScript to Javascript!

Description:
	Takes groups of discs, and sets each track to the disc's average play count,
	and sets the last played date to the last played date of the first track. If
	there are any tracks in a disc that has a play count of zero, the whole disc
	will be skipped.
	Note: It doesn't average the last played date, it only averages the play count.
	

Example Selection:
	
	
Example Result:
	
	
*/

(function() {
	var app = Application('iTunes');
	app.includeStandardAdditions = true;
	var window = app.windows[0];
	
	var selection = window.selection();
	
	var groups = getGroupsOfTracks(selection);
	
	// TODO LATER remove debugging
	logTracks(groups[0], this.console);
	return;
	
	for (var g = 0; g < groups.length; g++) {
		var group = groups[g];
		
		var minimumPlays = getMinimumPlays(group);
		if (minimumPlays == 0) continue;
		
		var averagePlays = getAveragePlays(group);
		var lastPlayedDate = getLastPlayedDate(group);
		
		for (var t = 0; t < group.length; t++) {
			var track = group[t];
			
			// Code that applies the changes:
			//track.playedCount.set(averagePlays);
			//track.playedDate.set(lastPlayedDate);
			
		}
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
			totalPlays += tracks.playedCount();	
		}
		
		var average = totalPlays / tracks.length;
		average = Math.round(average);
		return average;
	}
	
	function getLastPlayedDate(tracks) {
		return tracks[0].playedDate();
	}
	
	function logTracks(tracks, console) {
		console.log("Start log");
		for (var t = 0; t < tracks.length; t++) {
			var track = tracks[t];
			console.log(track.playedCount());
			console.log(track.playedDate());
		}
		console.log("End log");
	}
	
	function getMinimumPlays(tracks) {
		var min;
		
		for (var t = 0; t < tracks.length; t++) {
			var track = tracks[t];
			var c = tracks.playedCount();
			
			if (!min) {
				min = c;
			} else if (c < min) {
				min = c;
			}
		}
	}
	
})();