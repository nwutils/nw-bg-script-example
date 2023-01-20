# BG-Script vs Node-Main in NW.js

A demo of different ways to run JS in NW.js.


## Order of operations

1. `npm install && npm start`
1. NW.js checks the `package.json`.
1. `node-main` Runs `main.js` in the node context. It logs. It finishes running.
1. `bg-script` Starts running. It logs while the next step starts. This finishes whenever.
1. `main` is used to launch `a.html` in a window. It loads, it logs. It opens Window B.
1. `b.html` launches in a new window but the same instance. It loads, it logs. It opens Window C.
1. `c.html` launches in a new window and new instance with injected JS code.
1. The `node-main` is inherrited from the `package.json` as part of the window options for the new instance that Window C is using.
1. `main.js` runs. It logs. It finishes running.
1. `c.html` launches in a new window
1. All CSS in Window C finishes being parsed but the DOM has not been parsed yet.
1. A node process is spawned to run `start.js`, whent it logs is dependendent on system resources and may occur before or after Window C or `end.js` logs.
1. Window C's DOM finishes loading.
1. A node process is spawned to run `end.js`, whent it logs is dependendent on system resources and may occur before or after Window C or `start.js` logs.
1. Finally the inlined script block in Window C runs and it logs.
1. Windows can now be closed

**The log file looks like this:**

```
 MAIN: 2023-01-20T17:37:10.185Z
   BG: 2023-01-20T17:37:10.229Z
    A: 2023-01-20T17:37:10.360Z
    B: 2023-01-20T17:37:10.449Z
 MAIN: 2023-01-20T17:37:10.792Z
START: 2023-01-20T17:37:10.819Z
    C: 2023-01-20T17:37:10.820Z
  END: 2023-01-20T17:37:10.822Z
```


## Distinctions

1. `node-main` will be inherrited on the `nw.Window.open(url, options)` options object unless overwritten. `bg-script` is not a window subfield option, so it is not inherrited. All other window subfields (`min_width`, `frameless`, etc) are also inherrited from the parent window.
1. `node-main` is good for things that need to *be finished* by the time the UI starts loading (like a local web server).
1. `bg-script` is good for things that need to *start* prior to the UI loading, but don't necesarrily need to be finished by the time the UI loads (background processes).
1. Because `node-main` is inherrited, if you are using it to spawn a web-server, and don't want to spawn mulitple servers while creating new window instances, you should either avoid creating a new instance, or override the `node-main` option when you do.
1. `inject_js_start` will run a JS file after a window loads and the CSSOM is produced, but before the DOM is done being parsed.
1. `inject_js_end` will run a JS file after a window loads and the DOM is parsed.
1. **Very importantly** the injected start/end scripts run outside of the main control flow of the window and seperate from each other. Which means, their order of operations is not reliable in relation to each other. The only certainty you have is that they will not occur prior to their prerequiste of CSSOM loading (for `inject_js_start`) or DOM loading (for `inject_js_end`). But the End script can very possible run and finish before the Start script has begun running. The code in the window, the start, and the end scripts can all run in any order, or simultaneously. Because of this, it is not recommended to inject both start and end code for the same window.
