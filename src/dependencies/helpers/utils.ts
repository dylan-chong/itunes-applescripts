function sortTracks(tracks: ITrack[]): ITrack[] {
  return _.sortBy(tracks, [
    (track) => track.artist(),
    (track) => track.album(),
    (track) => track.discNumber(),
    (track) => track.trackNumber(),
  ]);
}
