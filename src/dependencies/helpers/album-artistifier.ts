class AlbumArtistifier {
  constructor(private sourceAlbums: Album[]) {
  }

  // TODO don't duplicate this in other classes?
  public artistify(): Artist[] {
    var artists: Artist[] = [];

    this.sourceAlbums.forEach(album => {
      var matchingArtists = artists.filter(artist => {
        return this.hasSameArtist(artist.getAlbums()[0], album);
      });

      if (matchingArtists.length > 1) throw 'Assertion error';
      if (matchingArtists.length === 1) {
        matchingArtists[0].getAlbums().push(album);
        return;
      }

      // No artist exists yet for this album
      artists.push(new Artist([album]));
    });

    return artists;
  }

  private hasSameArtist(a: Album, b: Album): boolean {
    return this.getArtist(a) === this.getArtist(b);
  }

  private getArtist(a: Album): string {
    return a.getDiscs()[0].getTracks()[0].artist();
  }
}
