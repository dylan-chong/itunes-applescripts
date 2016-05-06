JsOsaDAS1.001.00bplist00�Vscript_(function() {
	var app = Application('iTunes');
	app.includeStandardAdditions = true;
	var window = app.windows[0];
	
	var selection = window.selection();
	
	var groups = getGroupsOfTracks(selection);
	
	for (var g = 0; g < groups.length; g++) {
		var group = groups[g];
		for (var t = 0; t < group.length; t++) {
			var track = group[t];
			track.trackCount.set(group.length);
			track.trackNumber.set(t+1);
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
})();                              3 jscr  ��ޭ