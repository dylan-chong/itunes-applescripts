function createScript(): Script {

  return <Script>{
    run: run
  };

  function run() {
    // ******* Constants *******

    var ALL_MUSIC_PLAYLIST = 'All Playable Music';
    var QUEUE_PLAYLIST = 'Queue';

    // *************************

    var appGlobal: ApplicationGlobal = Application;
    var app: IApplication = appGlobal('iTunes');
    app.includeStandardAdditions = true;

    var allMusicPlaylist = getPlaylist(ALL_MUSIC_PLAYLIST);
    var queuePlaylist = getPlaylist(QUEUE_PLAYLIST);

    var allTracks = allMusicPlaylist.tracks();

    debugger;


    return 'Done';

    function getPlaylist(name: string): IPlaylist {
      var playlists: IPlaylist[] = app.playlists();
      var matches = playlists
        .filter((playlist) => playlist.name() == name);

      if (matches.length < 1) throw 'No match for playlist: ' + name;
      if (matches.length > 1) throw 'Multiple matches for playlist: ' + name;

      return matches[0];
    }
  }
}

