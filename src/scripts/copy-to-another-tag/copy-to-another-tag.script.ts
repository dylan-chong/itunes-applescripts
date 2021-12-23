function createScript():Script {

  return <Script> {
    run: run
  };

  function run(options: ScriptOptions) {

    // ******* Constants *******

    function getSourceTag(track: ITrack):string {
      return track.artist();
    }

    function getNewTagValue(track: ITrack, sourceTagValue:string):string {
      var newValue = track.comment();
      if (newValue.length > 0) newValue += '\n';
      return newValue + sourceTagValue;
    }

    function setDestinationTag(track: ITrack, newValue:string) {
      track.comment.set(newValue);
    }

    // *************************

    var app = Application('Music');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();

    for (var a = 0; a < selection.length; a++) {
      var track = selection[a];

      var srcValue = getSourceTag(track);
      var newValue = getNewTagValue(track, srcValue);

      console.log('New value: ' + newValue.replace(/\n/, '\\n'));
      console.log('\tfor Track: ' + track.name());

      if (!options.isDryRun) {
        setDestinationTag(track, newValue);
      }
    }
    return 'Done';
  }
}
