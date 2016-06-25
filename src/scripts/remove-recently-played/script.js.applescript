(function() {

    // ******* Constants *******

    // Note: It can't work on smart playlists
    // Make sure there are no name conflicts
    var PLAYLIST_NAME = 'Source';

    // If the track was played within the last RECENT_DAYS
    // days, it will be removed from the playlist
    var RECENT_DAYS = 4;

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

    var recentTracks = getRecentTracksFromPlaylist(playlist);
    logTrackNames(recentTracks);

    // Code that makes changes:
    // removeTracksFromPlaylist(recentTracks, playlist);

    return 'Done';

    // **************** Playlists ****************

    function getDefaultPlaylist() {
        return getPlaylistByNameAndIsSmart(PLAYLIST_NAME, false);
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

    // **************** Recent Tracks ****************

    function getRecentTracksFromPlaylist(playlist) {
        // Constants for trackIsRecent() method
        var ONE_DAY = 1000 * 60 * 60 * 24;
        var CURRENT_TIME = new Date().getTime();

        //
        var playlistTracks = playlist.tracks();
        var recentTracks = [];

        for (var t = 0; t < playlistTracks.length; t++) {
            if (trackWasPlayedRecently(playlistTracks[t]))
                recentTracks.push(playlistTracks[t]);
        }

        return recentTracks;

        function trackWasPlayedRecently(track) {
            var lastPlayed = track.playedDate();
            if (!lastPlayed) return false; // track is not played

            var lastTime = lastPlayed.getTime();

            // track was played within RECENT_DAYS days
            if (lastTime > CURRENT_TIME - RECENT_DAYS * ONE_DAY)
                return true;

            return false;
        }
    }

    function removeTracksFromPlaylist(tracks, playlist) {
        for (var t = 0; t < tracks.length; t++) {
            tracks[t].delete({from: playlist});
        }
    }

    // **************** Logging ****************

    function logTrackNames(tracks) {
        for (var t = 0; t < tracks.length; t++) {
            console.log(tracks[t].name());
        }
    }

})();
