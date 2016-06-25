(function() {

    // ******* Constants *******

    var FIRST_DISC_NUMBER = 1;
    var LAST_DISC_NUMBER = 210;
    // TODO add separate ignore list for complete discs and incomplete discs

    // *************************

    var app = Application('iTunes');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();
    var discObjects = getSortedSelection(selection);

    // Completely Missing
    var missingDiscs = getMissingDiscs(discObjects);
    this.console.log('Completely missing discs: ' + missingDiscs);

    // Partially Missing
    this.console.log('Partially missing discs: ');

    for (var a = 0; a < discObjects.length; a++) {
        var obj = getMissingTrackObjectForDiscObject(discObjects[a]);
        if (!obj) continue;

        this.console.log(missingTrackObjectToString(obj));
    }

    return 'Done';


    function getDiscObjects(first, last) {
        var numbers = [];

        for (var a = first; a <= last; a++) {
            numbers.push({
                discNumber: a, // this matches the index of the array,
                // so it's just for debugging
                tracks: [],
                trackCount: -1,
            });
        }

        return numbers;
    }

    function discObjToString(discObj) {
        var ret = 'Disc number: ' + discObj.discNumber + ',\n';
        ret += '\tTrack count: ' + discObj.trackCount + ',\n';
        ret += '\tTracks:\n';

        for (var t = 0; t < discObj.tracks.length; t++) {
            var track = discObj.tracks[t];
            var line = '\t\tTrack: ';

            line += track.trackNumber() + ' of ' + track.trackCount();
            line += ', Name: ' + track.name();

            ret += line + '\n';
        }

        return ret;
    }

    function logDiscObjects(console, discObjects) {
        for (var d = 0; d < discObjects.length; d++) {
            console.log(discObjToString(discObjects[d]));
        }
    }

    // Note: the tracks aren't necessarily added to each discObj's tracks
    // array in the correct order - it depends on the order of the selection.
    function getSortedSelection(selection) {
        var discObjects = getDiscObjects(FIRST_DISC_NUMBER, LAST_DISC_NUMBER);

        for (var s = 0; s < selection.length; s++) {
            var track = selection[s];
            var discNumber = track.discNumber();

            if (discNumber > LAST_DISC_NUMBER) continue;
            if (discNumber < FIRST_DISC_NUMBER) continue;

            var discObj = getDiscObjectForDiscNumber(discObjects, discNumber);
            if (discObj == null) continue;

            discObj.tracks.push(track);
            discObj.trackCount = track.trackCount();
        }

        return discObjects;
    }

    function getDiscObjectForDiscNumber(array, discNum) {
        for (var a = 0; a < array.length; a++) {
            if (array[a].discNumber == discNum)
                return array[a];
        }

        return null;
    }

    function getMissingDiscs(discObjects) {
        var missingDiscNumbers = [];

        for (var a = 0; a < discObjects.length; a++) {
            var discObj = discObjects[a];
            if (discObj.trackCount == -1) {
                missingDiscNumbers.push(discObj.discNumber);
                continue;
            }
        }

        return missingDiscNumbers;
    }

    function getMissingTracks(discObjects) {
        var missingTrackObjects = [];

        for (var a = 0; a < discObjects.length; a++) {
            var missingTrackObj = getMissingTrackObjectForDiscObject(discObjects);
            if (missingTrackObj) missingTrackObjects.push(missingTrackObj);
        }
    }

    function getMissingTrackObjectForDiscObject(discObj) {
        var obj = {
            discNumber: discObj.discNumber,
            idealTrackCount: discObj.trackCount,
            missingTrackNumbers: [],
            extraTrackNumbers: [],
            existingTrackNumbers: []
        };

        var tracks = discObj.tracks;
        var missing = obj.missingTrackNumbers;
        var extra = obj.extraTrackNumbers;
        var existing = obj.existingTrackNumbers;

        // Add the ideal track numbers
        for (var a = 0; a < obj.idealTrackCount; a++) {
            missing.push(a + 1);
        }

        // Remove the existing track numbers from missing
        for (var a = 0; a < tracks.length; a++) {
            var track = tracks[a];
            var trackNumber = track.trackNumber();
            var index = missing.indexOf(trackNumber);

            if (index != -1) {
                missing.splice(index, 1);
            } else {
                extra.push(trackNumber);
            }

            existing.push(trackNumber);
        }

        if (missing.length == 0 && extra.length == 0) return null;

        return obj;
    }

    function missingTrackObjectToString(obj) {
        var str = '\tDisc Number: ' + obj.discNumber;
        str += '\n\t\t' + 'Ideal Track Count: ' + obj.idealTrackCount;
                str += '\n\t\t' + 'Existing Track Numbers: ' +obj.existingTrackNumbers;
        if (obj.missingTrackNumbers.length > 0)
            str += '\n\t\t' + 'Missing Track Numbers: ' + obj.missingTrackNumbers.toString();
        if (obj.extraTrackNumbers.length > 0)
            str += '\n\t\t' + 'Extra Track Numbers: ' + obj.extraTrackNumbers;
        return str;
    }

})();
