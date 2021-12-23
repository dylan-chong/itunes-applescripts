function createScript(): Script {

  // *************** Constants ***************

  // true to add an item in NAME_DATA before the original track name,
  // false to add after
  var SHOULD_PREPEND = true;

  // Text to be added between a NAME_DATA item and the original name
  var DELIMITER = ' - ';

  var NAME_DATA: string[] = `[A2] Ouverture For Strings And Continuo In A Major (-1717-22)
[a2] Suite For Alto Recorder, Strings And Continuo In A Minor
[a3] Suite For 2 Oboes, Bassoon And Strings In A Minor
[A4] Ouverture For Violin, Strings And Continuo In A Major
[a4] Suite For 2 Recorders, 2 Oboes, Strings And Continuo In A Minor
[A5] Ouverture For 2 Violins And Continuo In A Major
[a7] Suite For Strings In A Minor`.split(/\n/);

  // *****************************************

  return <Script>{
    run: run
  };

  function run(options: ScriptOptions) {
    var app = Application('Music');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();
    var discs: Disc[] = new TracksDiscifier(selection).discify();

    discs.forEach(function (disc, groupIndex) {
      disc.getTracks().forEach(function (track) {
        var newName = track.name();
        var text = NAME_DATA[groupIndex];

        if (groupIndex >= NAME_DATA.length) {
          console.log('Not enough data to apply');
          return;
        }

        if (SHOULD_PREPEND) newName = text + DELIMITER + newName;
        else newName += DELIMITER + text;

        console.log('Name: ' + newName);

        if (!options.isDryRun) {
          track.name.set(newName);
        }
      });
    });

    return 'Done';
  }
}

