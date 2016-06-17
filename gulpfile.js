const gulp = require('gulp');
const fs = require('fs');
const exec = require('child_process').exec;

const SCRIPT_FILE = 'src/albumize-disc-groups.js.applescript';

function log(tag, data) {
    console.log('\n\n ****** ' + tag + ' ****** \n\n', data);
}

gulp.task('default', function () {
    var scriptContents = fs.readFileSync(SCRIPT_FILE, 'utf8');
    // log('Script Contents', scriptContents);

    var TEST_BASH_COMMAND = 'osascript -l JavaScript -e "\'hi\'"';
    exec(TEST_BASH_COMMAND, (error, stdout, stderr) => {
        log('Error', error);
        log('stdout', stdout);
        log('stderr', stderr);
    });
});
