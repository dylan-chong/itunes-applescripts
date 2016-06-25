/* @fill tiny-core */

/* @fill dependencies */

(function () {
  var DEFAULT_SCRIPT_NAME = 'script';
  
  var moduleSuccessfullyDefined = 
    
  /* @fill script */
    
    ;

  var console = TinyCore.Toolbox.request('console');
  if (!moduleSuccessfullyDefined) {
    console.error('Script + "' + scriptName + '" was unable to be defined');
    return 'Script not run';
  }
  
  console.log('Script + "' + scriptName + '" was successfully defined');
  return TinyCore.Module.start(scriptName).run();
})();
