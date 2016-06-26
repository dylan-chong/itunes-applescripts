/*! TinyCore v1.0.2 (2014-05-10) | (c) 2013 Marc Mignonsin | MIT license */
!function(a){"use strict";var b=null,c=!0,d=!1,e=Object.prototype,f=e.hasOwnProperty,g=e.toString,h={version:"1.0.2",debugMode:d,Module:b,Toolbox:b,Error:b,Utils:b};Array.prototype.forEach||(Array.prototype.forEach=function(a,b){var c,d;for(c=0,d=this.length;d>c;++c)c in this&&a.call(b,this[c],c,this)}),Function.prototype.bind||(Function.prototype.bind=function(a){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b=Array.prototype.slice.call(arguments,1),c=this,d=function(){},e=function(){return c.apply(this instanceof d&&a?this:a,b.concat(Array.prototype.slice.call(arguments)))};return d.prototype=this.prototype,e.prototype=new d,e}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});var i={isClass:function(a,b){return g.call(a)==="[object "+b+"]"},isFunction:function(a){return i.isClass(a,"Function")},isObject:function(a){return i.isClass(a,"Object")},isArray:function(a){return i.isClass(a,"Array")},forIn:function(a,b){if(a&&i.isObject(a))for(var c in a)f.call(a,c)&&b(a[c],c)},extend:function(){for(var a=arguments,b=a.length,c=1,d=a[0]||{},e=function(a,b){d[b]=i.isObject(a)?i.extend(d[b],a):a};b>c;c++)i.forIn(a[c],e);return d},tryCatchDecorator:function(a,b,d){if(b.__decorated__)return b;var e=function(){try{return b.apply(a,arguments)}catch(c){h.Error.log(d+c.message)}};return e.__decorated__=c,e},createModuleObject:function(a,c){return a.apply(b,c)}};h.Utils=i;var j={},k=-1;h.Toolbox={request:function(a){var c=j[a];return c&&c.fpFactory&&c.fpFactory(++k)||b},register:function(a,b){return j[a]||!i.isFunction(b)?d:(j[a]={fpFactory:b},c)}},h.Error={log:function(b){a.console&&a.console.error&&a.console.error(b)},report:function(a){if(h.debugMode)throw new Error(a);this.log(a)}};var l={};h.Module={define:function(a,b,e){return l[a]||!i.isFunction(e)?d:(l[a]={fpCreator:e,oInstances:{},aToolsNames:b},c)},start:function(a,b){var d=this.getInstance(a);return d||(d=l[a].oInstances[a]={oInstance:this.instantiate(a)}),d.bIsStarted||(d.oInstance.onStart(b),d.bIsStarted=c),d.bIsStarted},stop:function(a,b){var e=this.getInstance(a);return e&&e.oInstance?(e.bIsStarted&&(i.isFunction(e.oInstance.onStop)&&e.oInstance.onStop(),e.bIsStarted=d),b?(i.isFunction(e.oInstance.onDestroy)&&e.oInstance.onDestroy(),delete l[a],c):!e.bIsStarted):d},instantiate:function(a){var b,c,d=l[a],e=d.aToolsNames,f=e.length,g=[];for(d||Error.report('The module "'+a+'" is not defined!');f--;)b=e[f],g.unshift(h.Toolbox.request(b));if(c=i.createModuleObject(d.fpCreator,g),h.debugMode)for(c.__tools__=c.__tools__||{},f=e.length;f--;)c.__tools__[e[f]]=g[f];else i.forIn(c,function(b,d){i.isFunction(b)&&(c[d]=i.tryCatchDecorator(c,b,'Error in module "'+a+'" executing method "'+d+'": '))});return c},getModules:function(){return l},getInstance:function(a,b){var c=l[a];return c||h.Error.report('The module "'+a+'" is not defined!'),"undefined"==typeof b&&(b=a),c.oInstances[b]}},a.TinyCore=h,a.define&&a.define.amd&&a.define("TinyCore",h),a.module&&a.module.exports&&(a.module.exports=h)}(this);

// No dependencies found


