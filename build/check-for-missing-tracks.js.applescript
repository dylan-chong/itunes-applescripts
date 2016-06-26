/*! TinyCore v1.0.2 (2014-05-10) | (c) 2013 Marc Mignonsin | MIT license */
!function(a){"use strict";var b=null,c=!0,d=!1,e=Object.prototype,f=e.hasOwnProperty,g=e.toString,h={version:"1.0.2",debugMode:d,Module:b,Toolbox:b,Error:b,Utils:b};Array.prototype.forEach||(Array.prototype.forEach=function(a,b){var c,d;for(c=0,d=this.length;d>c;++c)c in this&&a.call(b,this[c],c,this)}),Function.prototype.bind||(Function.prototype.bind=function(a){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b=Array.prototype.slice.call(arguments,1),c=this,d=function(){},e=function(){return c.apply(this instanceof d&&a?this:a,b.concat(Array.prototype.slice.call(arguments)))};return d.prototype=this.prototype,e.prototype=new d,e}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});var i={isClass:function(a,b){return g.call(a)==="[object "+b+"]"},isFunction:function(a){return i.isClass(a,"Function")},isObject:function(a){return i.isClass(a,"Object")},isArray:function(a){return i.isClass(a,"Array")},forIn:function(a,b){if(a&&i.isObject(a))for(var c in a)f.call(a,c)&&b(a[c],c)},extend:function(){for(var a=arguments,b=a.length,c=1,d=a[0]||{},e=function(a,b){d[b]=i.isObject(a)?i.extend(d[b],a):a};b>c;c++)i.forIn(a[c],e);return d},tryCatchDecorator:function(a,b,d){if(b.__decorated__)return b;var e=function(){try{return b.apply(a,arguments)}catch(c){h.Error.log(d+c.message)}};return e.__decorated__=c,e},createModuleObject:function(a,c){return a.apply(b,c)}};h.Utils=i;var j={},k=-1;h.Toolbox={request:function(a){var c=j[a];return c&&c.fpFactory&&c.fpFactory(++k)||b},register:function(a,b){return j[a]||!i.isFunction(b)?d:(j[a]={fpFactory:b},c)}},h.Error={log:function(b){a.console&&a.console.error&&a.console.error(b)},report:function(a){if(h.debugMode)throw new Error(a);this.log(a)}};var l={};h.Module={define:function(a,b,e){return l[a]||!i.isFunction(e)?d:(l[a]={fpCreator:e,oInstances:{},aToolsNames:b},c)},start:function(a,b){var d=this.getInstance(a);return d||(d=l[a].oInstances[a]={oInstance:this.instantiate(a)}),d.bIsStarted||(d.oInstance.onStart(b),d.bIsStarted=c),d.bIsStarted},stop:function(a,b){var e=this.getInstance(a);return e&&e.oInstance?(e.bIsStarted&&(i.isFunction(e.oInstance.onStop)&&e.oInstance.onStop(),e.bIsStarted=d),b?(i.isFunction(e.oInstance.onDestroy)&&e.oInstance.onDestroy(),delete l[a],c):!e.bIsStarted):d},instantiate:function(a){var b,c,d=l[a],e=d.aToolsNames,f=e.length,g=[];for(d||Error.report('The module "'+a+'" is not defined!');f--;)b=e[f],g.unshift(h.Toolbox.request(b));if(c=i.createModuleObject(d.fpCreator,g),h.debugMode)for(c.__tools__=c.__tools__||{},f=e.length;f--;)c.__tools__[e[f]]=g[f];else i.forIn(c,function(b,d){i.isFunction(b)&&(c[d]=i.tryCatchDecorator(c,b,'Error in module "'+a+'" executing method "'+d+'": '))});return c},getModules:function(){return l},getInstance:function(a,b){var c=l[a];return c||h.Error.report('The module "'+a+'" is not defined!'),"undefined"==typeof b&&(b=a),c.oInstances[b]}},a.TinyCore=h,a.define&&a.define.amd&&a.define("TinyCore",h),a.module&&a.module.exports&&(a.module.exports=h)}(this);

// No dependencies found


