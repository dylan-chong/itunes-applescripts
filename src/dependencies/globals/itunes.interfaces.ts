interface IApplication {
  includeStandardAdditions: boolean;
  playlists: () => IPlaylist[];
}

type ApplicationGlobal = (appName: string) => IApplication;

interface IPlaylist {
  name: () => string;
  tracks: () => ITrack;
}

interface ITrack {
  name: { (): string, set: (value: string) => void }
}