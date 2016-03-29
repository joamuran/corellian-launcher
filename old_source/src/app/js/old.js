var fs=require('fs');
var child_process = require('child_process');
var net = require('net');


// LAUNCH WITH:  /usr/share/nwjs0.12/nw --enable-transparent-visuals --disable-gpu .
// Parse ini files: https://www.npmjs.com/package/ini
// Read theming: https://blogs.gnome.org/mclasen/2014/05/06/tweaking-a-the-gtk-theme-using-css/

// Python plugins for docky: http://wiki.go-docky.com/index.php?title=Writing_Helpers
// --> Millor plank

// https://github.com/nwjs/nw.js/issues/2817

// Paquets interessants: libmenu, inotify... fer apt-cache search per vore quins son..

function llxLaunchPad(){
   //self=this;
   this.rscfile="/home/joamuran/Dropbox/proves_webkit/llx-launchpad/llx-launchpad/src/menu.json";
   this.shown=false;
}

// Methods

llxLaunchPad.prototype.buildSearchArea = function buildSearchArea(){
   var inputsearch=$(document.createElement("input")).attr("type", "text").attr("id", "search").css("color", "#000000");
   inputsearch.keyup(
    function() {
          textsearch=$("#search").val();

          if (textsearch!="") {
            // Mostrar totes les categories..
            $(".catDiv").show();

            $(".app").hide();
            $("[id*="+textsearch+"].app").show();


          } else{
            $(".catDiv").hide();
            $(".app").show();
            $(".catDiv#cat_utils").show();
          }
         //alert($("#search").val());
      });

   $("#searchpanel").append(inputsearch);
}

llxLaunchPad.prototype.createCatIcon = function createCatIcon(cat){
   var icon=$(document.createElement("div")).addClass("app").attr("id", cat["id"]);
   $(icon).attr("catid", cat["id"]);
   var iconimage=$(document.createElement("div")).addClass("appicon").css("background", "url("+cat["icon"]+") no-repeat");
   var name=$(document.createElement("div")).addClass("applabel").html(cat["label"]).attr("launch", cat["launch"]);
   icon.append(iconimage, name);

   // TO-DO: Posar la descripció en un hover

   $(icon).bind("click", function(){
      var catid=($(icon).attr("catid"));
      $(".catDiv").hide();
      $(".catDiv#cat_"+catid).show();
   });

   return(icon);

}


llxLaunchPad.prototype.createAppIcon = function createAppIcon(app){
  var self=this;
   var icon=$(document.createElement("div")).addClass("app").attr("id", app["id"]);
   $(icon).attr("launch", app["launch"]);
   var iconimage=$(document.createElement("div")).addClass("appicon").css("background", "url("+app["icon"]+") no-repeat");
   var name=$(document.createElement("div")).addClass("applabel").html(app["label"]).attr("launch", app["launch"]);
   icon.append(iconimage, name);

   // TO-DO: Posar la descripció en un hover

   $(icon).bind("click", function(){
     //require('nw.gui').Window.get().showDevTools();
    //console.log($(icon));
     var launch=$(icon).attr("launch");
     require('nw.gui').Window.get().hide();
     self.shown=false;
     child_process.exec(launch);
	  });

   return(icon);

}


llxLaunchPad.prototype.loadApps = function loadApps(){
  var self=this;
   file=self.rscfile;
   var jsonContent=JSON.parse((fs.readFileSync(file)).toString());
   for (catindex in jsonContent["categories"]){
     console.log("Loading category: "+jsonContent["categories"][catindex]["id"]);
     console.log("Category name: "+jsonContent["categories"][catindex]["name"]);
     console.log("Category icon: "+jsonContent["categories"][catindex]["icon"]);

     // Arrange category
     var currentcat=jsonContent["categories"][catindex]["id"];
     var catdiv=$(document.createElement("div")).addClass("catDiv").attr("id", "cat_"+currentcat);
     var app=jsonContent["categories"][catindex]["apps"];

     // Create Category button
     var newcat=new Array();
     newcat["id"]=jsonContent["categories"][catindex]["id"];
     newcat["name"]=jsonContent["categories"][catindex]["name"];
     newcat["icon"]=jsonContent["categories"][catindex]["icon"];
     var catButton=self.createCatIcon(newcat);
     $("#leftpanel").append(catButton);



      // Populate Category
     for (appindex in app){
       var newicon=new Array();
       newicon["id"]=app[appindex]["id"];
       newicon["icon"]=app[appindex]["icon"];
       newicon["label"]=app[appindex]["label"]
       newicon["launch"]=app[appindex]["launch"]
       newapp=self.createAppIcon(newicon);
       catdiv.append(newapp); // Add app icon to category div/tab
     }
     $("#centralpanel").append(catdiv); // Add category to central panel
   }
   // I dins del de dalt
   /*cat="utils";
   for (app in jsonContent[cat]){
     console.log(app);
   }*/

   $(".catDiv").hide();
   $(".catDiv#cat_utils").show(); // DEFAULT CATEGORY--> Temp

   //icon=self.createRscIcon(jsonContent);
   //console.log(icon);
   //$("#centralpanel").append(icon);

}



llxLaunchPad.prototype.createListenSocket = function createListenSocket(){
   var self=this;
   var server = net.createServer(function(connection) {
       connection.on('data', function(data) {
           // data is a Buffer, so we'll .toString() it for this example
           self.shown=!self.shown;
           if (self.shown){
               require('nw.gui').Window.get().show();
               require('nw.gui').Window.get().focus();
             }
            else
               require('nw.gui').Window.get().hide();



       });
   });

   server.listen('/tmp/nodejs_bridge.sock');    // This creates a UNIX socket in the current directory named "nodejs_bridge.sock"

   process.on('exit', function() {
      // Make sure we close the server when the process exits so the file it created is removed
       server.close();
   });

   process.on('SIGINT', function() {
      // Call process.exit() explicitly on ctl-c so that we actually get that event
       process.exit();
   });
   process.stdin.resume(); // Resume stdin so that we don't just exit immediately
}


$(document)
  .keydown( // When hits esc, we'll hide menu
    function(e) {
      if (e.keyCode=='27')
      {
         launchpad.shown=false;
         require('nw.gui').Window.get().hide();
        // require('nw.gui').Window.get().close();
      }
    }
);

$(document).click(function(e){
  launchpad.shown=false;
  require('nw.gui').Window.get().hide();
});


$(document).ready(function() {
   // $("#leftpanel").resizable({ handles: 'e' });
   launchpad=new llxLaunchPad();

   launchpad.createListenSocket();

   launchpad.loadApps();
   launchpad.buildSearchArea();

   require('nw.gui').Window.get().on('blur',function (e){
     // If lose focus, let's close window
     launchpad.shown=false;
     require('nw.gui').Window.get().hide();
   });


   $("#wrapper").click(function (e){
    e.stopPropagation();
  });
});
