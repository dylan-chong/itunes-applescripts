function createScript(): Script {

  return <Script>{
    run: run
  };

  function run() {

    // ******* Constants *******

    var ALL_MUSIC_PLAYLIST = 'Ready to Queue';
    var ALL_MUSIC_PLAYLIST_IS_SMART = true;
    var QUEUE_PLAYLIST = 'Queue';

    /**
     * The maximum length of the resulting playlist, in seconds.
     */
    var PLAYLIST_DURATION_LIMIT_SECONDS = 3 * 7 * 3600; // 21 hours

    /**
     * Set to 0.2 to make sure no album takes up (much) more than 20% of
     * the queue. Can be set to anywhere between 0 (only allow one disc of
     * each album) and 1 (no limit).
     */
    var DURATION_LIMIT_PER_ALBUM_FRACTION = 0.1;

    // *************************

    var app = Application('iTunes');
    app.includeStandardAdditions = true;

    // Process tracks
    var allAlbums = getAllAlbums();

    // Sort discs in each album so the ready to play ones are first
    allAlbums.forEach(album => sortDiscs(album.getDiscs()));
    allAlbums.forEach(limitDiscsPerAlbum);

    var discs = flattenAlbumsIntoDiscs(allAlbums);
    sortDiscs(discs); // Re-sort - array is not sorted because of the flattening

    // Filter out discs if there are too many
    var limitedDiscs = limitDiscs(discs);

    var queuePlaylist = getPlaylist(QUEUE_PLAYLIST, false);

    logDiscs(limitedDiscs);

    // Code that makes changes:
    // clearPlaylist(queuePlaylist);
    // duplicateAllToPlaylist(queuePlaylist, limitedDiscs);

    return 'Done';

    function getAllAlbums() {
      var allMusicPlaylist = getPlaylist(
        ALL_MUSIC_PLAYLIST, ALL_MUSIC_PLAYLIST_IS_SMART);

      var allTracks = allMusicPlaylist.tracks();
      var allDiscs = new TracksDiscifier(allTracks).discify();
      return new DiscsAlbumifier(allDiscs).albumify();
    }

    function getPlaylist(name: string, isSmart: boolean): IPlaylist {
      return PlaylistManager.findPlaylist(
        PlaylistManager.userPlaylists(app),
        name,
        isSmart);
    }

    function clearPlaylist(playlist: IPlaylist) {
      playlist.tracks().forEach(track => {
        track.delete({from: playlist});
      });
    }

    function duplicateAllToPlaylist(playlist: IPlaylist,
                                    discs: Disc[]) {
      discs.forEach(disc => {
        disc.getTracks().forEach(track => {
          track.duplicate({to: playlist});
        });
      });
    }

    function sortDiscs(discs: Disc[]) {
      // Sort Disc[] by size
      discs.sort((discA, discB) => {
        return compareTracks(discA.getTracks()[0], discB.getTracks()[0]);
      });

      // Sort each Disc's tracks by track number
      discs.forEach(disc => {
        disc.getTracks().sort((trackA, trackB) => {
          return trackA.trackNumber() - trackB.trackNumber();
        })
      })
    }

    function flattenAlbumsIntoDiscs(albums: Album[]): Disc[] {
      var discs: Disc[] = [];
      albums.forEach(album => {
        album.getDiscs().forEach(disc => {
          discs.push(disc);
        });
      });
      return discs;
    }

    /**
     * Remove excess discs in each album (prevents too much of a single album
     * filling up the queue)
     */
    function limitDiscsPerAlbum(album: Album) {
      var discs = album.getDiscs();
      var duration = 0;

      var durationLimit = DURATION_LIMIT_PER_ALBUM_FRACTION *
        PLAYLIST_DURATION_LIMIT_SECONDS;

      for (var i = 0; i < discs.length; i++) {
        duration += discs[i].getTotalDuration();

        if (duration >= durationLimit) {
          // Remove all disks after the current one
          var startOfRemoval = i + 1;
          discs.splice(startOfRemoval, discs.length - startOfRemoval);
          return;
        }
      }
    }

    /**
     * Remove Disc objects at the end of the array if there are too many
     */
    function limitDiscs(discs: Disc[]): Disc[] {
      var limited: Disc[] = [];
      var duration = 0;

      for (var i = 0; i < discs.length; i++) {
        var disc = discs[i];
        limited.push(disc);

        duration += disc.getTotalDuration();
        if (duration > PLAYLIST_DURATION_LIMIT_SECONDS) break;
      }

      return limited;
    }

    /**
     * Compare tracks so that they are sorted in the queue by how long they
     * have been ready in the queue.
     */
    function compareTracks(track1: ITrack,
                           track2: ITrack) {
      var readyDaysDifference = getDaysUntilTrackIsReady(track1) -
        getDaysUntilTrackIsReady(track2);
      // Account for slight time difference when calculating each daysUntilReady
      // return readyDaysDifference;
      if (Math.abs(readyDaysDifference) > 0.0001) return readyDaysDifference;

      // One that was imported earlier should appear first. In seconds
      var addedTimeDifference = (track1.dateAdded().getTime() -
        track2.dateAdded().getTime());
      if (addedTimeDifference > 1000) return addedTimeDifference;

      var album1 = track1.album();
      var album2 = track2.album();
      if (album1 < album2) return -1;
      if (album1 > album2) return 1;

      var discDiff = track1.discNumber() - track2.discNumber();
      if (discDiff !== 0) return discDiff;

      return track1.trackNumber() - track2.trackNumber();
    }

    /**
     * @param track
     * @return {number} Less than 0 if already ready to play
     */
    function getDaysUntilTrackIsReady(track: ITrack): number {
      var readyDate: Date;
      if (track.playedDate()) {
        readyDate = getLaterDate(track.playedDate(), getWaitDays(track));
      }
      var now = new Date();
      return daysBetween(now, readyDate || new Date(0));

      function daysBetween(from: Date, to: Date): number {
        var millisDifference = to.getTime() - from.getTime();
        return millisDifference / (24 * 60 * 60 * 1000);
      }

      function getLaterDate(date: Date, numDays: number): Date {
        var laterDate = new Date(date.getTime());
        laterDate.setDate(laterDate.getDate() + numDays);
        return laterDate;
      }

      /**
       * If track is played within this number of days, the track is not
       * allowed to enter the QUEUE_PLAYLIST (i.e., is is ready)
       * @param track
       */
      function getWaitDays(track: ITrack): number {
        var NOT_PLAYED = 0;

        var playedCountGroup: number = getPlayedCountGroup(track);
        if (playedCountGroup === NOT_PLAYED) {
          return 0;
        }

        var stars = track.rating() / 20;
        var baseDays: number = getBaseDays(stars);
        if (playedCountGroup >= 2) baseDays += 30;
        if (playedCountGroup >= 3) baseDays += 20;
        if (playedCountGroup >= 4) baseDays += 10;

        return baseDays;

        function getPlayedCountGroup(track: ITrack): number {
          var plays = track.playedCount();
          if (plays === 0) return NOT_PLAYED;
          if (plays <= 3) return 1;
          if (plays <= 8) return 2;
          if (plays <= 18) return 3;
          return 4;
        }

        function getBaseDays(stars: number): number {
          switch (stars) {
            case 1: return 310;
            case 2: return 250;
            case 3: return 190;
            case 4: return 160;
            case 5: return 130;
          }
        }
      }
    }

    function logDiscs(discs: Disc[]) {
      discs.forEach(disc => {
        var days = -Math.round(getDaysUntilTrackIsReady(disc.getTracks()[0]));
        var numTracks = formatNumber(disc.getTracks().length);

        console.log(numTracks + ' tracks in this disc have been ready for '
          + days + ' days:\t' + disc.getTracks()[0].name());

        function formatNumber(num: number): string {
          var numStr = num + '';
          while (numStr.length < 3) {
            numStr = ' ' + numStr;
          }
          return numStr;
        }
      });
    }
  }
}

