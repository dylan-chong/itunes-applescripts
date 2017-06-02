function createScript():Script {

  return <Script> {
    run: run
  };

  function run() {

    // ******* Constants *******

    function getTrackProperty(track: ITrack): IGettableSettable<string> {
      return track.name;
    }

    /**
     * This example goes from:
     *     Sonata in G Major K.547 _ L.S28 - Vladimir Horowitz
     * to:
     *     K 547, L.S28 in G Major - Vladimir Horowitz
     */
    var FIND_REGEX = /^Sonata in (.*(?:Major|Minor)) K\.?(\w+) _ L\.(\w+) - (.*)$/;
    var REPLACE_PATTERN = 'K $2, L.$3 in $1 - $4';

    // *************************

    var app = Application('iTunes');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();

    for (var a = 0; a < selection.length; a++) {
      var track = selection[a];
      var trackProperty = getTrackProperty(track);

      var oldValue = trackProperty();
      var newValue = oldValue.replace(FIND_REGEX, REPLACE_PATTERN);

      console.log('New value: ' + newValue);
      console.log('\tfor Track: ' + track.name());

      // Code that applies the changes:
      // trackProperty.set(newValue);
    }
    return 'Done';
  }
}
