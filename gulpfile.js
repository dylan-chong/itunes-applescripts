const gulp = require('gulp');
const fs = require('fs');

const SCRIPT_FILE = 'src/albumize-disc-groups.js.applescript';

function log(tag, data) {
    console.log('\n\n ****** ' + tag + ' ****** \n\n', data);
}

gulp.task('default', function () {
    var scriptContents = fs.readFileSync(SCRIPT_FILE, 'utf8');
    log('Script Contents', scriptContents);

});
