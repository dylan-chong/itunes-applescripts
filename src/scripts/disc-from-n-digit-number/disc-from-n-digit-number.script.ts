function createScript():Script {

  return <Script> {
    run: run
  };

  function run() {

    var app = Application('iTunes');
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

      // Code that applies the changes:
      // track.discNumber.set(discNumber);
    }

    return 'Done';
  }
}
