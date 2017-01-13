function createScript():Script {

  return <Script> {
    run: run
  };

  function run() {

    // ******* Constants *******

    // Make sure there are no name conflicts for this playlist
    var PLAYLIST_NAME = 'Source';

    // Note: Doesn't work on smart playlists because of iTunes not allowing
    // scripts to modify or even read them
    var PLAYLIST_IS_SMART = false;

    // Will leave this number of discs at the top of the playlist
    var DISCS_TO_IGNORE = 3;

    // *************************

    var app = Application('iTunes');
    app.includeStandardAdditions = true;

    var playlist: IPlaylist;

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

    var groups = new TracksDiscifier(playlist.tracks()).discifyTracks();
    var groupsToShuffle = groups.slice(DISCS_TO_IGNORE);
    var ignoredDiscs = groups.slice(0, DISCS_TO_IGNORE);

    var albumGroups = getSortedGroups(groupsToShuffle);
    var shuffledDiscs = getShuffledDiscs(albumGroups);

    var combinedDiscGroups = ignoredDiscs.concat(shuffledDiscs);
    logAllDiscs(combinedDiscGroups);

    // Code that makes changes:
    // reorderPlaylist(shuffledDiscs, playlist);

    return 'Done';

    // **************** Playlists ****************

    function getDefaultPlaylist(): IPlaylist {
      return getPlaylistByNameAndIsSmart(PLAYLIST_NAME, PLAYLIST_IS_SMART);
    }

    // todo playlist finder dependency
    function getPlaylistByNameAndIsSmart(name: string,
                                         isSmart: boolean): IPlaylist {
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

    function reorderPlaylist(discs: Disc[], playlist: IPlaylist) {
      for (var d = 0; d < discs.length; d++) {
        var disc = discs[d];
        for (var t = 0; t < disc.getTracks().length; t++) {
          disc.getTracks()[t].move({to: playlist});
        }
      }
    }

    // **************** Grouping and Shuffling ****************

    function getSortedGroups(discs: Disc[]): Album[] { // correct return type?
      return getAlbumGroups(discs);

      function getAlbumGroups(discs: Disc[]): Album[] {
        var albums: Album[] = [];

        for (var d = 0; d < discs.length; d++) {
          var discGroup = discs[d];
          var index = getIndexOfSameAlbum(discGroup);

          if (index == -1) {
            albums.push(new Album([discGroup]));
            continue;
          }

          albums[index].getDiscs().push(discGroup);
        }

        return albums;

        function getIndexOfSameAlbum(disc: Disc): number {
          for (var a = 0; a < albums.length; a++) {
            // first track in the first disc of the album group
            var trackFromAlbumA = albums[a].getDiscs()[0].getTracks()[0];
            var trackForSearch = disc.getTracks()[0];

            if (trackForSearch.album() !== trackFromAlbumA.album()) continue;
            if (trackForSearch.artist() !== trackFromAlbumA.artist()) continue;

            return a;
          }

          return -1;
        }
      }
    }

    function getShuffledDiscs(albums: Album[]) {
      // Turn Album[] into Disc[][] because an 'Album' should have an array
      // of Disc objects that all have the same .album() property. This method
      // merges different Album objects together, so it doesn't make sense for
      // them to be called Albums after a merge.
      var discGroups: Disc[][] = albums.map(album => {
        return album.getDiscs().slice(); // copy
      });
      return pairShuffle(discGroups);

      /**
       * Takes the two small smallest Disc[] and merges them using
       * alternatingShuffle. Repeats this process until there is only one Disc[]
       * left, which is returned.
       *
       * @param discGroups
       * @return {Disc[]}
       */
      function pairShuffle(discGroups: Disc[][]): Disc[] {
        var shuffledDGs = discGroups.slice(); // copy

        if (shuffledDGs.length === 0) throw 'shuffledDGs is empty';
        while (shuffledDGs.length > 1) {
          sortAlbumsByLength(shuffledDGs);

          // A disc group is a Disc[]
          var smallestTwoDiscGroups: Disc[][] =
            shuffledDGs.splice(shuffledDGs.length - 2, 2); // last 2 items
          var mergedDiscs: Disc[] = alternatingShuffle(smallestTwoDiscGroups);
          shuffledDGs.push(mergedDiscs);
        }

        // Only 1 Disc[] left inside shuffledDGs
        return shuffledDGs[0];

        /**
         * From largest to smallest
         */
        function sortAlbumsByLength(discGroups: Disc[][]) {
          discGroups.sort((disksA, disksB) => {
            return disksA.length - disksB.length;
          });
        }
      }

      /**
       * Merges Disc[][] into Disc[] by alternating between each Disc[] - it
       * takes one track from each disk until there are no tracks left in any
       * of the source Disc[] objects.
       *
       * @param discGroups
       * @return {Array}
       */
      function alternatingShuffle(discGroups: Disc[][]): Disc[] {
        // Essentially stores how many Disc objects from each Disc[] have been
        // added already
        var currentDiscGroupIndexes: number[] = [];
        for (var a = 0; a < discGroups.length; a++) {
          currentDiscGroupIndexes.push(0);
        }

        var shuffled: Disc[] = []; // disc groups

        // Add one disc, to shuffled, from each album group
        while (true) {
          var albumsEmpty = 0;
          for (var a = 0; a < discGroups.length; a++) {
            var indexInAlbum = currentDiscGroupIndexes[a];

            if (indexInAlbum == -1) {
              albumsEmpty++;
              continue;
            }

            var discGroup = discGroups[a][indexInAlbum];
            shuffled.push(discGroup);

            currentDiscGroupIndexes[a]++;

            if (currentDiscGroupIndexes[a] == discGroups[a].length) {
              currentDiscGroupIndexes[a] = -1;
              albumsEmpty++;
            }
          }

          if (albumsEmpty == discGroups.length) break;
        }

        return shuffled;
      }
    }

    // **************** Debug ****************

    function logAllDiscs(discs: Disc[], tabSpaces?: number) {
      for (var a = 0; a < discs.length; a++) {
        logDiscGroup(discs[a], tabSpaces);
      }
    }

    function logDiscGroup(disc: Disc, tabSpaces?: number) {
      var discNum = disc.getTracks()[0].discNumber() + '';

      while (discNum.length < 3) {
        discNum = ' ' + discNum;
      }

      var s = '';
      for (var a = 0; a < tabSpaces; a++) s += '\t';

      s += 'Disc: ' + discNum + ', ';
      s += 'Album: ' + disc.getTracks()[0].album();
      console.log(s);
    }
  }
}
