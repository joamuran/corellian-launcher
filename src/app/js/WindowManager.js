gui=require('nw.gui');

var option = {
  key : "Ctrl+Alt+n",
  active : function() {
    alert("Active!!");
    //console.log("Global desktop keyboard shortcut: " + this.key + " active."); 
  },
  failed : function(msg) {
    // :(, fail to register the |key| or couldn't parse the |key|.
    alert(msg);
    //console.log(msg);
  }
};


function WindowManager (){
  this.window=gui.Window.get();
  
  this.shortcut = new gui.Shortcut(option);
  var self=this;

  this.window.on("blur", function(){
      //self.window.hide();
      //alert("lose focus");

  })
  // Start hidden
  //this.window.hide();

  // Debug
  this.window.showDevTools();

  // Shortcut
  // Create a shortcut with |option|.


  // Register global desktop shortcut, which can work without focus.
  gui.App.registerGlobalHotKey(self.shortcut);

console.log(self.shortcut);
// If register |shortcut| successfully and user struck "Ctrl+Shift+A", |shortcut|
// will get an "active" event.

// You can also add listener to shortcut's active and failed event.
  /*self.shortcut.on('active', function() {
    alert("123");
    console.log("Global desktop keyboard shortcut: " + this.key + " active."); 
  });

  self.shortcut.on('failed', function(msg) {
    alert("123");
    console.log(msg);
  });

// Unregister the global desktop shortcut.
 gui.App.unregisterGlobalHotKey(self.shortcut);*/
  
  
  
}



