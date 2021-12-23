function createScript():Script {

  return <Script> {
    run: run
  };

  function run(options: ScriptOptions) {

    // ******* Constants *******

    // The disk number of the very first disc. The next disc's number will be
    // this + 1, then the one after will be this + 2, ... and so on.
    var INITIAL_DISC_NUMBER = 1;

    // The string or regex to break up the track names by
    var DELIMITER = /[-,:]/;

    // *************************

    var app = Application('Music');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();

    var discNumber = INITIAL_DISC_NUMBER;
    var previousTrackName = null;


    for (var a = 0; a < selection.length; a++) {
      var currentTrack = selection[a];
      var currentTrackName = currentTrack.name();

      if (!shouldKeepSameDiscNumber(currentTrackName, previousTrackName))
        discNumber++;

      previousTrackName = currentTrackName;

      if (!options.isDryRun) {
        currentTrack.discNumber.set(discNumber);
      }

      console.log('Disc: ' + discNumber + ', Name: ' + currentTrackName);
    }
    return 'Done';

    function shouldKeepSameDiscNumber(trackName, previousTrackName) {
      if (!previousTrackName) return true;

      var firstPrefix = trackName.split(DELIMITER)[0];
      var secondPrefix = previousTrackName.split(DELIMITER)[0];

      if (firstPrefix == secondPrefix) return true;
      return false;
    }
  }
}
