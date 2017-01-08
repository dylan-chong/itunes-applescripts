const fs = require('fs');
const mkdirp = require('mkdirp');
const glob = require('glob');

const typescript = require('typescript-compiler');

const getFilledString = require('./fill.js').getFilledString;
const log = require('./header-log.js').log;
const files = require('./files.js');

module.exports.buildScript = buildScript;

function buildScript(scriptFileToCompile) {
  if (!fs.existsSync(scriptFileToCompile)) {
    scriptFileToCompile = lookForFileToBuild(scriptFileToCompile);
  }

  log('Building script "' + scriptFileToCompile + '"', 0);
  var filledTemplateString = getFilledTemplateString();
  if (!filledTemplateString) {
    log('', 4);
    return false;
  }

  var builtScriptPath = saveTemplateString(scriptFileToCompile, filledTemplateString);
  log('Built script saved to "' + builtScriptPath + '"', 2);
  return builtScriptPath; // TODO use gulp instead, and convert fill thing to gulp style

  function getFilledTemplateString() {
    var template = {
      path: files.constants.FILES.BUILD_TEMPLATE
    };

    var replacements = { // TODO make the replacements a constant at the top of the file
      'dependencies': {
        path: files.constants.FILES.GLOBAL_DEPENDENCIES // TODO make the fill method take an array
      },
      'script': {
        path: scriptFileToCompile
      }
    };

    var tsString = getFilledString(template, replacements);
    var tsArgs = ['--noImplicitAny'];
    var tsOptions = null;

    var hasHadTsError = false;
    var result = typescript.compileString(tsString, tsArgs, tsOptions, onTsError);

    if (!result) {
      log('Error, compilation failed', 0);
      return null;
    }

    return result;

    /**
     * Called for each compilation error
     */
    function onTsError(diagnostic) {
      if (!hasHadTsError) {
        hasHadTsError = true;
        log("File contents: ", 3, prefixLinesWithLineNumbers(diagnostic.file.text));
      }
      // TODO AFTER diagnostic category
      log("Typescript Message: ", 3, diagnostic.formattedMessage);

      function prefixLinesWithLineNumbers(text) {
        var prefixedText = '';
        var lines = text.split('\n');
        for (var l = 0; l < lines.length; l++) {
          prefixedText += (l + 1) + '\t' + lines[l] + '\n';
        }
        return prefixedText;
      }
    }
  }

  function saveTemplateString(scriptFileToCompile, templateString) {
    var scriptName = files.getScriptName(scriptFileToCompile);
    var scriptPath = files.getBuiltScriptPathFromName(scriptName);

    makeDirectoriesIfNecessary(scriptPath);
    fs.writeFileSync(scriptPath, templateString);
    return scriptPath;

    function makeDirectoriesIfNecessary(file) {
      var directory = file.substr(0, file.lastIndexOf('/'));
      mkdirp.sync(directory);
    }
  }

  /**
   * Look for a script file that ends in the name
   * @param scriptName
   */
  function lookForFileToBuild(scriptName) {
    var scriptFilePaths = glob.sync(files.constants.FILES.SCRIPTS);

    var scriptNames = files.getAllScriptNames();

    var index = scriptNames.indexOf(scriptName);
    if (index == -1) throw 'ERROR: Script not found by name: ' + scriptName;

    return scriptFilePaths[index];
  }
}

