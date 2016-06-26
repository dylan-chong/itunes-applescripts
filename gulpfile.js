// **************** DEPENDENCIES **************** //

const commandLineArgs = require('command-line-args');
const fs = require('fs');

const gulp = require('gulp');
const watch = require('gulp-watch');
const glob = require('glob');

const mkdirp = require('mkdirp');

const log = require('./node_modules-local/header-log.js').log;
const osa = require('./node_modules-local/execute-osa.js');
const getFilledString = require('./node_modules-local/fill.js').getFilledString;

// **************** CONSTANTS **************** //

const DIRECTORIES = {
  SCRIPTS: 'src/scripts/',
  DEPENDENCIES: 'src/dependencies/',
  BUILD: 'build/'
};
const FILES = {
  SCRIPTS: DIRECTORIES.SCRIPTS + '*/script.js',
  SCRIPT_DESCRIPTIONS: DIRECTORIES.SCRIPTS + '*/description.txt',
  BUILD_TEMPLATE: 'src/build/build-template.js',
  TINY_CORE_LIBRARY: 'bower_components/TinyCore.js/build/TinyCore.min.js',
  DEPENDENCIES: DIRECTORIES.DEPENDENCIES + '*.js'
};
const BUILT_SCRIPT_EXTENSION = '.js.applescript';

// Command line args
const EXECUTE_JS_OSA_FILE_COMMAND_LINE_NAME = 'execute-js-osa-file';
const OPTION_DEFINITIONS = [{
  name: EXECUTE_JS_OSA_FILE_COMMAND_LINE_NAME,
  alias: 'e',
  type: String
}];
const OPTIONS = commandLineArgs(OPTION_DEFINITIONS);

// **************** DEFAULT **************** //

gulp.task('default', function () {
  var commandLineArgFile = OPTIONS[EXECUTE_JS_OSA_FILE_COMMAND_LINE_NAME];
  if (commandLineArgFile) {
    osa.executeJsFile(commandLineArgFile);
    return;
  }

  log('Watching for changes', 2);

  watch(FILES.SCRIPTS).on('change', function (changedFilePath) {
    var builtPath = buildScript(changedFilePath);
    osa.executeJsFile(builtPath);
  });
});

// **************** BUILDING **************** //

gulp.task('build', buildAll);

function buildAll() {
  var files = glob.sync(FILES.SCRIPTS);
  for (var a = 0; a < files.length; a++) {
    buildScript(files[a]);
  }
}

function buildScript(scriptFileToCompile) {
  var filledTemplateString = getFilledTemplateString();
  var builtScriptPath = saveTemplateString(scriptFileToCompile, filledTemplateString);
  log('Successfully built script "' + builtScriptPath + '"', 3);
  return builtScriptPath;

  function getFilledTemplateString() {
    var template = {
      path: FILES.BUILD_TEMPLATE
    };

    var replacements = {
      'tiny-core': {
        path: FILES.TINY_CORE_LIBRARY
      },
      'dependencies': {
        contents: getDependencyString()
      },
      'script': {
        path: scriptFileToCompile
      }
    };

    return getFilledString(template, replacements);

    function getDependencyString() {
      // TODO LATER remove
      return '// Some dependencies';
    }
  }

  function saveTemplateString(scriptFileToCompile, templateString) {
    var scriptPath = DIRECTORIES.BUILD + getScriptName(scriptFileToCompile) +
      BUILT_SCRIPT_EXTENSION;
    makeDirectoriesIfNecessary(scriptPath);
    fs.writeFileSync(scriptPath, templateString);
    return scriptPath;

    function getScriptName(scriptFileToCompile) {
      var pathParts = scriptFileToCompile.split('/');
      return pathParts[pathParts.length - 2];
    }

    function makeDirectoriesIfNecessary(file) {
      var directory = file.substr(0, file.lastIndexOf('/'));
      mkdirp.sync(directory);
    }
  }
}
