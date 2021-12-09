function createScript():Script {

  return <Script>{
    run: run
  };

  function run() {
    var app = Application('Music');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();
    var discs = new TracksDiscifier(selection).discify();

    for (var d = 0; d < discs.length; d++) {
      var disc = discs[d];

      var averagePlays = getAveragePlays(disc.getTracks());
      var lastPlayedDate = getLastPlayedDate(disc.getTracks());

      console.log(); // new line

      for (var t = 0; t < disc.getTracks().length; t++) {
        var track = disc.getTracks()[t];

        // Code that applies the changes:
        // if (track.playedCount() !== averagePlays)
          // track.playedCount.set(averagePlays);
        // if (track.playedDate() && lastPlayedDate && track.playedDate().toString() !== lastPlayedDate.toString())
          // track.playedDate.set(lastPlayedDate);

        logTrackDetails(averagePlays, lastPlayedDate,
            track.name());
      }

      console.log(); // new line
    }

    return 'Done';

    function getAveragePlays(tracks: ITrack[]) {
      var totalPlays = 0;

      for (var t = 0; t < tracks.length; t++) {
        var track = tracks[t];
        totalPlays += track.playedCount();
      }

      var average = totalPlays / tracks.length;
      average = Math.round(average);
      return average;
    }

    function getLastPlayedDate(tracks: ITrack[]) {
      return tracks
        .map(track => track.playedDate())
        .filter(date => !!date)[0];
    }

    function logTrackDetails(playCount: number,
                             playedDate: Date,
                             name: string) {
      var log = 'Play Count: ' + playCount;
      log += ', Last Played: ' + playedDate;
      log += ',\n\t\t\tName: ' + name;
      console.log(log);
    }
  }
}
