function createScript():Script {

  return <Script> {
    run: run
  };

  function run(options: ScriptOptions) {

    // ******* Constants *******

    var FIRST_DISC = 1;
    var INCREMENT = 1;

    // *************************

    var app = Application('Music');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();

    for (var a = 0; a < selection.length; a++) {
      var track = selection[a];
      var disc = FIRST_DISC + a * INCREMENT;

      if (!options.isDryRun) {
        track.discNumber.set(disc);
      }

      console.log('Disc: ' + disc + ', Name: ' + track.name());
    }
    return 'Done';
  }
}
