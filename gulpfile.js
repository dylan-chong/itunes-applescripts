const gulp = require('gulp');
const fs = require('fs');
const exec = require('child_process').exec;
const fancyLog = require('fancy-log');

const SCRIPT_FILE = 'src/albumize-disc-groups.js.applescript';

function log(tag, priority, data) {
    switch (priority) {
        case 0:
            var LINE_COUNT = 3;
            var MARK_COUNT = 6;
            var marks = Array(MARK_COUNT + 1).join('*');
            var obviousLine = marks + Array(tag.length + 1 + 2).join('-')
                + marks;
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

gulp.task('default', function () {
    gulp.watch(['./src/*.js.applescript'], ['watch']);
});

gulp.task('watch', function () {
    log('Executing script ' + SCRIPT_FILE, 0);

    executeJsOsaFile(SCRIPT_FILE, callback);

    function callback (error, stdout, stderr) {
        if (error && error.code) {
            log('Error executing script (Code ' + error.code + ')', 3);
        }
        if (stderr) {
            log('Console:', 2, stderr);
        }
        if (stdout) {
            log('Result', 2, stdout);
        }
        /*
        for (var k in error) {
        log(k, error[k]);
        }
        log('Error', error);
        log('stdout ${stdout}', stdout);
        log('stderr ${stderr}', stderr);
        */
        log('Finished executing script', 1);
    }
});

gulp.task('execute-js-osa-file', executeJsOsaFile);
function executeJsOsaFile(filePath, callback) {
    var scriptContents = fs.readFileSync(filePath, 'utf8');
    exec(getCommand(scriptContents), callback);

    function getCommand(scriptAsString) {
        var escapedScript = scriptAsString
            .replace(/"/g, '\\"')
            .replace(/\n/g, '" -e "');
        return 'osascript -l JavaScript -e "' + escapedScript + '"';
    }
}
