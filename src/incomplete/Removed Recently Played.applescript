/*

Remember to set the language from AppleScript to Javascript!

Description:
	
	

Example Playlist Before:
	
Example Playlist After:
	
*/

(function() {
	
	// ******* Constants *******

	var PLAYLIST_NAME = 'Test Reorder'; // Make sure there are no name conflicts
	// Note: Currently doesn't work on smart playlists
	
	// *************************
	
	var app = Application('iTunes');
	app.includeStandardAdditions = true;
	var window = app.windows[0];
	var console = this.console;

	var playlist;
	
	try {
		playlist = getDefaultPlaylist();
	} catch (e) {
		// Note: An error is not always thrown if there
		// are name duplicates.
		return 'There are multiple playlists of the name \''
			+ PLAYLIST_NAME + '\'';
	}
	
	if (!playlist)
		return 'No playlists found';
	
	if (playlist.tracks().length == 0)
		return 'No tracks in this playlist';
	
	// TODO do stuff here
	
	return 'Done';
	
	// **************** Playlists ****************
	
	function getDefaultPlaylist() {
		return getPlaylistByNameAndIsSmart(PLAYLIST_NAME, PLAYLIST_IS_SMART);
	}
	
	function getPlaylistByNameAndIsSmart(name, isSmart) {
		var playlistArrays = app.sources.playlists();
		var userPlaylists = playlistArrays[0];
		
		for (var a = 0; a < userPlaylists.length; a++) {
			var playlist = userPlaylists[a];

			if (playlist.name() !== name) continue;
			if (playlist.smart() !== isSmart) continue;

			return playlist;
		}
		
		return null;
	}
	
	// **************** Grouping and Shuffling ****************
	
})();