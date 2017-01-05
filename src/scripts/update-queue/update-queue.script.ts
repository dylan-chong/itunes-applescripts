function createScript(): Script {

  return <Script>{
    run: run
  };

  function run() {

    // ******* Constants *******

    var ALL_MUSIC_PLAYLIST = 'All Playable Music';
    var QUEUE_PLAYLIST = 'Queue';

    // *************************

    var app = Application('iTunes');
    app.includeStandardAdditions = true;

    // Playlists
    var allMusicPlaylist = getPlaylist(ALL_MUSIC_PLAYLIST);
    var queuePlaylist = getPlaylist(QUEUE_PLAYLIST);

    // Process tracks
    var allTracks = allMusicPlaylist.tracks()
      .slice(426, 456);
    var wrappedReadyTracks = wrapReadyTracks(allTracks);
    wrappedReadyTracks.sort((w1, w2) => {
      return w1.getDaysUntilReady() - w2.getDaysUntilReady();
    });

    wrappedReadyTracks.forEach((wrapper) => {
      console.log(wrapper.getDaysUntilReady() + ':\t' + wrapper.getTrack().name());
    });

    return 'Done';

    function getPlaylist(name: string): IPlaylist {
      var matches = app.playlists()
        .filter((playlist) => playlist.name() == name);

      if (matches.length < 1) throw 'No match for playlist: ' + name;
      if (matches.length > 1) throw 'Multiple matches for playlist: ' + name;

      return matches[0];
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
        var readyDay = getLaterDate(track.playedDate(), getWaitDays(track));
        var now = new Date();
        return daysBetween(now, readyDay);

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

