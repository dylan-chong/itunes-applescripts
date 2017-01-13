function createScript():Script {

  return <Script>{
    run: run
  };

  function run() {
    var app = Application('iTunes');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();
    var discs = new TracksDiscifier(selection).discify();

    for (var d = 0; d < discs.length; d++) {
      var disc = discs[d];

      var minimumPlays = getMinimumPlays(disc.getTracks());
      if (minimumPlays === 0) {
        console.log('Skipping disk with ' + disc.getTracks()[0].name());
        continue;
      }

      var averagePlays = getAveragePlays(disc.getTracks());
      var lastPlayedDate = getLastPlayedDate(disc.getTracks());

      console.log(); // new line

      for (var t = 0; t < disc.getTracks().length; t++) {
        var track = disc.getTracks()[t];

        // Code that applies the changes:
        // track.playedCount.set(averagePlays);
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
      return tracks[0].playedDate();
    }

    function getMinimumPlays(tracks: ITrack[]) {
      if (!tracks || tracks.length === 0) throw 'No tracks to check';
      var min = 0;

      for (var t = 0; t < tracks.length; t++) {
        var track = tracks[t];
        var c = track.playedCount();

        if (!min || c < min) min = c;
      }

      return min;
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
