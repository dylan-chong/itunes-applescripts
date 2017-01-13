class TracksDiscifier {
  constructor(private sourceTracks: ITrack[]) {
  }

  /**
   * Groups sourceTracks into Disc objects
   */
  public discify(): Disc[] {
    if (this.sourceTracks == null || this.sourceTracks.length == 0)
      throw 'sourceTracks is empty';

    // todo sometime maybe don't assume sequential discs?

    var tracks = this.sourceTracks.slice(); // copy
    var discs: Disc[] = [];

    while (true) {
      var currentDiscTracks: ITrack[] = [];
      currentDiscTracks.push(tracks[0]);
      tracks.shift(); // remove first item

      while (true) {
        if (tracks.length === 0) break;
        if (tracks[0].album() != currentDiscTracks[0].album())
          break;
        if (tracks[0].artist() != currentDiscTracks[0].artist())
          break;
        if (tracks[0].discNumber() != currentDiscTracks[0].discNumber())
          break;
        currentDiscTracks.push(tracks[0]);
        tracks.shift(); // remove first item
      }

      discs.push(new Disc(currentDiscTracks));
      if (tracks.length === 0) break;
    }

    return discs;
  }
}
