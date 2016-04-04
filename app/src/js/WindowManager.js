var gui=require('nw.gui');
var exec = require('child_process').exec;     // To use wmctrl
var net=require("net");                       // used for menu button communicate
//var path = require('path');
var process=require('process');



function WindowManager (){
  /* Constructor */
  var self=this;
  // Reference to Title Window
  this.appWindow=gui.Window.get();
  this.showAppWindow=false;
  // Hide from taskbar
  child = exec('wmctrl -r "LliureX Launchpad Title" -b toggle,skip_taskbar', function (error, stdout, stderr) {});
  //self.titleWindow.showDevTools();
  
  // Wait for complete menu generation
  window.addEventListener("load", function(){  // Will be replaced by "MenuReady"...
    item=document.querySelector("body");
    item.addEventListener("click", function(){
      console.log("clic");
      self.appWindow.enterFullscreen();
      self.appWindow.hide();
      //item=document.querySelector("#title");
      $("#title").hide();
      $("#main").show();
      
      self.MenuListener();
      
      //self.titleWindow.hide();
      //self.createMainWindow();
      
      });
    });
}

WindowManager.prototype.MenuListener=function MenuListener(){
  var self=this;
  var HOST = '127.0.0.1';
  var PORT = 6969;  
  net.createServer(function(sock) {
      // We have a connection - a socket object is assigned to the connection automatically
      //console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
      // Add a 'data' event handler to this instance of socket
      sock.on('data', function(data) {
        console.log("toggle from "+self.showAppWindow);
        self.showAppWindow=!self.showAppWindow;
        if (self.showAppWindow)
        { self.appWindow.show();
          child = exec('wmctrl -r "LliureX Launchpad" -b toggle,skip_taskbar', function (error, stdout, stderr) {});   }
        else self.appWindow.hide();
      });
      // Add a 'close' event handler to this instance of socket
      /*sock.on('close', function(data) {
          console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
      });*/
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

};


/*TitleWindowManager.prototype.createMainWindow=function (){
  var self=this;
  var mainWindowLocation="file://"+process.cwd()+"/src/main.html";
  // Millor modificar les propietats de la finestra actual i xim pum...
  var winProperties={
    "show": true,
    "title": "LliureX Launchpad",
    "width": 1024,
    "height": 768,
    "frame":false,
    "visible_on_all_workspaces":true,
    "transparent":true,
    "inject_js_end":"src/js/MainWindowManager.js"
    };
   nw.Window.open(mainWindowLocation, winProperties, function(new_win) {
    // Transfer control no new window and close current
    self.titleWindow.close();    
  });
  
}*/

