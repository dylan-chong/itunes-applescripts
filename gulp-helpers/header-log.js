const fancyLog = require('fancy-log');

exports.log = function (tag, priority, data) {
  switch (priority) {
    case 0:
      var LINE_COUNT = 3;
      var MARK_COUNT = 6;
      var marks = new Array(MARK_COUNT + 1).join('*');
      var obviousLine = marks +
        new Array(tag.length + 1 + 2).join('-') +
        marks;
      // + 1 because array.join creates one less copy of the string
      // than the count, and + 2 because of the spaces around the tag
      for (var a = 0; a < LINE_COUNT; a++) {
        fancyLog(obviousLine);
      }
      fancyLog(marks + ' ' + tag + ' ' + marks);
      for (var a = 0; a < LINE_COUNT; a++) {
        fancyLog(obviousLine);
      }
      break;
    case 1:
      fancyLog();
      fancyLog('****** ' + tag + ' ******\n');
      break;
    case 2:
      fancyLog('** ' + tag + ' **\n');
      break;
    case 3:
      fancyLog('** ' + tag + ' **');
      break;
    case 4:
      fancyLog(tag);
      break;
    default:
      console.error('Invalid priority: ' + priority);
      break;
  }
  if (data) console.log('\t' + data.toString().replace(/\n/g, '\n\t'));
};