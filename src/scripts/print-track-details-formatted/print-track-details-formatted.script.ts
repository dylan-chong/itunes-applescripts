function createScript():Script {

  return <Script>{
    run: run
  };

  function run(options: ScriptOptions) {

    var app = Application('Music');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();

    for (var t = 0; t < selection.length; t++) {
      var track = selection[t];

      console.log('| ' + track.name() + ' | ' + track.playedCount() + ' |');
    }

    return 'Done';
  }
}

