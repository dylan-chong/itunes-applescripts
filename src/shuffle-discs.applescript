/*

Remember to set the language from AppleScript to Javascript!

Description:
    Shuffles the discs in the playlist called "Up Next" but keeps the tracks
    in each disk grouped together. The discs in each album will be roughly 
    distributed evenly over time.
    
    Note: The tracks in each disc should be grouped together and in order
    in order for the script to work properly.
    
    Note 2: This script doesn't work on smart playlists due to how iTunes
    deals with smart playlists.
    
    Note 3: The script will run much faster if iTunes is not currently
    viewing the playlist that is to be modified.
    

Example Playlist Disc Order (Before running script):
    Disc:   6, Album: Bach - Brandenburg Concertos
    Disc:   1, Album: Bach - Canatas
    Disc: 156, Album: Bach - Canatas
    Disc: 157, Album: Bach - Canatas
    Disc: 174, Album: Bach - Canatas
    Disc: 176, Album: Bach - Canatas
    Disc: 177, Album: Bach - Canatas
    Disc:   2, Album: Bach - Sonatas and Partitas for Solo Violin
    Disc:   1, Album: Handel - Faramondo
    Disc:   2, Album: Handel - Faramondo
    Disc:   3, Album: Handel - Faramondo
    Disc: 267, Album: Mozart - Dances
    Disc: 300, Album: Mozart - Dances
    Disc: 363, Album: Mozart - Dances
    Disc: 461, Album: Mozart - Dances
    Disc: 462, Album: Mozart - Dances
    Disc: 463, Album: Mozart - Dances
    Disc: 196, Album: Mozart - Other Operas
    Disc: 151, Album: Vivaldi - Concertos and Symphonies for Strings
    Disc: 152, Album: Vivaldi - Concertos and Symphonies for Strings
    Disc: 155, Album: Vivaldi - Concertos and Symphonies for Strings
    Disc: 156, Album: Vivaldi - Concertos and Symphonies for Strings
    Disc: 159, Album: Vivaldi - Concertos and Symphonies for Strings
    Disc: 161, Album: Vivaldi - Concertos and Symphonies for Strings
    Disc: 164, Album: Vivaldi - Concertos and Symphonies for Strings
    
Example Playlist Disc Order (After running script):
    Disc:   6, Album: Bach - Brandenburg Concertos
    Disc:   1, Album: Bach - Canatas
    Disc:   2, Album: Bach - Sonatas and Partitas for Solo Violin
    Disc:   1, Album: Handel - Faramondo
    Disc: 267, Album: Mozart - Dances
    Disc: 196, Album: Mozart - Other Operas
    Disc: 151, Album: Vivaldi - Concertos and Symphonies for Strings
    Disc: 156, Album: Bach - Canatas
    Disc:   2, Album: Handel - Faramondo
    Disc: 300, Album: Mozart - Dances
    Disc: 152, Album: Vivaldi - Concertos and Symphonies for Strings
    Disc: 157, Album: Bach - Canatas
    Disc:   3, Album: Handel - Faramondo
    Disc: 363, Album: Mozart - Dances
    Disc: 155, Album: Vivaldi - Concertos and Symphonies for Strings
    Disc: 174, Album: Bach - Canatas
    Disc: 461, Album: Mozart - Dances
    Disc: 156, Album: Vivaldi - Concertos and Symphonies for Strings
    Disc: 176, Album: Bach - Canatas
    Disc: 462, Album: Mozart - Dances
    Disc: 159, Album: Vivaldi - Concertos and Symphonies for Strings
    Disc: 177, Album: Bach - Canatas
    Disc: 463, Album: Mozart - Dances
    Disc: 161, Album: Vivaldi - Concertos and Symphonies for Strings
    Disc: 164, Album: Vivaldi - Concertos and Symphonies for Strings
    
*/

(function() {
    
    // ******* Constants *******

    var PLAYLIST_NAME = 'Source'; // Make sure there are no name conflicts
    var PLAYLIST_IS_SMART = false; // Note: Currently doesn't work on smart playlists
    
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
    
    logTime('Loaded playlist');
    var groups = getGroupsOfTracks(playlist.tracks());
    logTime('Loaded groups from playlist');
    var albumGroups = getSortedGroups(groups);
    logTime('Sorted groups');
    var shuffledDiscs = getShuffledDiscs(albumGroups);
    logTime('Shuffled discs');  
    //logAllDiscGroups(shuffledDiscs); // TODO LATER uncomment
    // Code that makes changes:
    // reorderPlaylist(shuffledDiscs, playlist);
    logTime('Applied changes');
    
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
    
    function reorderPlaylist(discGroups, playlist) {
        for (var d = 0; d < discGroups.length; d++) {
            var disc = discGroups[d];
            for (var t = 0; t < disc.length; t++) {
                disc[t].move({to: playlist});
            }
        }
    }
    
    // **************** Grouping and Shuffling ****************
    
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
    
    function getShuffledDiscs(albumGroups) {
        return pairShuffle(albumGroups);
        
        function pairShuffle(albumGroups) {
            // TODO first disc stays at top
            var shuffled = albumGroups;
            
            while (shuffled.length > 1) {
                shuffled = sortAlbumGroupsByLength(shuffled);
                // logAlbumGroupLengthsAndNames(shuffled);
                
                var smallest = shuffled.splice(shuffled.length - 2, 2);
                var merged = simpleShuffle(smallest);
                shuffled.push(merged);
            }
            
            return shuffled[0];
            
            // From largest to smallest
            function sortAlbumGroupsByLength(albumGroups) {
                var copiedGroups = albumGroups.slice();
                var sortedGroups = [];
                
                while (copiedGroups.length > 0) {
                    var largestGroupIndex;
                    var largestGroupSize = -1;
                    for (var a = 0; a < copiedGroups.length; a++) {
                        if (copiedGroups[a].length > largestGroupSize) {
                            largestGroupIndex = a;
                            largestGroupSize = copiedGroups[a].length;
                        }
                    }
                    
                    // removedItems always has length 1
                    var removedItems = copiedGroups.splice(largestGroupIndex, 1);
                    sortedGroups.push(removedItems[0]);
                }
                
                return sortedGroups;
            }
        }
        
        function simpleShuffle(albumGroups) {
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
                
                    if (indexInAlbum == -1) {
                        albumsEmpty++;
                        continue;
                    }
    
                    var discGroup = albumGroups[a][indexInAlbum];
                    shuffled.push(discGroup);
    
                    currentAlbumGroupIndexes[a]++;
                    
                    if (currentAlbumGroupIndexes[a] == albumGroups[a].length) {
                        currentAlbumGroupIndexes[a] = -1;
                        albumsEmpty++;
                    }
                }
                
                if (albumsEmpty == albumGroups.length) break;
            }
        
            return shuffled;
        }
        
        function logAlbumGroupLengthsAndNames(albumGroups) {
            var logStr = '\n[\n';
            for (var a = 0; a < albumGroups.length; a++) {
                logStr += '\t' + albumGroups[a].length + ': ' + albumGroups[a][0][0].album() + ' ,\n';
            }
            console.log(logStr + '\n]');
        }
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
    
    function logTime(msg) {
        var date = new Date();
        console.log(date.toString() + ' : ' + msg);
    }
    
})();
