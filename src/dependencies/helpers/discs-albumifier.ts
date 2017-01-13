class DiscsAlbumifier {
  constructor(private sourceDiscs: Disc[]) {
  }

  /**
   * Groups sourceDiscs into Album objects
   */
  public albumify(): Album[] {
    if (this.sourceDiscs == null || this.sourceDiscs.length == 0)
      throw 'sourceDiscs is empty';

    var albums: Album[] = [];

    for (var d = 0; d < this.sourceDiscs.length; d++) {
      var discGroup = this.sourceDiscs[d];
      var index = getIndexOfSameAlbum(discGroup);

      if (index == -1) {
        albums.push(new Album([discGroup]));
        continue;
      }

      albums[index].getDiscs().push(discGroup);
    }

    return albums;

    function getIndexOfSameAlbum(disc: Disc): number {
      for (var a = 0; a < albums.length; a++) {
        // first track in the first disc of the album group
        var trackFromAlbumA = albums[a].getDiscs()[0].getTracks()[0];
        var trackForSearch = disc.getTracks()[0];

        if (trackForSearch.album() !== trackFromAlbumA.album()) continue;
        if (trackForSearch.artist() !== trackFromAlbumA.artist()) continue;

        return a;
      }

      return -1;
    }
  }
}