(function () {
  var DEFAULT_SCRIPT_NAME = 'script';
  
  var moduleSuccessfullyDefined = 
    
  (function () {

  // ******* Constants *******

  var FIRST_DISC_NUMBER = 1;
  var LAST_DISC_NUMBER = 210;
  // TODO add separate ignore list for complete discs and incomplete discs

  // *************************

  var app = Application('iTunes');
  app.includeStandardAdditions = true;
  var window = app.windows[0];

  var selection = window.selection();
  var discObjects = getSortedSelection(selection);

  // Completely Missing
  var missingDiscs = getMissingDiscs(discObjects);
  this.console.log('Completely missing discs: ' + missingDiscs);

  // Partially Missing
  this.console.log('Partially missing discs: ');

  for (var a = 0; a < discObjects.length; a++) {
    var obj = getMissingTrackObjectForDiscObject(discObjects[a]);
    if (!obj) continue;

    this.console.log(missingTrackObjectToString(obj));
  }

  return 'Done';


  function getDiscObjects(first, last) {
    var numbers = [];

    for (var a = first; a <= last; a++) {
      numbers.push({
        discNumber: a, // this matches the index of the array,
        // so it's just for debugging
        tracks: [],
        trackCount: -1,
      });
    }

    return numbers;
  }

  function discObjToString(discObj) {
    var ret = 'Disc number: ' + discObj.discNumber + ',\n';
    ret += '\tTrack count: ' + discObj.trackCount + ',\n';
    ret += '\tTracks:\n';

    for (var t = 0; t < discObj.tracks.length; t++) {
      var track = discObj.tracks[t];
      var line = '\t\tTrack: ';

      line += track.trackNumber() + ' of ' + track.trackCount();
      line += ', Name: ' + track.name();

      ret += line + '\n';
    }

    return ret;
  }

  function logDiscObjects(console, discObjects) {
    for (var d = 0; d < discObjects.length; d++) {
      console.log(discObjToString(discObjects[d]));
    }
  }

  // Note: the tracks aren't necessarily added to each discObj's tracks
  // array in the correct order - it depends on the order of the selection.
  function getSortedSelection(selection) {
    var discObjects = getDiscObjects(FIRST_DISC_NUMBER, LAST_DISC_NUMBER);

    for (var s = 0; s < selection.length; s++) {
      var track = selection[s];
      var discNumber = track.discNumber();

      if (discNumber > LAST_DISC_NUMBER) continue;
      if (discNumber < FIRST_DISC_NUMBER) continue;

      var discObj = getDiscObjectForDiscNumber(discObjects, discNumber);
      if (discObj == null) continue;

      discObj.tracks.push(track);
      discObj.trackCount = track.trackCount();
    }

    return discObjects;
  }

  function getDiscObjectForDiscNumber(array, discNum) {
    for (var a = 0; a < array.length; a++) {
      if (array[a].discNumber == discNum)
        return array[a];
    }

    return null;
  }

  function getMissingDiscs(discObjects) {
    var missingDiscNumbers = [];

    for (var a = 0; a < discObjects.length; a++) {
      var discObj = discObjects[a];
      if (discObj.trackCount == -1) {
        missingDiscNumbers.push(discObj.discNumber);
        continue;
      }
    }

    return missingDiscNumbers;
  }

  function getMissingTracks(discObjects) {
    var missingTrackObjects = [];

    for (var a = 0; a < discObjects.length; a++) {
      var missingTrackObj = getMissingTrackObjectForDiscObject(discObjects);
      if (missingTrackObj) missingTrackObjects.push(missingTrackObj);
    }
  }

  function getMissingTrackObjectForDiscObject(discObj) {
    var obj = {
      discNumber: discObj.discNumber,
      idealTrackCount: discObj.trackCount,
      missingTrackNumbers: [],
      extraTrackNumbers: [],
      existingTrackNumbers: []
    };

    var tracks = discObj.tracks;
    var missing = obj.missingTrackNumbers;
    var extra = obj.extraTrackNumbers;
    var existing = obj.existingTrackNumbers;

    // Add the ideal track numbers
    for (var a = 0; a < obj.idealTrackCount; a++) {
      missing.push(a + 1);
    }

    // Remove the existing track numbers from missing
    for (var a = 0; a < tracks.length; a++) {
      var track = tracks[a];
      var trackNumber = track.trackNumber();
      var index = missing.indexOf(trackNumber);

      if (index != -1) {
        missing.splice(index, 1);
      } else {
        extra.push(trackNumber);
      }

      existing.push(trackNumber);
    }

    if (missing.length == 0 && extra.length == 0) return null;

    return obj;
  }

  function missingTrackObjectToString(obj) {
    var str = '\tDisc Number: ' + obj.discNumber;
    str += '\n\t\t' + 'Ideal Track Count: ' + obj.idealTrackCount;
    str += '\n\t\t' + 'Existing Track Numbers: ' + obj.existingTrackNumbers;
    if (obj.missingTrackNumbers.length > 0)
      str += '\n\t\t' + 'Missing Track Numbers: ' + obj.missingTrackNumbers.toString();
    if (obj.extraTrackNumbers.length > 0)
      str += '\n\t\t' + 'Extra Track Numbers: ' + obj.extraTrackNumbers;
    return str;
  }

})();

    
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
