/* @fill tiny-core */

/* @fill dependencies */

(function () {
  var DEFAULT_SCRIPT_NAME = 'script';
  
  var moduleSuccessfullyDefined = 
    
  /* @fill script */
    
    ;

  if (!moduleSuccessfullyDefined) {
    console.error('Script + "' + DEFAULT_SCRIPT_NAME + '" was unable to be defined');
    return 'Script not run';
  }

  console.log('Script + "' + DEFAULT_SCRIPT_NAME + '" was successfully defined');
  var resultObj = {testProperty: 'TEST'};
  TinyCore.Module.start(DEFAULT_SCRIPT_NAME, resultObj);
  return resultObj.result || 'Error: No result';
})();
