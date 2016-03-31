gui=require('nw.gui');

var params = {
  toolbar: false,
  frame: false,
  transparent: false,
  resizable: false,
  show_in_taskbar: false,
  show: true};
var window = gui.Window.open('main2.html', params);

//window.show();
//window.focus();

// show panel when click in tray

/*console.log("0");

function WindowManager (){
  console.log("1");
  this.window=gui.Window.get();
  console.log("2");
  console.log("3");
  this.window.setShowInTaskbar(false);
  this.window.show(true);
  console.log("4");
  
  console.log("5");
  
  this.shortcut = new gui.Shortcut(option);
  var self=this;

  this.window.on("blur", function(){
      //self.window.hide();
      //self.window.show=true;
      alert("lose focus");

  })
  // Start hidden
  //this.window.hide();    
}

var wm= new WindowManager ();


*/