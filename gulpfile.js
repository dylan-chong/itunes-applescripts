const gulp = require('gulp');
const fs = require('fs');
const exec = require('child_process').exec;

const SCRIPT_FILE = 'src/albumize-disc-groups.js.applescript';

function log(tag, priority, data) {
    switch (priority) {
        case 0:
            var lineCount = 3;
            var markCount = 6;
            var marks = Array(markCount + 1).join('*');
            var line = marks + Array(tag.length + 1 + 2).join('-') + marks;
            // + 1 because array.join creates one less copy of the string
            // than the count, and + 2 because of the spaces around the tag
            console.log(Array(lineCount + 1).join('\n' + line));
            console.log(marks + ' ' + tag + ' ' + marks);
            console.log(Array(lineCount + 1).join(line + '\n'));
            break;
        case 1:
            console.log('\n\n****** ' + tag + ' ******\n\n');
            break;
        case 2:
            console.log('\n\n** ' + tag + ' **\n\n');
            break;
        case 3:
            console.log('** ' + tag + ' **');
            break;
        default:
            console.error('Invalid priority: ' + priority);
            break;
    }
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
    log('Executing script ' + SCRIPT_FILE, 0);

    executeJavaScriptOsaFile(
        SCRIPT_FILE,
        (error, stdout, stderr) => {
            if (error && error.code) {
                log('Error executing script (Code ' + error.code + ')', 3);
            }
            if (stderr) {
                log('Console:', 2, '\t' + stderr.replace(/\n/g, '\n\t'));
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
    );
});
