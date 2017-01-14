function createScript(): Script {

  return <Script>{
    run: run
  };

  function run() {

    // ******* Constants *******

    var ALL_MUSIC_PLAYLIST = 'Ready to Queue';
    var QUEUE_PLAYLIST = 'Queue';

    /**
     * The maximum length of the resulting playlist, in seconds.
     */
    var PLAYLIST_DURATION_LIMIT_SECONDS = 12 * 3600; // 12 hours

    /**
     * Set to 0.2 to make sure no album takes up (much) more than 20% of
     * the queue. Can be set to anywhere between 0 (only allow one disc of
     * each album) and 1 (no limit).
     */
    var DURATION_LIMIT_PER_ALBUM_FRACTION = 0.2;

    // *************************

    var app = Application('iTunes');
    app.includeStandardAdditions = true;

    // Process tracks
    var allAlbums = getAllAlbums();

    // Sort discs so the ready to play ones are first
    allAlbums.forEach(album => {
      album.getDiscs().sort((discA, discB) => {
        return compareTracks(discA.getTracks()[0], discB.getTracks()[0]);
      });
    });

    // Each number[] is an album's durations
    var durationsOfEachDiscByAlbum: number[][] = allAlbums.map(album => {
      return album.getDiscs().map(disc => {
        var durationsPerTrack: number[] = disc.getTracks().map(track => {
          return track.duration();
        });

        return durationsPerTrack.reduce(sum);
      });
    });

    // Remove excess discs in each album (prevents too much of a single album
    // filling up the queue)
    allAlbums.forEach((album, albumIndex) => {
      var discs = album.getDiscs();
      var duration = 0;

      var durationLimit = DURATION_LIMIT_PER_ALBUM_FRACTION *
        PLAYLIST_DURATION_LIMIT_SECONDS;

      for (var i = 0; i < discs.length; i++) {
        duration += durationsOfEachDiscByAlbum[albumIndex][i];
        if (durationsOfEachDiscByAlbum[albumIndex][i] === undefined)
          throw 'undefined';

        if (duration >= durationLimit) {
          // Remove all disks after the current one
          var startOfRemoval = i + 1;
          discs.splice(startOfRemoval, discs.length - startOfRemoval);
          return;
        }
      }
    });

    // Flatten allAlbums
    var discs: Disc[] = [];
    allAlbums.forEach(album => {
      album.getDiscs().forEach(disc => {
        discs.push(disc);
      });
    });

    discs.sort((disc1, disc2) => {
      return compareTracks(disc1.getTracks()[0], disc2.getTracks()[0]);
    });

    // Filter out too many discs
    var limitedDiscs = (function () {
      var limited: Disc[] = [];
      var duration = 0;

      for (var i = 0; i < discs.length; i++) {
        var disc = discs[i];
        limited.push(disc);

        duration += disc.getTracks()
          .map(track => track.duration())
          .reduce(sum);
        if (duration > PLAYLIST_DURATION_LIMIT_SECONDS) break;
      }

      return limited;
    })();

    var queuePlaylist = getPlaylist(QUEUE_PLAYLIST);

    // Code that makes changes:
    clearPlaylist(queuePlaylist);
    duplicateAllToPlaylist(queuePlaylist, limitedDiscs);

    return 'Done';

    function getAllAlbums() {
      var allMusicPlaylist = getPlaylist(ALL_MUSIC_PLAYLIST);
      var allTracks = allMusicPlaylist.tracks().slice(0, 300);//todo
      var allDiscs = new TracksDiscifier(allTracks).discify();
      return new DiscsAlbumifier(allDiscs).albumify();
    }

    function getPlaylist(name: string): IPlaylist {
      var matches = app.playlists()
        .filter((playlist) => playlist.name() == name);

      if (matches.length < 1) throw 'No match for playlist: ' + name;
      if (matches.length > 1) throw 'Multiple matches for playlist: ' + name;

      return matches[0];
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

    function sum(a: number, b: number): number {
      return a + b;
    }

    /**
     * Copies only the ready tracks into a new array, wrapping them in an object
     * @param tracks
     * @return {TrackReadinessWrapper[]}
     */
    function wrapReadyTracks(tracks: ITrack[]): TrackReadinessWrapper[] {
      var wrapped: TrackReadinessWrapper[] = [];
      tracks.forEach((track) => {
        var days = getDaysUntilTrackIsReady(track);
        if (days > 0) return;

        wrapped.push(new TrackReadinessWrapper(track, days));
      });
      return wrapped;
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
  }
}

