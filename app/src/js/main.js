

CorellianCore=function(){
  // Class constructor
  this.wm=new WindowManager ();
  this.config=new Config();
  this.appManager=new AppManager();
  this.placesManager=new PlacesManager();
  this.disksManager=new DisksManager();
}

CorellianCore.prototype.init=function init(){
  var self=this;
  
  // Creating Apps Menu
  var categories=self.config.getApplicationsMenu();
  self.appManager.drawCategories(categories);
  self.appManager.buildSearchArea();
      
  // Creating Places Menu
  var places=self.config.getPlaces();
  self.config.getRecentFiles(function(response){
      //console.log(response);
        self.placesManager.drawRecent(response);
      });
        
  self.placesManager.drawPlaces(places);
        
  // Adding Disks and partitions
  self.disksManager.getDevices(function(disklist){
    self.placesManager.drawDevices(disklist);
   });  
}

CorellianCore.prototype.bindEventHandlers=function bindEventHandlers(){
  /*$(".mainEntry").bind("mouseover", function(){*/
  $(".mainEntry").bind("click", function(){
        $(".SectionContainer").hide();
        var target=$(this).attr("target");
        console.log("Show: "+target);
        $("#"+target+"Container").trigger("cleanContainer");
        $("#"+target+"Container").show();
        console.log($("#"+target+"Container"));
    });
}

$(document).ready(function() {
  
  corellian=new CorellianCore();
  corellian.wm.generateMenu(function(){
    corellian.init();
  })
  
  corellian.bindEventHandlers();
    
  /*wm.generateMenu(function(){
      
    });*/
  
})

