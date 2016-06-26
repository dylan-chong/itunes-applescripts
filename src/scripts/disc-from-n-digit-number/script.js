(function () {

  // ******* Constants *******

  var NUMBER_LENGTH = 3;

  // *************************

  var app = Application('iTunes');
  app.includeStandardAdditions = true;
  var window = app.windows[0];

  var selection = window.selection();

  for (var a = 0; a < selection.length; a++) {
    var track = selection[a];

    var regex = new RegExp('\\d{' + NUMBER_LENGTH + '}', 'g');
    var numbers = track.name().match(regex);
    if (!numbers || numbers.length == 0) continue;

    var discNumber = get3DigitNumber(numbers);
    if (!discNumber) continue;

    this.console.log('Disc: ' + discNumber + ', Name: ' + track.name());

    // Code that applies the changes:
    // track.discNumber.set(discNumber);
  }
  return 'Done';

  function get3DigitNumber(arrayOfNums) {
    for (var a = 0; a < arrayOfNums.length; a++) {
      var n = arrayOfNums[a];
      if ((n + '').length === NUMBER_LENGTH) {
        return n;
      }
    }
  }
})();
