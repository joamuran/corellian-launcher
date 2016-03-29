//$ = jQuery = require('jquery')
/*var fs=require('fs');
var child_process = require('child_process');
var net = require('net');*/
require('jquery-ui');


$(document).ready(function() {
  //wm=new WindowManager();
  config=new Config();
  //typeahead=require('typeahead');
  appManager=new AppManager();


  // Reading Apps Menu
  var categories=config.getApplicationsMenu();
  appManager.drawCategories(categories);
  appManager.buildSearchArea();


   $("#leftpanel").resizable({ handles: 'e' });
   
   
   // Event Handling
   $(".mainEntry").bind("click", function(){
    $(".SectionContainer").hide();
    var target=$(this).attr("target");
    $("#"+target+"Container").show();
    });
   
   
})
