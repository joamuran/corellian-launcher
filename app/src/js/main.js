
$(document).ready(function() {
    
  var wm=new WindowManager ();
  var config=new Config();
  var appManager=new AppManager();
  wm.generateMenu(function(){
    // Creating Apps Menu
      console.log("00000000000000000000");
      var categories=config.getApplicationsMenu();
      console.log("111111111111111111111");
      //appManager.drawCategories(categories);
      console.log("22222222222222222222222");
      appManager.buildSearchArea();
      console.log("33333333333333333333333");
      //appManager.bindEvents();
    
    });
  
  
  
})

