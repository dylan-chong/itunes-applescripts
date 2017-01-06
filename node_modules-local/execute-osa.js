const exec = require('child_process').exec;
const log = require('./header-log.js').log;

exports.executeJsFile = executeJsFile;

function executeJsFile(filePath, callback) {
  log('Executing script "' + filePath + '"', 0);
  exec(getCommand(), { maxBuffer: 2000 * 1024 }, effectiveCallback);

  function getCommand() {
    return 'osascript -l JavaScript "' + filePath + '"';
  }

  function effectiveCallback(error, stdout, stderr) {
    logExecuteResults(error, stdout, stderr);
    if (callback) callback(error, stdout, stderr);
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
