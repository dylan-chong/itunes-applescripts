// **************** DEPENDENCIES **************** //

const commandLineArgs = require('command-line-args');

const gulp = require('gulp');
const watch = require('gulp-watch');

const log = require('./node_modules-local/header-log.js').log;
const osa = require('./node_modules-local/execute-osa');

// **************** CONSTANTS **************** //

const SRC = 'src/*.js.applescript';

// Command line args
const EXECUTE_JS_OSA_FILE_COMMAND_LINE_NAME = 'execute-js-osa-file';
const OPTION_DEFINITIONS = [{
  name: EXECUTE_JS_OSA_FILE_COMMAND_LINE_NAME,
  alias: 'e',
  type: String
}];
const OPTIONS = commandLineArgs(OPTION_DEFINITIONS);

// **************** TASKS **************** //

gulp.task('default', function () {
  var commandLineArgFile = OPTIONS[EXECUTE_JS_OSA_FILE_COMMAND_LINE_NAME];
  if (commandLineArgFile) {
    osa.executeJsFile(commandLineArgFile);
    return;
  }

  log('Watching for changes', 2);
  watch(SRC).on('change', osa.executeJsFile);
});
