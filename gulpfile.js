// TODO NEXT make interfaces for Application
// **************** DEPENDENCIES **************** //

const commandLineArgs = require('command-line-args');
const fs = require('fs');
const util = require('util');

const gulp = require('gulp');
const watch = require('gulp-watch');
const glob = require('glob');
const typescript = require('typescript-compiler');

const mkdirp = require('mkdirp');

const log = require('./node_modules-local/header-log.js').log;
const helpPrinter = require('./node_modules-local/help-printer');

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
const BUILD_FILE_COMMAND_LINE_NAME = 'build-js-osa-file';
const BUILD_AND_EXECUTE_COMMAND_LINE_NAME = 'build-and-execute-js-osa-file';
const SCRIPT_COMMAND_LINE_ARG = 'script';
const OPTION_DEFINITIONS = [
  {
    name: EXECUTE_JS_OSA_FILE_COMMAND_LINE_NAME,
    alias: 'e',
    type: String
  },
  {
    name: BUILD_FILE_COMMAND_LINE_NAME,
    alias: 'b',
    type: String
  },
  {
    name: BUILD_AND_EXECUTE_COMMAND_LINE_NAME,
    alias: 'r',
    type: String
  },
  { // For selecting a single script
    name: SCRIPT_COMMAND_LINE_ARG,
    alias: 's',
    type: String
  }
];
const OPTIONS = (function () {
  try {
    return commandLineArgs(OPTION_DEFINITIONS);
  } catch (err) {
    // Prevent crash when using IntelliJ Node debugger for commandLineArgs module
    if (err.message !== 'Unknown option: --color')
      throw err;
    log('WARNING: command-line-args doesn\'t work when running from an ' +
      'IntelliJ/WebStorm gulp build configuration', 1);
    return null;
  }
})();

// **************** CREATE TASKS **************** //

var taskObjects = [];

/**
 * Note: Does not check for duplicate task names or aliases
 */
function createTask(taskObj) {
  gulp.task(taskObj.taskName, taskObj.taskDependencies, taskObj.taskFunction);

  // Avoid having to deal with nulls
  if (!taskObj.taskAliasNames) taskObj.taskAliasNames = [];
  if (!taskObj.taskDependencies) taskObj.taskDependencies = [];

  taskObj.taskAliasNames.forEach(function (alias) {
    gulp.task(alias, [taskObj.taskName]);
  });

  if (!taskObj.shouldHideFromHelp)
    taskObjects.push(taskObj);
}

// **************** DEFAULT **************** //

createTask({
  taskName: 'default',
  taskDependencies: ['help'],
  taskFunction: defaultTask,
  taskAliasNames: [],
  taskDescription: 'Default task when running `gulp` without choosing a task'
});

function defaultTask() {
  // Do nothing
}

gulp.task('help',  helpTask);

createTask({
  taskName: 'help',
  taskDependencies: [],
  taskFunction: helpTask,
  taskAliasNames: ['h'],
  taskDescription: 'Displays this help page'
});

function helpTask() {
  helpPrinter.printHelp(taskObjects);
}

// **************** BUILDING **************** //

createTask({
  taskName: 'build',
  taskDependencies: [],
  taskFunction: buildTask,
  taskAliasNames: ['b'],
  taskDescription: 'Builds all scripts, or a single one using the ' +
  '`--script script-name` argument'
});

function buildTask() {
  if (tryDoWithSelectedScript(buildSelectedScript)) {
    return;
  }

  buildFiles(glob.sync(FILES.SCRIPTS));

  function buildFiles(files) {
    var successes = 0;
    var fails = 0;
    for (var a = 0; a < files.length; a++) {
      if (buildScript(files[a])) successes++;
      else fails++;
    }

    log('Build finished with ' + successes + ' successes, and ' +
      fails + ' failures', 1);
  }

  function buildSelectedScript(userSelectedScript) {
    buildFiles([userSelectedScript]);
  }
}

// todo move into separate file
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
    var scriptPath = getBuiltScriptPathFromName(getScriptName(scriptFileToCompile));
    makeDirectoriesIfNecessary(scriptPath);
    fs.writeFileSync(scriptPath, templateString);
    return scriptPath;

    function makeDirectoriesIfNecessary(file) {
      var directory = file.substr(0, file.lastIndexOf('/'));
      mkdirp.sync(directory);
    }
  }
}

