// **************** DEPENDENCIES **************** //

const commandLineArgs = require('command-line-args');

const gulp = require('gulp');
const watch = require('gulp-watch');
const glob = require('glob');

const files = require('./gulp-helpers/files');

const log = require('./gulp-helpers/header-log.js').log;
const helpPrinter = require('./gulp-helpers/help-printer');

const scriptBuilder = require('./gulp-helpers/script-builder');
const osa = require('./gulp-helpers/execute-osa.js');

// **************** CONSTANTS **************** //

// Command line args
const SCRIPT_COMMAND_LINE_ARG = 'script';
const OPTION_DEFINITIONS = [
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
  if (getScriptArgument()) {
    buildSelectedScript(getScriptArgument());
    return;
  }

  buildFiles(glob.sync(files.constants.FILES.SCRIPTS));

  function buildFiles(files) {
    var successes = 0;
    var fails = 0;
    for (var a = 0; a < files.length; a++) {
      if (scriptBuilder.buildScript(files[a])) successes++;
      else fails++;
    }

    log('Build finished with ' + successes + ' successes, and ' +
      fails + ' failures', 1);
  }

  function buildSelectedScript(userSelectedScript) {
    buildFiles([userSelectedScript]);
  }
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
      if (scriptName.endsWith(files.constants.BUILT_SCRIPT_EXTENSION)) {
        // User entered executable script path
        return scriptName;
      }

      return files.getBuiltScriptPathFromName(scriptName);
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

// noinspection JSUnusedLocalSymbols
function watchTask(done) {
  log('Watching for changes. Will auto execute script on change', 2);

  // noinspection JSUnresolvedFunction
  watch(files.constants.FILES.ALL_SRC).on('change', onChange);

  // Don't call done() since watch-ing

  function onChange(changedFilePath) {
    log(changedFilePath, 1);
    if (fileIsABuildableScript(changedFilePath))
      buildAndExecuteScript(changedFilePath);
    else
      buildTask();

    function buildAndExecuteScript(file) {
      var builtPath = scriptBuilder.buildScript(file);
      osa.executeJsFile(builtPath);
    }

    function fileIsABuildableScript(file) {
      var scripts = glob.sync(files.constants.FILES.SCRIPTS);
      for (var a = 0; a < scripts.length; a++) {
        if (file.endsWith(scripts[a]))
          return true;
      }
      return false;
    }
  }
}

// **************** REQUIRE SELECTED SCRIPT **************** //

createTask({
  taskName: 'require-selected-script-arg',
  taskDependencies: [],
  taskFunction: requireSelectedScriptArgTask,
  taskAliasNames: [],
  taskDescription: 'Just a helper task. Don\'t use me',
  shouldHideFromHelp: true
});

function requireSelectedScriptArgTask() {
  if (getScriptArgument()) {
    return;
  }

  var example = 'gulp whatever-the-task-was --' + SCRIPT_COMMAND_LINE_ARG +
    ' some-script-name-or-path';
  throw 'ERROR: No script name detected. Try again with something like:' +
  example;
}

function getScriptArgument() {
  if (!OPTIONS || !OPTIONS.hasOwnProperty(SCRIPT_COMMAND_LINE_ARG)) {
    return false;
  }

  return OPTIONS[SCRIPT_COMMAND_LINE_ARG];
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
  var scriptNames = files.getAllScriptNames();
  log('Scripts:', 1, scriptNames.join('\n') + '\n');
}

// TODO LATER gulp deploy into scpt format
