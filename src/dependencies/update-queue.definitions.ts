class TrackReadinessWrapper {
  private track: ITrack;
  private daysUntilReady: number;

  constructor(track: ITrack, daysUntilReady: number) {
    this.track = track;
    this.daysUntilReady = daysUntilReady;
  }

  public getTrack(): ITrack {
    return this.track;
  }

  public getDaysUntilReady(): number {
    return this.daysUntilReady;
  }
}
