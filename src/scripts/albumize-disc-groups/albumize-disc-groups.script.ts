function createScript():Script {

  return <Script>{
    run: run
  };

  function run() {
    var app = Application('iTunes');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();

    var groups = getGroupsOfTracks(selection);

    for (var g = 0; g < groups.length; g++) { // TODO put into function, and move return up
      var group = groups[g];
      for (var t = 0; t < group.length; t++) {
        var track = group[t];
        var num = t + 1;
        var count = group.length;

        // Reapply changes twice (sometimes changes don't apply properly)
        for (var i = 0; i < 2; i++) {
          // Code that applies the changes:
          // track.trackCount.set(count);
          // track.trackNumber.set(num);
        }

        console.log('Track: ' + num + ' of ' + count +
                    ', Name: ' + track.name());
      }
    }
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