function getScriptName(scriptFileToCompile, shouldPruneExtension) {
  var pathParts = scriptFileToCompile.split('/');
  var name = pathParts[pathParts.length - 2];
  if (shouldPruneExtension) name = name.split('.')[0];
  return name;
}

function getAllScriptNames() {
  var scriptFilePaths = glob.sync(FILES.SCRIPTS);

  return scriptFilePaths
    .map(function (path) {
      return getScriptName(path, true);
    });
}

// **************** EXECUTING **************** //

createTask({
  taskName: 'execute',
  taskDependencies: ['require-selected-script-arg'],
  taskFunction: executeTask,
  taskAliasNames: ['e'],
  taskDescription: 'Executes a single script which is chosen using the ' +
  '`--script script-name` argument'
});

function executeTask(done) {
  executeScript(OPTIONS[SCRIPT_COMMAND_LINE_ARG]);

  function executeScript(userEnteredScriptName) {
    osa.executeJsFile(getScriptPath(userEnteredScriptName), done);

    function getScriptPath(scriptName) {
      if (scriptName.endsWith(BUILT_SCRIPT_EXTENSION)) {
        // User entered executable script path
        return scriptName;
      }

      return getBuiltScriptPathFromName(scriptName);
    }
  }
}

// **************** WATCH **************** //

createTask({
  taskName: 'watch',
  taskDependencies: [],
  taskFunction: watchTask,
  taskAliasNames: ['w'],
  taskDescription: '(DANGEROUS!) Automatically rebuilds and executes the ' +
  'changed script'
});

function watchTask(done) {
  log('Watching for changes. Will auto execute script on change', 2);

  watch(FILES.ALL_SRC).on('change', onChange);

  // Don't call done() since watch-ing

  function onChange(changedFilePath) {
    log(changedFilePath, 1);
    if (fileIsABuildableScript(changedFilePath))
      buildAndExecuteScript(changedFilePath);
    else
      buildTask();

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
  }
}

// **************** OTHER TASKS **************** //

createTask({
  taskName: 'build-execute',
  taskDependencies: ['require-selected-script-arg', 'build', 'execute'],
  taskFunction: buildAndExecuteTask,
  taskAliasNames: ['be'],
  taskDescription: 'Builds and executes using the `--script script-name` argument'
});

function buildAndExecuteTask(done) {
  // Dependencies do the work
}

createTask({
  taskName: 'list-scripts',
  taskDependencies: [],
  taskFunction: listScriptsTask,
  taskAliasNames: ['list', 'ls', 'l'],
  taskDescription: 'Lists all the scripts in the src/scripts/ directory'
});

function listScriptsTask() {
  var scriptNames = getAllScriptNames();
  log('Scripts:', 1, scriptNames.join('\n') + '\n');
}

createTask({
  taskName: 'require-selected-script-arg',
  taskDependencies: [],
  taskFunction: requireSelectedScriptArgTask,
  taskAliasNames: [],
  taskDescription: 'Just a helper task. Don\'t use me',
  shouldHideFromHelp: true
});

function requireSelectedScriptArgTask() {
  if (hasScriptArgument()) {
    return;
  }

  var example = 'gulp whatever-the-task-was --' + SCRIPT_COMMAND_LINE_ARG +
    ' some-script-name-or-path';
  throw 'ERROR: No script name detected. Try again with something like:' +
  example;

  function hasScriptArgument() {
    if (!OPTIONS || !OPTIONS.hasOwnProperty(SCRIPT_COMMAND_LINE_ARG)) {
      return false;
    }

    var selectedScript = OPTIONS[SCRIPT_COMMAND_LINE_ARG];
    return !!selectedScript;
  }
}

// **************** OTHER **************** //

/**
 * Look for a script file that ends in the name
 * @param scriptName
 */
function lookForFileToBuild(scriptName) {
  var scriptFilePaths = glob.sync(FILES.SCRIPTS);

  var scriptNames = getAllScriptNames();

  var index = scriptNames.indexOf(scriptName);
  if (index == -1) throw 'ERROR: Script not found by name: ' + scriptName;

  return scriptFilePaths[index];
}

function getBuiltScriptPathFromName(scriptName) {
  return DIRECTORIES.BUILD + scriptName +
    BUILT_SCRIPT_EXTENSION;
}

// TODO LATER gulp deploy into scpt format
