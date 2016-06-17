/*

Remember to set the language from AppleScript to Javascript!

Description:
    Sets the first track's disc number to FIRST_DISC, the second
    to FIRST_DISC + INCREMENT, the third to FIRST_DISC + 2*INCREMENT,
    etc.

Example Selection:
    Great Mass KV 427
    Missa Solemnis KV 337, Coronation Mass KV 317, Kyrie KV 341
    Missa Brevis KV 275, Missa Longa KV 262
    Missa brevis KV 259, Missa KV 258, 257
    Missa brevis KV220, 194, 192
    Missa, KV167, Missa Brevis, KV140
    Missa Solemnis KV 139, Missa Brevis KV 65
    Missa KV 66, Missa Brevis KV 49, Kyrie KV 33
    Requiem Mass in D Minor

Example Constants:
    var FIRST_DISC = 1;
    var INCREMENT = 1;

Example Result:
    Disc Number: 1, Name: Great Mass KV 427
    Disc Number: 2, Name: Missa Solemnis KV 337, Coronation Mass KV 317, Kyrie KV 341
    Disc Number: 3, Name: Missa Brevis KV 275, Missa Longa KV 262
    Disc Number: 4, Name: Missa brevis KV 259, Missa KV 258, 257
    Disc Number: 5, Name: Missa brevis KV220, 194, 192
    Disc Number: 6, Name: Missa, KV167, Missa Brevis, KV140
    Disc Number: 7, Name: Missa Solemnis KV 139, Missa Brevis KV 65
    Disc Number: 8, Name: Missa KV 66, Missa Brevis KV 49, Kyrie KV 33
    Disc Number: 9, Name: Requiem Mass in D Minor

*/

(function() {

    // ******* Constants *******

    var FIRST_DISC = 1;
    var INCREMENT = 1;

    // *************************

    var app = Application('iTunes');
    app.includeStandardAdditions = true;
    var window = app.windows[0];

    var selection = window.selection();

    for (var a = 0; a < selection.length; a++) {
        var track = selection[a];
        var disc = FIRST_DISC + a*INCREMENT;

        // Code that applies the changes:
        // track.discNumber.set(disc);

        this.console.log("Disc: " + disc + ", Name: " + track.name());
    }
    return "Done";
})();
