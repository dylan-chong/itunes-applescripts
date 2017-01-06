function createScript(): Script {

  return <Script>{
    run: run
  };

  function run() {

    // ******* Constants *******

    var ALL_MUSIC_PLAYLIST = 'Ready to Queue';
    var QUEUE_PLAYLIST = 'Queue';

    /**
     * Number of tracks in the queue
     */
    var TRACK_LIMIT = 300;

    // *************************

    var app = Application('iTunes');
    app.includeStandardAdditions = true;

    // Playlists
    var allMusicPlaylist = getPlaylist(ALL_MUSIC_PLAYLIST);
    var queuePlaylist = getPlaylist(QUEUE_PLAYLIST);

    // Process tracks
    var allTracks = allMusicPlaylist.tracks();
    var wrappedReadyTracks = wrapReadyTracks(allTracks);

    wrappedReadyTracks.sort(compareTrackWrappers);
    wrappedReadyTracks = wrappedReadyTracks.slice(0, TRACK_LIMIT);

    wrappedReadyTracks.forEach(wrapper => {
      var days = -Math.round(wrapper.getDaysUntilReady());
      console.log('Has been ready for ' + days + ' days:\t' +
        wrapper.getTrack().name());
    });

    clearPlaylist(queuePlaylist);
    duplicateAllToPlaylist(queuePlaylist, wrappedReadyTracks);

    return 'Done';

    function getPlaylist(name: string): IPlaylist {
      var matches = app.playlists()
        .filter((playlist) => playlist.name() == name);

      if (matches.length < 1) throw 'No match for playlist: ' + name;
      if (matches.length > 1) throw 'Multiple matches for playlist: ' + name;

      return matches[0];
    }

    function clearPlaylist(playlist:IPlaylist) {
      playlist.tracks().forEach((track) => {
        track.delete({from: playlist});
      });
    }

    function duplicateAllToPlaylist(playlist:IPlaylist,
                                    tracksWrappersToAdd: TrackReadinessWrapper[]) {
      tracksWrappersToAdd.forEach((wrapper) => {
          wrapper.getTrack().duplicate({to: playlist});
      })
    }

    function compareTrackWrappers(w1: TrackReadinessWrapper,
                                  w2: TrackReadinessWrapper) {
      var readyDaysDifference = w1.getDaysUntilReady() - w2.getDaysUntilReady();
      // Account for slight time difference when calculating each daysUntilReady
      // return readyDaysDifference;
      if (Math.abs(readyDaysDifference) > 0.0001) return readyDaysDifference;

      // One that was imported earlier should appear first. In seconds
      var addedTimeDifference = (w1.getTrack().dateAdded().getTime() -
        w2.getTrack().dateAdded().getTime());
      if (addedTimeDifference > 1000) return addedTimeDifference;

      var album1 = w1.getTrack().album();
      var album2 = w2.getTrack().album();
      if (album1 < album2) return -1;
      if (album1 > album2) return 1;

      var discDiff = w1.getTrack().discNumber() - w2.getTrack().discNumber();
      if (discDiff !== 0) return discDiff;

      return w1.getTrack().trackNumber() - w2.getTrack().trackNumber();
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
}

