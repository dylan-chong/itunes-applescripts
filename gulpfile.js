const gulp = require('gulp');
const fs = require('fs');
const exec = require('child_process').exec;

const SCRIPT_FILE = 'src/albumize-disc-groups.js.applescript';

function log(tag, data) {
    console.log('\n\n ****** ' + tag + ' ****** \n\n', data);
}

function executeJavaScriptOsaFile(filePath, callback) {
    var scriptContents = fs.readFileSync(filePath, 'utf8');
    exec(getCommand(scriptContents), callback);

    function getCommand(scriptAsString) {
        var escapedScript = scriptAsString
            .replace(/"/g, '\\"')
            .replace(/\n/g, '" -e "');
        return 'osascript -l JavaScript -e "' + escapedScript + '"';
    }
}

function getWatchGlobs() {
    // TODO 
    return [];
}

gulp.task('default', function () {
    gulp.watch(getWatchGlobs(), ['watch']);
});

gulp.task('watch', function () {
    log('watch called');
});

gulp.task('execute-current', function () {
    // TODO
    log('execute-current called');
});
