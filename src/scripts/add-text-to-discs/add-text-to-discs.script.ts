function createScript():Script {

  // *************** Constants ***************

  // true to add an item in NAME_DATA before the original track name,
  // false to add after
  var SHOULD_PREPEND = true;

  // Text to be added between a NAME_DATA item and the original name
  var DELIMITER = ' - ';

  var NAME_DATA:string[] = `[A2] Ouverture For Strings And Continuo In A Major (-1717-22)
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

  function run() {
    var app = Application('iTunes');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();

    var groups = getGroupsOfTracks(selection);

    groups.forEach(function (group, groupIndex) {
      group.forEach(function (track) {
        var newName = track.name();
        var text = NAME_DATA[groupIndex];

        if (groupIndex >= NAME_DATA.length) {
          console.log('Not enough data to apply');
          return;
        }

        if (SHOULD_PREPEND) newName = text + DELIMITER + newName;
        else newName += DELIMITER + text;

        console.log('Name: ' + newName);

        // Code that applies the changes:
        // track.name.set(newName);
      });
    });

    return 'Done';

    function getGroupsOfTracks(originalTracksArray) {
      if (originalTracksArray == null || originalTracksArray.length == 0)
        return null;

      var tracks = originalTracksArray.slice();
      var groups = [];
      while (true) {
        var group = [];
        group.push(tracks[0]);
        tracks = tracks.slice(1);

        while (true) {
          if (!tracks[0]) break;
          if (tracks[0].album() != group[0].album())
            break;
          if (tracks[0].artist() != group[0].artist())
            break;
          if (tracks[0].discNumber() != group[0].discNumber())
            break;
          group.push(tracks[0]);
          tracks = tracks.slice(1);
        }

        groups.push(group);
        if (!tracks[0]) break;
      }

      return groups;
    }
  }
}

