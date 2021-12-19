function createScript():Script {

  return <Script>{
    run: run
  };

  function run(options: ScriptOptions) {
    var app = Application('Music');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();

    var discs = new TracksDiscifier(selection).discify();

    for (var d = 0; d < discs.length; d++) { // TODO put into function, and move return up
      var group = discs[d];

      for (var t = 0; t < group.getTracks().length; t++) {
        var track = group.getTracks()[t];
        var num = t + 1;
        var count = group.getTracks().length;

        // Reapply changes twice (sometimes changes don't apply properly)
        for (var i = 0; i < 2; i++) {
          if (!options.isDryRun) {
            track.trackCount.set(count);
            track.trackNumber.set(num);
          }
        }

        console.log('Track: ' + num + ' of ' + count +
                    ', Name: ' + track.name());
      }
    }

    return 'Done';
  }
}

