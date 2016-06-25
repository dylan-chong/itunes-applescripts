// **************** DEPENDENCIES **************** //

const commandLineArgs = require('command-line-args');

const gulp = require('gulp');
const watch = require('gulp-watch');

const log = require('./node_modules-local/header-log.js').log;
const osa = require('./node_modules-local/execute-osa.js');
const getFilledString = require('./node_modules-local/fill.js').getFilledString;

// **************** CONSTANTS **************** //

const DIRECTORIES = {
  SCRIPT_DIRECTORY: 'src/scripts/',
  DEPENDENCIES_DIRECTORY: 'src/dependencies/',
  BUILD_DIRECTORY: 'build/'
};
const FILES = {
  SCRIPT_FILES: DIRECTORIES.SCRIPT_DIRECTORY + '*/script.js.applescript',
  DESCRIPTION_FILES: DIRECTORIES.SCRIPT_DIRECTORY + '*/description.txt',
  BUILD_TEMPLATE_FILE: 'src/build/build-template.js.applescript',
  TINY_CORE_LIBRARY_FILE: 'bower_components/TinyCore.js/build/TinyCore.min.js',
};

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
  watch(FILES.SCRIPT_FILES).on('change', function (changedFilePath) {
    var built = buildScript(changedFilePath);

    // TODO AFTER run changed script
  });
});

// **************** COMPILING **************** //

function buildAll() {
  log('build-all called', 1); // TODO LATER remove
  
  // TODO LATER  build all of them
}

function buildScript(scriptFileToCompile) {
  log('build called', 1); // TODO LATER remove
  var filledTemplateString = getFilledTemplateString();
  saveTemplateString(filledTemplateString);

  function getFilledTemplateString() {
    var template = {
      path: FILES.BUILD_TEMPLATE_FILE
    };

    var replacements = {
      'tiny-core': {
        path: FILES.TINY_CORE_LIBRARY_FILE
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
      // TODO 
    }
  }

  function saveTemplateString(templateString) {
    // TODO 
  }
}
