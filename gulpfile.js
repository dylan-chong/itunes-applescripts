const gulp = require('gulp');
const fs = require('fs');
const exec = require('child_process').exec;

const SCRIPT_FILE = 'src/albumize-disc-groups.js.applescript';

function log(tag, data) {
    console.log('\n\n****** ' + tag + ' ******\n\n');
    if (data) console.log(data);
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
    return ['./src/*.js.applescript'];
}

gulp.task('default', function () {
    gulp.watch(getWatchGlobs(), ['watch']);
});

gulp.task('watch', function () {
    log('Executing script ' + SCRIPT_FILE);

    executeJavaScriptOsaFile(
        SCRIPT_FILE,
        (error, stdout, stderr) => {
            if (error && error.code) {
                console.log('Error executing script (Code '
                    + error.code + ')');
            }
            if (stderr) {
                console.log('\nConsole:\n' + stderr);
            }
            if (stdout) {
                console.log('\nResult:\n' + stdout);
            }
            /*
            for (var k in error) {
            log(k, error[k]);
            }
            log('Error', error);
            log('stdout ${stdout}', stdout);
            log('stderr ${stderr}', stderr);
            */
            log('Finished executing script');
        }
    );
});
