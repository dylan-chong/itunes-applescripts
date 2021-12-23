function createScript():Script {

  return <Script> {
    run: run
  };

  function run(options: ScriptOptions) {

    var app = Application('Music');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();

    for (var a = 0; a < selection.length; a++) {
      var track = selection[a];

      var regex = new RegExp('\\d{1,2}', 'g');
      var numbers = track.name().match(regex);
      if (!numbers || numbers.length == 0) continue;

      var discNumber = parseInt(numbers[0]);
      if (!discNumber) continue;

      console.log('Disc: ' + discNumber + ', Name: ' + track.name());

      if (!options.isDryRun) {
        track.discNumber.set(discNumber);
      }
    }

    return 'Done';
  }
}
