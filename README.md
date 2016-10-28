# iTunes AppleScripts #

Useful JavaScript AppleScripts I make for batch-altering iTunes track data.
Inspired by [scripts by Doug Adams](http://dougscripts.com/itunes/index.php)

If you import lots of music into your iTunes library and you want your track
data to be perfect, don't alter them by hand! Use scripts! A combination of
[scripts by Doug Adams](http://dougscripts.com/itunes/index.php) and my own
work really well. If there's a script I haven't made, don't worry, I make
scripts all the time!

Feel free to request some new scripts ideas (just create an issue).

Feel free to use and modify yourself! Just keep them free to use.<br> but **be
careful - please backup your iTunes library before using**

## How to install ##

Run:
```bash
git clone https://github.com/dylan-chong/itunes-applescripts
cd itunes-applescripts
npm install
```

## How to use ##

1. Run `gulp build` to build all of the scripts into `./build/`
2. Call `gulp -e build/<SCRIPT-NAME-HERE>` to run a specific script

### Enabling scripts ###

The scripts are all disabled in a hard-coded way. In order to get the script to
apply changes to your iTunes library, look for the line of code that `// Code
that applies the changes:`, uncomment the code below it, and run the script
again.

### Debugging with Safari and Script Editor ###

Providing the scripts have been built, you can also open a script in `./build`
with the built in `Script Editor.app`, set the language to 'JavaScript', and
use it with the Safari debugger (see the [Apple docs on
this](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-11.html)).

### A more useful way to use when developing scripts ###

Run `gulp` then edit a `./src/scripts/<SCRIPT-NAME>/<SCRIPT-NAME>.script.ts`
script file using your favourite text editor / web IDE. Gulp will watch for
changes, rebuild the changed script, **and execute it** (including when you
just write the file without making any changes).
