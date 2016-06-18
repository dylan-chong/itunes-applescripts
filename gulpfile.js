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

gulp.task('default', function () {
    executeJavaScriptOsaFile(
        SCRIPT_FILE,
        (error, stdout, stderr) => {
            log('Error', error);
            log('stdout', stdout);
            log('stderr', stderr);
        }
    );
});
