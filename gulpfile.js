// **************** DEPENDENCIES **************** //

const exec = require('child_process').exec;
const commandLineArgs = require('command-line-args');

const gulp = require('gulp');
const watch = require('gulp-watch');

const fancyLog = require('fancy-log');

// **************** CONSTANTS **************** //

const SRC = 'src/*.js.applescript';

// Command line args
const EXECUTE_JS_OSA_FILE_COMMAND_LINE_NAME = 'execute-js-osa-file';
const OPTION_DEFINITIONS = [
    { name: EXECUTE_JS_OSA_FILE_COMMAND_LINE_NAME, alias: 'e', type: String }
];
const OPTIONS = commandLineArgs(OPTION_DEFINITIONS);

// **************** BASIC LOGGING  **************** //

function log(tag, priority, data) {
    switch (priority) {
        case 0:
            var LINE_COUNT = 3;
            var MARK_COUNT = 6;
            var marks = Array(MARK_COUNT + 1).join('*');
            var obviousLine = marks +
                Array(tag.length + 1 + 2).join('-') +
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
        default:
            console.error('Invalid priority: ' + priority);
            break;
    }
    if (data) console.log('\t' + data.toString().replace(/\n/g, '\n\t'));
}

// **************** TASKS **************** //

gulp.task('default', function () {
    var commandLineArgFile = OPTIONS[EXECUTE_JS_OSA_FILE_COMMAND_LINE_NAME];
    if (commandLineArgFile) {
        executeJsOsaFile(commandLineArgFile);
        return;
    }

    log('Watching for changes', 2);
    watch(SRC).on('change', onChange);
});

// **************** EXECUTING SCRIPTS  **************** //

function onChange(filePath) {
    executeJsOsaFile(filePath);
};

gulp.task('execute-js-osa-file', executeJsOsaFile);

function executeJsOsaFile(filePath, callback) {
    log('Executing script "' + filePath + '"', 0);
    exec(getCommand(), callback || logExecuteResults);

    function getCommand() {
        return 'osascript -l JavaScript "' + filePath + '"';
    }
}

function logExecuteResults(error, stdout, stderr) {
    if (error && error.code) {
        log('Error executing script (Code ' + error.code + ')', 3);
    }
    if (stderr) {
        log('Console:', 2, stderr);
    }
    if (stdout) {
        log('Result', 2, stdout);
    }

    log('Finished executing script', 1);
}
