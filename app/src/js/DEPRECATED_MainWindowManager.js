var gui=require('nw.gui');
var exec = require('child_process').exec;     // To use wmctrl
var net=require("net");                       // used for menu button communicate


function WindowManager (){
  /* Constructor */
  var self=this;
  // Reference to Window
  this.mainWindow==gui.Window.get();
  this.mainWindowShown=false;
  
  //this.window.show();
  //this.winShown=true;
  
  // Hide from taskbar
  child = exec('wmctrl -r "LliureX Launchpad" -b toggle,skip_taskbar', function (error, stdout, stderr) {});

  // Wait for complete menu generation
  /*window.addEventListener("load", function(){
    // Loaded
  });*/
  
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
        console.log("toggle from "+self.mainWindowShown);
        self.mainWindowShown=!self.mainWindowShown;
        if (self.mainWindowShown)
        { self.mainWindow.show();
          child = exec('wmctrl -r "LliureX Launchpad" -b toggle,skip_taskbar', function (error, stdout, stderr) {});   }
        else self.mainWindow.hide();
      });
      // Add a 'close' event handler to this instance of socket
      /*sock.on('close', function(data) {
          console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
      });*/
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

};

var wm=new WindowManager ();


