(function () {
  var app = Application('iTunes');
  app.includeStandardAdditions = true;
  var window = app.windows[0];

  var selection = window.selection();

  var groups = getGroupsOfTracks(selection);

  for (var g = 0; g < groups.length; g++) {
    var group = groups[g];

    var minimumPlays = getMinimumPlays(group);
    if (minimumPlays == 0) continue;

    var averagePlays = getAveragePlays(group);
    var lastPlayedDate = getLastPlayedDate(group);

    for (var t = 0; t < group.length; t++) {
      var track = group[t];

      // Code that applies the changes:
      // track.playedCount.set(averagePlays);
      // track.playedDate.set(lastPlayedDate);

      logTrackDetails(averagePlays, lastPlayedDate,
        track.name(), this.console);
    }

    this.console.log('\n')
  }

  return 'Done';

  // TODO externalise the below method?
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

  function getAveragePlays(tracks) {
    var totalPlays = 0;

    for (var t = 0; t < tracks.length; t++) {
      var track = tracks[t];
      totalPlays += track.playedCount();
    }

    var average = totalPlays / tracks.length;
    average = Math.round(average);
    return average;
  }

  function getLastPlayedDate(tracks) {
    return tracks[0].playedDate();
  }

  function getMinimumPlays(tracks) {
    var min;

    for (var t = 0; t < tracks.length; t++) {
      var track = tracks[t];
      var c = track.playedCount();

      if (!min || c < min) min = c;
    }

    return min;
  }

  function logGroupsOfTracks(groups, console) {
    for (var g = 0; g < groups.length; g++) {
      logTracks(groups[g], this.console);
    }
  }

  // For debugging
  function logTracks(tracks, console) {
    for (var t = 0; t < tracks.length; t++) {
      var track = tracks[t];
      logTrack(track, console);
    }
  }

  function logTrack(track, console) {
    logTrackDetails(track.playedCount(),
      track.playedDate(), track.name(),
      console);
  }

  function logTrackDetails(playCount, playedDate, name, console) {
    var log = 'Play Count: ' + playCount;
    log += ', Last Played: ' + playedDate;
    log += ',\n\t\t\tName: ' + name + '\n';
    console.log(log);
  }

})();
