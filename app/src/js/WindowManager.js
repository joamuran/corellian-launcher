gui=require('nw.gui');
var exec = require('child_process').exec;
var dbus = require('dbus-native');
var bus = dbus.systemBus();

/*var params = {
  toolbar: false,
  frame: false,
  transparent: false,
  resizable: false,
  show_in_taskbar: false,
  show: true};
var window = gui.Window.open('main2.html', params);*/


//window.show();
//window.focus();

// show panel when click in tray


function WindowManager (){
  this.window=gui.Window.get();
  this.window.show();
  // Hide from taskbar
  child = exec('wmctrl -r "LliureX Launchpad" -b toggle,skip_taskbar', function (error, stdout, stderr) {});
  
  
}

var wm=new WindowManager ();

