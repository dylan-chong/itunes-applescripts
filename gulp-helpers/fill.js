const fs = require('fs');
const log = require('./header-log.js').log; // TODO AFTER remove .log
const glob = require('glob');

// Matches '/* @fill a-keyword */'
const FILL_REGEX = /\/\*[ ]*@fill[ ]+[^ \*]+[ ]*\*\//g;

exports.getFilledString = getFilledString;

function getFilledString(templateObject, replacementsDictionary) {
  var template = getDataFromFileContentsObject(templateObject);
  var replacements = getReplacements(replacementsDictionary);

  return getFilledString(template, replacements);

  function getDataFromFileContentsObject(object) {
    return object.contents
      || (object.path && getJointStringFromFiles(object.path))
      || (object.paths && object.paths.map(getJointStringFromFiles).join(';\n'))
      || '';

    // TODO LATER rename path to glob(s)
    // TODO LATER don't kill not found errors silently

    function getJointStringFromFiles(globPattern) {
      var files = glob.sync(globPattern);
      var combined = '';

      for (var a = 0; a < files.length; a++) {
        combined += fs.readFileSync(files[a]) + ';\n';
      }

      return combined || '// No dependencies found\n';
    }
  }

  function getReplacements(replacementsDictionary) {
    var r = {};
    for (var key in replacementsDictionary) {
      // noinspection JSUnfilteredForInLoop
      r[key] = getDataFromFileContentsObject(replacementsDictionary[key]);
    }
    return r;
  }

  function getFilledString(template, replacements) {
    var splitByFillComments = template.split(FILL_REGEX);
    var fillContents = getFillContents(template, replacements);
    var filledString = '';

    for (var a = 0; a < fillContents.length; a++) {
      filledString += splitByFillComments[a] + fillContents[a];
    }
    filledString += splitByFillComments[splitByFillComments.length - 1];

    return filledString;

    function getFillContents(template, replacements) {
      var fillComments = template.match(FILL_REGEX);
      var fillCommentArguments = getFillCommentArguments(fillComments);
      var fillContents = [];

      for (var a = 0; a < fillCommentArguments.length; a++) {
        var arg = fillCommentArguments[a];
        
        // Get the contents to be replaced, or the original
        // @fill comment if no replacements exist
        fillContents[a] = replacements[arg] || fillComments[a];
      }
      
      return fillContents;
      
      function getFillCommentArguments(fillComments) {
        var arguments = []; // Note: There is only one arg per fillComment
        
        for (var a = 0; a < fillComments.length; a++) {
          var words = fillComments[a].split(/[ ]+/);
          arguments[a] = words[words.indexOf('@fill') + 1];
        }
        
        return arguments;
      }
    }
  }
}
