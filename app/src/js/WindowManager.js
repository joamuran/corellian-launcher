var gui=nw; //var gui=require('nw.gui'); -> before 0.13 notation
var exec = require('child_process').exec;     // To use wmctrl
var net=require("net");                       // used for menu button communicate
//var path = require('path');
var process=require('process');


function WindowManager (){
  /* Constructor */
  var self=this;
  // Reference to Title Window
  //this.appWindow=gui.Window.get();
  this.appWindow=nw.Window.get();
  this.showAppWindow=false;
  // Hide from taskbar
  child = exec('wmctrl -r "LliureX Launchpad Title" -b toggle,skip_taskbar', function (error, stdout, stderr) {});
  //self.titleWindow.showDevTools();
}

WindowManager.prototype.hideMe=function hideMe(){
  var self=this;
  self.appWindow.hide();
  self.showAppWindow=false;
}

WindowManager.prototype.generateMenu=function generateMenu(callback){
  // Wait for complete menu generation
  var self=this;
  
  window.addEventListener("load", function(){  // Will be replaced by "MenuReady"...
    item=document.querySelector("body");
    //item.addEventListener("click", function(){
    $(item).bind("click", function(){
      console.log("clic");
      
      self.appWindow.hide();
      
      /*var x=window.screen.availWidth;
      var y=window.screen.availHeight;*/
      
      
      self.appWindow.x=window.screen.availLeft;
      self.appWindow.y=window.screen.availTop;
      self.appWindow.width=window.screen.availWidth;
      self.appWindow.height=window.screen.availHeight;
      

      // Adjust UI size to screen resolution
      // UI is designed for 1366x732, in function of this, we'll adjust scale factor.
      console.log(window.screen.availHeight/732);
      var scalefactor=window.screen.availHeight/732;
      console.log("SF:"+ scalefactor);
      if (scalefactor<0.9 || scalefactor >1.1) $('body').css('zoom', scalefactor);
      
      
      //self.appWindow.width=window.screen.availWidth-window.screen.availLeft;
      //self.appWindow.height=window.screen.availHeight-window.screen.availTop;
      
      /* TO CENTER WINDOW...
      self.appWindow.x=150;
      self.appWindow.y=150;
      self.appWindow.width=window.screen.availWidth-300;
      self.appWindow.height=window.screen.availHeight-300;*/
      
      
      console.log(window.screen.availWidth);
      console.log(window.screen.availHeight);
      /*self.appWindow.height=800;
      self.appWindow.width=1200;*/
      /*self.appWindow.on("blur", function(){
        alert("123");});*/
      
      // Hiding window when lose focus
      self.appWindow.on("blur", function(){
        self.hideMe();
      });
      
      /*self.appWindow.width=x;
      self.appWindow.height=y;
      /*self.appWindow.enterFullscreen();*/
      
      
      
      //item=document.querySelector("#title");
      $("#title").hide();
      console.log("++++++++++++++++++++++++++++++++++++++++++");
      console.log($("#title"));
      $("#main").show();
      console.log($("#main"));
      console.log("++++++++++++++++++++++++++++++++++++++++++");
      
      $(item).unbind("click");
      self.MenuListener();
      callback(); // call to callback function when finishes listening
      
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

