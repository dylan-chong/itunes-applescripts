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
  /** Between 0 and 100. Divide by 20 to get number of stars */
  rating: IGettableSettable<number>;
  playedCount: IGettableSettable<number>;
  playedDate: IGettableSettable<Date>;
}

interface IGettableSettable<T> {
  (): T;
  set: (value: T) => void
}