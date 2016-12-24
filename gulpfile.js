// TODO NEXT make interfaces for Application
// **************** DEPENDENCIES **************** //

const commandLineArgs = require('command-line-args');
const fs = require('fs');

const gulp = require('gulp');
const watch = require('gulp-watch');
const glob = require('glob');
const typescript = require('typescript-compiler');

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
  ALL_SRC: DIRECTORIES.SCRIPTS + '**/*',
  SCRIPTS: DIRECTORIES.SCRIPTS + '*/*.script.ts',
  SCRIPT_DESCRIPTIONS: DIRECTORIES.SCRIPTS + '*/*.description.txt',
  BUILD_TEMPLATE: 'src/build/build-template.ts',
  GLOBAL_DEPENDENCIES: DIRECTORIES.DEPENDENCIES + '**/*.ts'
  // TODO LATER (per) SCRIPT_DEPENDENCIES
};
const BUILT_SCRIPT_EXTENSION = '.js.applescript';

// Command line args
const EXECUTE_JS_OSA_FILE_COMMAND_LINE_NAME = 'execute-js-osa-file';
const OPTION_DEFINITIONS = [{
  name: EXECUTE_JS_OSA_FILE_COMMAND_LINE_NAME,
  alias: 'e',
  type: String
}];
const OPTIONS = (function () {
  try {
    return commandLineArgs(OPTION_DEFINITIONS);
  } catch (err) {
    // Prevent crash when using IntelliJ Node debugger for commandLineArgs module
    if (err.message !== 'Unknown option: --color')
      throw err;
    return null;
  }
})();

// **************** DEFAULT **************** //

gulp.task('default', function (done) {
  var commandLineArgFile = OPTIONS[EXECUTE_JS_OSA_FILE_COMMAND_LINE_NAME];
  if (commandLineArgFile) {
    osa.executeJsFile(commandLineArgFile, done);
    return;
  }

  log('Watching for changes', 2);

  watch(FILES.ALL_SRC).on('change', function (changedFilePath) {
    log(changedFilePath, 1);
    if (fileIsABuildableScript(changedFilePath))
      buildAndExecuteScript(changedFilePath);
    else
      buildAll();

    function buildAndExecuteScript(file) {
      var builtPath = buildScript(file);
      osa.executeJsFile(builtPath);
    }

    function fileIsABuildableScript(file) {
      var scripts = glob.sync(FILES.SCRIPTS);
      for (var a = 0; a < scripts.length; a++) {
        if (file.endsWith(scripts[a]))
          return true;
      }
      return false;
    }
  });

  // Don't call done() if watch-ing
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
  log('Successfully built script "' + builtScriptPath + '"', 2); // TODO don't show success if error
  return builtScriptPath; // TODO use gulp instead, and convert fill thing to gulp style

  function getFilledTemplateString() {
    var template = {
      path: FILES.BUILD_TEMPLATE
    };

    var replacements = { // TODO make the replacements a constant at the top of the file
      'dependencies': {
        path: FILES.GLOBAL_DEPENDENCIES // TODO make the fill method take an array
      },
      'script': {
        path: scriptFileToCompile
      }
    };

    var tsString = getFilledString(template, replacements);
    var tsArgs = ['--noImplicitAny'];
    var tsOptions = null;

    var result =  typescript.compileString(tsString, tsArgs, tsOptions, onTsError);

    if (!result) {
      log('Error, compilation failed', 0);
      return null;
    }

    return result;

    function onTsError(diagnostic) {
      // Called for each compilation error
      // TODO AFTER diagnostic category
      log(diagnostic.messageText, 3);
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

// TODO LATER gulp deploy into scpt format
