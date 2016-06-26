// noinspection JSUnresolvedVariable
TinyCore.Module.define(DEFAULT_SCRIPT_NAME, [], function () {
    
  return {
    onStart: onStart
  };

  function onStart(resultObj) {
    console.log('STARTING ', resultObj, resultObj.testProperty);

    var app = Application('iTunes');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();

    console.log('1');

    var groups = getGroupsOfTracks(selection);

    console.log('2');
    resultObj.result = 'Just about done';
    for (var g = 0; g < groups.length; g++) {
      console.log('3');
      var group = groups[g];
      console.log('4');
      for (var t = 0; t < group.length; t++) {
        var track = group[t];
        var num = t + 1;
        var count = group.length;

        for (var a = 0; a < 2; a++) {
          // Code that applies the changes:
          // track.trackCount.set(count);
          // track.trackNumber.set(num);
        }

        console.log('Track: ' + num + ' of ' + count + ', Name: ' + track.name());
      }
    }

    resultObj.result = 'Done';
    console.log('SET RESULT TO ' + resultObj.result);

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
});

