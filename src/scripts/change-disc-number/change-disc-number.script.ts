function createScript():Script {

  return <Script>{
    run: run
  };

  function run(options: ScriptOptions) {
    // ******* Constants *******

    // An integer (whole number, positive or negative)
    // Positive for increase in disc number
    // Negative for decrease in disc number
    var DISC_NUMBER_CHANGE = 10;

    // *************************

    var app = Application('Music');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();

    for (var t = 0; t < selection.length; t++) {
      var track = selection[t];
      var newDiscNum = track.discNumber() + DISC_NUMBER_CHANGE;

      if (!options.isDryRun) {
        track.discNumber.set(newDiscNum);
      }

      console.log('Disc: ' + newDiscNum + ', Name: ' + track.name());
    }

    return 'Done';
  }
}

