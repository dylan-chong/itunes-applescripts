// TODO SOMETIME put stuff into namespaces

interface IApplication {
  includeStandardAdditions: boolean;
  playlists: () => IPlaylist[];
  windows: IWindow[];
  sources: ISources;
}

interface IWindow {
  // todo selection
}

interface ISources {
  [index: number]: ISource;
  playlists: () => IPlaylist[][]; // looks through all its ISource objects
  tracks: () => ITrack[][]; // looks through all its ISource objects
}

interface ISource {
  name: () => string;
  tracks: () => ITrack[];
  playlists: () => IPlaylist[];
}

declare var Application: (appName: string) => IApplication;

interface IPlaylist {
  name: () => string; // probably should be IGettableSettable
  tracks: () => ITrack[];
  smart: () => boolean; // is a smart playlist
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
  set: (value: T) => any
}

interface ITrackAction<T> {
  (action: T): ITrack
}