(function () {
  var DEFAULT_SCRIPT_NAME = 'script';
  
  var moduleSuccessfullyDefined = 
    
  (function () {

  // ******* Constants *******

  var PLAYLIST_NAME = 'Source'; // Make sure there are no name conflicts
  var PLAYLIST_IS_SMART = false; // Note: Currently doesn't work on smart playlists

  // *************************

  var app = Application('iTunes');
  app.includeStandardAdditions = true;
  var window = app.windows[0];
  var console = this.console;

  var playlist;

  try {
    playlist = getDefaultPlaylist();
  } catch (e) {
    // Note: An error is not always thrown if there
    // are name duplicates.
    return 'There are multiple playlists of the name \''
      + PLAYLIST_NAME + '\'';
  }

  if (!playlist)
    return 'No playlists found';

  if (playlist.tracks().length == 0)
    return 'No tracks in this playlist';

  var groups = getGroupsOfTracks(playlist.tracks());
  var albumGroups = getSortedGroups(groups);
  var shuffledDiscs = getShuffledDiscs(albumGroups);
  logAllDiscGroups(shuffledDiscs);
  // Code that makes changes:
  // reorderPlaylist(shuffledDiscs, playlist);

  return 'Done';

  // **************** Playlists ****************

  function getDefaultPlaylist() {
    return getPlaylistByNameAndIsSmart(PLAYLIST_NAME, PLAYLIST_IS_SMART);
  }

  function getPlaylistByNameAndIsSmart(name, isSmart) {
    var playlistArrays = app.sources.playlists();
    var userPlaylists = playlistArrays[0];

    for (var a = 0; a < userPlaylists.length; a++) {
      var playlist = userPlaylists[a];

      if (playlist.name() !== name) continue;
      if (playlist.smart() !== isSmart) continue;

      return playlist;
    }

    return null;
  }

  function reorderPlaylist(discGroups, playlist) {
    for (var d = 0; d < discGroups.length; d++) {
      var disc = discGroups[d];
      for (var t = 0; t < disc.length; t++) {
        disc[t].move({to: playlist});
      }
    }
  }

  // **************** Grouping and Shuffling ****************

  // Returns an array of array of tracks
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

  function getSortedGroups(discGroups) {
    return getAlbumGroups(discGroups);

    function getAlbumGroups(discGroups) {
      var albumGroups = [];

      for (var d = 0; d < discGroups.length; d++) {
        var discGroup = discGroups[d];
        var index = getIndexOfSameAlbum(discGroup);

        if (index == -1) {
          albumGroups.push([discGroup]);
          continue;
        }

        albumGroups[index].push(discGroup);
      }

      return albumGroups;

      function getIndexOfSameAlbum(discGroup) {
        for (var a = 0; a < albumGroups.length; a++) {
          // first track in the first disc of the album group
          var groupTrack = albumGroups[a][0][0];
          var discTrack = discGroup[0];

          if (discTrack.album() !== groupTrack.album()) continue;
          if (discTrack.artist() !== groupTrack.artist()) continue;

          return a;
        }

        return -1;
      }
    }

    function getArtistGroups(discGroups) {
      // TODO LATER
    }
  }

  function getShuffledDiscs(albumGroups) {
    return pairShuffle(albumGroups);

    function pairShuffle(albumGroups) {
      // TODO first disc stays at top
      var shuffled = albumGroups;

      while (shuffled.length > 1) {
        shuffled = sortAlbumGroupsByLength(shuffled);
        // logAlbumGroupLengthsAndNames(shuffled);

        var smallest = shuffled.splice(shuffled.length - 2, 2);
        var merged = simpleShuffle(smallest);
        shuffled.push(merged);
      }

      return shuffled[0];

      // From largest to smallest
      function sortAlbumGroupsByLength(albumGroups) {
        var copiedGroups = albumGroups.slice();
        var sortedGroups = [];

        while (copiedGroups.length > 0) {
          var largestGroupIndex;
          var largestGroupSize = -1;
          for (var a = 0; a < copiedGroups.length; a++) {
            if (copiedGroups[a].length > largestGroupSize) {
              largestGroupIndex = a;
              largestGroupSize = copiedGroups[a].length;
            }
          }

          // removedItems always has length 1
          var removedItems = copiedGroups.splice(largestGroupIndex, 1);
          sortedGroups.push(removedItems[0]);
        }

        return sortedGroups;
      }
    }

    function simpleShuffle(albumGroups) {
      var currentAlbumGroupIndexes = [];
      for (var a = 0; a < albumGroups.length; a++) {
        currentAlbumGroupIndexes.push(0);
      }

      var shuffled = []; // disc groups

      // Add one disc, to shuffled, from each album group
      while (true) {
        var albumsEmpty = 0;
        for (var a = 0; a < albumGroups.length; a++) {
          var indexInAlbum = currentAlbumGroupIndexes[a];

          if (indexInAlbum == -1) {
            albumsEmpty++;
            continue;
          }

          var discGroup = albumGroups[a][indexInAlbum];
          shuffled.push(discGroup);

          currentAlbumGroupIndexes[a]++;

          if (currentAlbumGroupIndexes[a] == albumGroups[a].length) {
            currentAlbumGroupIndexes[a] = -1;
            albumsEmpty++;
          }
        }

        if (albumsEmpty == albumGroups.length) break;
      }

      return shuffled;
    }

    function logAlbumGroupLengthsAndNames(albumGroups) {
      var logStr = '\n[\n';
      for (var a = 0; a < albumGroups.length; a++) {
        logStr += '\t' + albumGroups[a].length + ': ' + albumGroups[a][0][0].album() + ' ,\n';
      }
      console.log(logStr + '\n]');
    }
  }

  // **************** Debug ****************

  function logAllDiscGroups(groups, tabSpaces) {
    for (var a = 0; a < groups.length; a++) {
      logDiscGroup(groups[a], tabSpaces);
    }
  }

  function logDiscGroup(group, tabSpaces) {
    var discNum = group[0].discNumber() + '';

    while (discNum.length < 3) {
      discNum = ' ' + discNum;
    }

    var s = '';
    for (var a = 0; a < tabSpaces; a++) s += '\t';

    s += 'Disc: ' + discNum + ', ';
    s += 'Album: ' + group[0].album();
    console.log(s);
  }

  function logAlbumGroups(albumGroups) {
    for (var a = 0; a < albumGroups.length; a++) {
      console.log('Album ' + (a + 1));
      logAllDiscGroups(albumGroups[a], 1);
    }
  }

  function logTime(msg) {
    var date = new Date();
    console.log(date.toString() + ' : ' + msg);
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
