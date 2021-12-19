/* @fill node_dependencies */

/* @fill dependencies */

/* @fill script */

var SCRIPT_OPTIONS: ScriptOptions = /* @fill scriptOptions */;

(function (): string {
  'use strict';
  var script: Script = createScript();
  return script.run(SCRIPT_OPTIONS) || 'Error: Script not successfully run';
})();
