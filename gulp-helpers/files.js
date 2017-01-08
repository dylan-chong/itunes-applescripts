const files = require('./files.js');
const glob = require('glob');

const constants = getConstants();

module.exports.constants = constants;
module.exports.getAllScriptNames = getAllScriptNames;
module.exports.getScriptName = getScriptName;
module.exports.getBuiltScriptPathFromName = getBuiltScriptPathFromName;

function getConstants() {
  var C = {};
  C.DIRECTORIES = {
    SCRIPTS: 'src/scripts/',
    DEPENDENCIES: 'src/dependencies/',
    BUILD: 'build/'
  };
  C.FILES = {
    ALL_SRC: C.DIRECTORIES.SCRIPTS + '**/*',
    SCRIPTS: C.DIRECTORIES.SCRIPTS + '*/*.script.ts',
    SCRIPT_DESCRIPTIONS: C.DIRECTORIES.SCRIPTS + '*/*.description.txt',
    BUILD_TEMPLATE: 'src/build/build-template.ts',
    GLOBAL_DEPENDENCIES: C.DIRECTORIES.DEPENDENCIES + '**/*.ts'
    // TODO LATER (per) SCRIPT_DEPENDENCIES
  };
  C.BUILT_SCRIPT_EXTENSION = '.js.applescript';
  return C;
}

function getAllScriptNames() {
  var scriptFilePaths = glob.sync(constants.FILES.SCRIPTS);

  return scriptFilePaths
    .map(function (path) {
      return getScriptName(path, true);
    });
}

function getScriptName(scriptFileToCompile, shouldPruneExtension) {
  var pathParts = scriptFileToCompile.split('/');
  var name = pathParts[pathParts.length - 2];
  if (shouldPruneExtension) name = name.split('.')[0];
  return name;
}

function getBuiltScriptPathFromName(scriptName) {
  return files.constants.DIRECTORIES.BUILD + scriptName +
    files.constants.BUILT_SCRIPT_EXTENSION;
}
