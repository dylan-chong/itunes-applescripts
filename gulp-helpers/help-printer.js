const wrap = require('wordwrap');
const Table = require('cli-table');
const log = require('./header-log.js').log;

module.exports.printHelp = printHelp;

function printHelp(taskObjects) {
  var sortedTaskObjects = taskObjects.slice(0, taskObjects.length);
  sortedTaskObjects.sort(compareTaskObjects);

  var table = new Table({
    head: [
      // Table column headers
      'Task', 'Aliases', 'Task Dependencies', 'Description'
    ]
  });

  const COL_WIDTH = 25;
  var doWrap = wrap(COL_WIDTH);

  sortedTaskObjects.forEach(function (taskObj) {
    table.push([
      getTaskName(taskObj),
      taskObj.taskAliasNames.join(',\n'),
      taskObj.taskDependencies.join(',\n'),
      doWrap(taskObj.taskDescription) || ''
    ]);

    function getTaskName(taskObj) {
      if (taskObj.taskName === 'default') return '<default>';
      return taskObj.taskName;
    }
  });

  log('These are the tasks you can run', 1, table.toString() + '\n');

  function compareTaskObjects(taskObjA, taskObjB) {
    // Make default the first task in the list
    if (taskObjA.taskName === 'default') return -1;
    if (taskObjB.taskName === 'default') return 1;

    if (taskObjA.taskName < taskObjB.taskName) return -1;
    if (taskObjA.taskName > taskObjB.taskName) return 1;
    throw 'What?';
  }
}
