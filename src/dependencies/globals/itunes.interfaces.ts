interface IApplication {
  includeStandardAdditions: boolean;
  playlists: () => IPlaylist[];
}

type ApplicationGlobal = (appName: string) => IApplication;
declare var Application: ApplicationGlobal;

interface IPlaylist {
  name: () => string;
  tracks: () => ITrack[];
}

interface ITrack {
  name: IGettableSettable<string>;
  album: IGettableSettable<string>;
  artist: IGettableSettable<string>;
  bitRate: IGettableSettable<number>;
  /** Between 0 and 100. Divide by 20 to get number of stars */
  rating: IGettableSettable<number>;
  playedCount: IGettableSettable<number>;
  playedDate: IGettableSettable<Date>;
  dateAdded: IGettableSettable<Date>;
  trackNumber: IGettableSettable<number>;
  discNumber: IGettableSettable<number>;
  // noinspection ReservedWordAsName
  delete: ITrackAction<{from: IPlaylist}>; // Stupid Apple API uses a reserved keyword for a property
  duplicate: ITrackAction<{to: IPlaylist}>;
  move: ITrackAction<{to: IPlaylist}>;
  playlists: () => IPlaylist[];
}

interface IGettableSettable<T> {
  (): T; // get
  set: (value: T) => void
}

interface ITrackAction<T> {
  (action: T): ITrack
}