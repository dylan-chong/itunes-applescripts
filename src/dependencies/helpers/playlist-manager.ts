class PlaylistManager {

  public static userPlaylists(app: IApplication): IPlaylist[] {
    return app.sources[0].playlists();
  }

  public static findPlaylist(playlists: IPlaylist[],
                             name: string,
                             isSmart: boolean): IPlaylist {
    var matches = playlists.filter(isAMatch);

    if (matches.length < 1) throw 'No match for playlist: ' + name;
    if (matches.length > 1) throw 'Multiple matches for playlist: ' + name;

    return matches[0];

    function isAMatch(playlist: IPlaylist): boolean {
      return playlist.name() == name &&
        playlist.smart() == isSmart;
    }
  }
}