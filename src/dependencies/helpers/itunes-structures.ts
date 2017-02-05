/**
 * Not an official iTunes object
 */

class Disc {
  constructor(private tracks: ITrack[]) {
    if (tracks.length === 0) throw 'Tracks cannot be empty';
  }

  public getTracks(): ITrack[] {
    return this.tracks;
  }

  // todo helper methods to get album and stuff?
  public getTotalDuration(): number {
    return this.tracks
      .map(track => track.duration())
      .reduce((a, b) => a + b);
  }
}

/**
 * Not an official iTunes object
 */
class Album {
  constructor(private discs: Disc[]) {
  }

  public getDiscs(): Disc[] {
    return this.discs;
  }
}

/**
 * Not an official iTunes object
 */
class Artist {
  constructor(private albums: Album[]) {
  }

  public getAlbums(): Album[] {
    return this.albums;
  }
}
