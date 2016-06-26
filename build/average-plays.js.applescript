/*! TinyCore v1.0.2 (2014-05-10) | (c) 2013 Marc Mignonsin | MIT license */
!function(a){"use strict";var b=null,c=!0,d=!1,e=Object.prototype,f=e.hasOwnProperty,g=e.toString,h={version:"1.0.2",debugMode:d,Module:b,Toolbox:b,Error:b,Utils:b};Array.prototype.forEach||(Array.prototype.forEach=function(a,b){var c,d;for(c=0,d=this.length;d>c;++c)c in this&&a.call(b,this[c],c,this)}),Function.prototype.bind||(Function.prototype.bind=function(a){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b=Array.prototype.slice.call(arguments,1),c=this,d=function(){},e=function(){return c.apply(this instanceof d&&a?this:a,b.concat(Array.prototype.slice.call(arguments)))};return d.prototype=this.prototype,e.prototype=new d,e}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});var i={isClass:function(a,b){return g.call(a)==="[object "+b+"]"},isFunction:function(a){return i.isClass(a,"Function")},isObject:function(a){return i.isClass(a,"Object")},isArray:function(a){return i.isClass(a,"Array")},forIn:function(a,b){if(a&&i.isObject(a))for(var c in a)f.call(a,c)&&b(a[c],c)},extend:function(){for(var a=arguments,b=a.length,c=1,d=a[0]||{},e=function(a,b){d[b]=i.isObject(a)?i.extend(d[b],a):a};b>c;c++)i.forIn(a[c],e);return d},tryCatchDecorator:function(a,b,d){if(b.__decorated__)return b;var e=function(){try{return b.apply(a,arguments)}catch(c){h.Error.log(d+c.message)}};return e.__decorated__=c,e},createModuleObject:function(a,c){return a.apply(b,c)}};h.Utils=i;var j={},k=-1;h.Toolbox={request:function(a){var c=j[a];return c&&c.fpFactory&&c.fpFactory(++k)||b},register:function(a,b){return j[a]||!i.isFunction(b)?d:(j[a]={fpFactory:b},c)}},h.Error={log:function(b){a.console&&a.console.error&&a.console.error(b)},report:function(a){if(h.debugMode)throw new Error(a);this.log(a)}};var l={};h.Module={define:function(a,b,e){return l[a]||!i.isFunction(e)?d:(l[a]={fpCreator:e,oInstances:{},aToolsNames:b},c)},start:function(a,b){var d=this.getInstance(a);return d||(d=l[a].oInstances[a]={oInstance:this.instantiate(a)}),d.bIsStarted||(d.oInstance.onStart(b),d.bIsStarted=c),d.bIsStarted},stop:function(a,b){var e=this.getInstance(a);return e&&e.oInstance?(e.bIsStarted&&(i.isFunction(e.oInstance.onStop)&&e.oInstance.onStop(),e.bIsStarted=d),b?(i.isFunction(e.oInstance.onDestroy)&&e.oInstance.onDestroy(),delete l[a],c):!e.bIsStarted):d},instantiate:function(a){var b,c,d=l[a],e=d.aToolsNames,f=e.length,g=[];for(d||Error.report('The module "'+a+'" is not defined!');f--;)b=e[f],g.unshift(h.Toolbox.request(b));if(c=i.createModuleObject(d.fpCreator,g),h.debugMode)for(c.__tools__=c.__tools__||{},f=e.length;f--;)c.__tools__[e[f]]=g[f];else i.forIn(c,function(b,d){i.isFunction(b)&&(c[d]=i.tryCatchDecorator(c,b,'Error in module "'+a+'" executing method "'+d+'": '))});return c},getModules:function(){return l},getInstance:function(a,b){var c=l[a];return c||h.Error.report('The module "'+a+'" is not defined!'),"undefined"==typeof b&&(b=a),c.oInstances[b]}},a.TinyCore=h,a.define&&a.define.amd&&a.define("TinyCore",h),a.module&&a.module.exports&&(a.module.exports=h)}(this);

// No dependencies found


(function () {
  var DEFAULT_SCRIPT_NAME = 'script';
  
  var moduleSuccessfullyDefined = 
    
  (function () {
  var app = Application('iTunes');
  app.includeStandardAdditions = true;
  var window = app.windows[0];

  var selection = window.selection();

  var groups = getGroupsOfTracks(selection);

  for (var g = 0; g < groups.length; g++) {
    var group = groups[g];

    var minimumPlays = getMinimumPlays(group);
    if (minimumPlays == 0) continue;

    var averagePlays = getAveragePlays(group);
    var lastPlayedDate = getLastPlayedDate(group);

    for (var t = 0; t < group.length; t++) {
      var track = group[t];

      // Code that applies the changes:
      // track.playedCount.set(averagePlays);
      // track.playedDate.set(lastPlayedDate);

      logTrackDetails(averagePlays, lastPlayedDate,
        track.name(), this.console);
    }

    this.console.log('\n')
  }

  return 'Done';

  // TODO externalise the below method?
  function getGroupsOfTracks(originalTracksArray) {
    if (originalTracksArray == null || originalTracksArray.length == 0)
      return null;

    var tracks = originalTracksArray.slice();
    var groups = [];
    while (true) {
      var group = [];
      group.push(tracks[0]);
      tracks = tracks.slice(1);

      while (true) {
        if (!tracks[0]) break;
        if (tracks[0].album() != group[0].album())
          break;
        if (tracks[0].artist() != group[0].artist())
          break;
        if (tracks[0].discNumber() != group[0].discNumber())
          break;
        group.push(tracks[0]);
        tracks = tracks.slice(1);
      }

      groups.push(group);
      if (!tracks[0]) break;
    }

    return groups;
  }

  function getAveragePlays(tracks) {
    var totalPlays = 0;

    for (var t = 0; t < tracks.length; t++) {
      var track = tracks[t];
      totalPlays += track.playedCount();
    }

    var average = totalPlays / tracks.length;
    average = Math.round(average);
    return average;
  }

  function getLastPlayedDate(tracks) {
    return tracks[0].playedDate();
  }

  function getMinimumPlays(tracks) {
    var min;

    for (var t = 0; t < tracks.length; t++) {
      var track = tracks[t];
      var c = track.playedCount();

      if (!min || c < min) min = c;
    }

    return min;
  }

  function logGroupsOfTracks(groups, console) {
    for (var g = 0; g < groups.length; g++) {
      logTracks(groups[g], this.console);
    }
  }

  // For debugging
  function logTracks(tracks, console) {
    for (var t = 0; t < tracks.length; t++) {
      var track = tracks[t];
      logTrack(track, console);
    }
  }

  function logTrack(track, console) {
    logTrackDetails(track.playedCount(),
      track.playedDate(), track.name(),
      console);
  }

  function logTrackDetails(playCount, playedDate, name, console) {
    var log = 'Play Count: ' + playCount;
    log += ', Last Played: ' + playedDate;
    log += ',\n\t\t\tName: ' + name + '\n';
    console.log(log);
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
