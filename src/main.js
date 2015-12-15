'use strict';
const electron = require('electron');
const app = electron.app; 
const BrowserWindow = electron.BrowserWindow;

var globalShortcut = require('global-shortcut');

let mainWindow;
let winOptions;
let mainWindowShown=true;

app.on('window-all-closed', function() {
  globalShortcut.unregister('ctrl+alt+m');
  app.quit();  
});

app.on('ready', function() {
  
  // Getting display clicked
  var electronScreen = electron.screen;
  var mousePointer=electronScreen.getCursorScreenPoint();
  var display = electronScreen.getDisplayNearestPoint(mousePointer);
  
  // Create the browser window options and window
  var winOptions={
    x: display.bounds.x+200,
    y: display.bounds.y+100,
    width: display.bounds.width-400,
    height: display.bounds.height-200,
    alwaysOnTop: true,
    skipTaskbar: true,
    frame: false,
    transparent: true
  };
  mainWindow = new BrowserWindow(winOptions);
  
  mainWindow.on("blur", function(){
    // FA coses rares... de vegades
    console.log("lose focus");
    mainWindow.hide();
    mainWindowShown=false;
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/app/main.html`);

    // Register shortcuts
    globalShortcut.register('ctrl+alt+m', function() {
        if (mainWindowShown) 
          mainWindow.hide();
        else
          {mainWindow.show();
          mainWindow.setSkipTaskbar(true);}
        mainWindowShown=!mainWindowShown;
    });
  
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object
    mainWindow = null;
  });
});
