(function () {

  // ******* Constants *******

  var INITIAL_DISK_NUMBER = 1;
  var DELIMITER = '-';

  // *************************

  var app = Application('iTunes');
  app.includeStandardAdditions = true;
  var window = app.windows[0];

  var selection = window.selection();

  var discNumber = INITIAL_DISK_NUMBER;
  var previousTrackName = null;


  for (var a = 0; a < selection.length; a++) {
    var currentTrack = selection[a];
    var currentTrackName = currentTrack.name();

    if (!shouldKeepSameDiscNumber(currentTrackName, previousTrackName))
      discNumber++;

    previousTrackName = currentTrackName;

    // Code that applies the changes:
    // currentTrack.discNumber.set(discNumber);

    this.console.log('Disc: ' + discNumber + ', Name: ' + currentTrackName);
  }
  return 'Done';

  function shouldKeepSameDiscNumber(trackName, previousTrackName) {
    if (!previousTrackName) return true;

    var firstPrefix = trackName.split(DELIMITER)[0];
    var secondPrefix = previousTrackName.split(DELIMITER)[0];

    if (firstPrefix == secondPrefix) return true;
    return false;
  }
})();
