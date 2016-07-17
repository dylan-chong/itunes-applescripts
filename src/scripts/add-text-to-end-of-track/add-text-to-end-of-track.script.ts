function createScript():Script {

  return <Script>{
    run: run
  };

  function run() {

    // ******* Constants *******

    // The text to put in between the original
    // track name, and a piece of data
    var DATA_PREFIX = ' - ';

    // Don't leave any empty lines in DATA
    // (or start/end with \n)
    var DATA = 'I. Allegro\n' +
        'II. Largo\n' +
        'III. Allegro\n' +
        'I. Vivace\n' +
        'II. Largo\n' +
        'III. Allegro\n' +
        'IV. Moderato\n' +
        'V. Allegro\n' +
        'I. Largo, e staccato � allegro\n' +
        'II. Andante\n' +
        'III. Allegro\n' +
        'I. Largo\n' +
        'II. Andante\n' +
        'III. Allegro\n' +
        'IV. Allegro\n' +
        'I. Largo\n' +
        'II. Fuga, allegro\n' +
        'III. Adagio\n' +
        'IV. Allegro, ma non troppo\n' +
        'V. Allegro\n' +
        'I. Vivace\n' +
        'II. Allegro';

    function getNewName(oldName) {
      return oldName + DATA_PREFIX + dataItems[a];
    }

    // *************************

    var app = Application('iTunes');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();

    var dataItems = DATA.split('\n');

    for (var a = 0; a < selection.length; a++) {
      if (a >= dataItems.length) break;

      var currentTrack = selection[a];
      var currentTrackName = currentTrack.name();
      var newTrackName = getNewName(currentTrackName);

      // Code that applies the changes:
      // currentTrack.name.set(newTrackName);

      console.log(newTrackName);
    }
    return 'Done';
  }
}
