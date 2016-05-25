/*

Remember to set the language from AppleScript to Javascript!

Description:
	Shuffles the discs in the playlist called "Up Next" but keeps the tracks
	in each disk grouped together. The discs in each album will be 
	distributed evenly over time.
	

Example Selection:
	
	
Example Result:
	
	
*/

(function() {
	var app = Application('iTunes');
	app.includeStandardAdditions = true;
	var window = app.windows[0];
	var console = this.console;
	
	var selection = window.selection();
	var groups = getGroupsOfTracks(selection);
	
	var albumGroups = getSortedGroups(groups);
	var shuffledDiscs = getShuffledDiscs(albumGroups);
	logAllDiscGroups(shuffledDiscs);
	
	return "Done";
	
	// Returns an array of array of tracks
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
	
	function getSortedGroups(discGroups) {
		return getAlbumGroups(discGroups);
		
		function getAlbumGroups(discGroups) {
			var albumGroups = [];

			for (var d = 0; d < discGroups.length; d++) {
				var discGroup = discGroups[d];
				var index = getIndexOfSameAlbum(discGroup);

				if (index == -1) {
					albumGroups.push([discGroup]);
					continue;
				}
				
				albumGroups[index].push(discGroup);
			}
			
			return albumGroups;
			
			function getIndexOfSameAlbum(discGroup) {
				for (var a = 0; a < albumGroups.length; a++) {
					// first track in the first disc of the album group
					var groupTrack = albumGroups[a][0][0];
					var discTrack = discGroup[0];
					
					if (discTrack.album() !== groupTrack.album()) continue;
					if (discTrack.artist() !== groupTrack.artist()) continue;
					
					return a;
				}
				
				return -1;
			}
		}
		
		function getArtistGroups(discGroups) {
			// TODO LATER
		}
	}
	
	// NOTE: This doesn't shuffle them evenly for now
	function getShuffledDiscs(albumGroups) {
		// Array to track which disc we have added
		var currentAlbumGroupIndexes = [];
		for (var a = 0; a < albumGroups.length; a++) {
			currentAlbumGroupIndexes.push(0);
		}
		
		var shuffled = []; // disc groups
		
		// Add one disc, to shuffled, from each album group
		while (true) {
			var albumsEmpty = 0;
			for (var a = 0; a < albumGroups.length; a++) {
				var indexInAlbum = currentAlbumGroupIndexes[a];
				console.log("a=" + a + ", indexInAlbum=" + indexInAlbum);
				
				if (indexInAlbum == -1) {
					albumsEmpty++;
					console.log("already empty");
					break;
				}

				var discGroup = albumGroups[a][indexInAlbum];
				shuffled.push(discGroup);
				currentAlbumGroupIndexes[a]++;
				console.log("adding album");
				
				if (indexInAlbum == albumGroups[a].length) {
					currentAlbumGroupIndexes[a] = -1;
					albumsEmpty++;
					console.log("now empty");
				}
			}
			
			if (albumsEmpty == albumGroups.length) break;
		}
		
		return shuffled;
	}
	
	// **************** Debug ****************
	
	function logAllDiscGroups(groups, tabSpaces) {
		for (var a = 0; a < groups.length; a++) {
			logDiscGroup(groups[a], tabSpaces);
		}
	}
	
	function logDiscGroup(group, tabSpaces) {
		var discNum = group[0].discNumber() + '';
		
		while (discNum.length < 3) {
			discNum = ' ' + discNum;
		}
		
		var s = '';
		for (var a = 0; a < tabSpaces; a++) s += '\t';
		
		s += 'Disc: ' + discNum + ', ';
		s += 'Album: ' + group[0].album();
		console.log(s);
	}
	
	function logAlbumGroups(albumGroups) {
		for (var a = 0; a < albumGroups.length; a++) {
			console.log("Album " + (a + 1));
			logAllDiscGroups(albumGroups[a], 1);
		}
	}
	
})();