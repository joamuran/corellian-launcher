xdg=require('xdg');
fs= require ('fs');
child_process= require ('child_process');
$ = jQuery = require('jquery');
require('jquery-ui');
require('./lib/typeahead.jquery.js');



/*
Interessant: http://code.tutsplus.com/tutorials/from-jquery-to-javascript-a-reference--net-23703
http://stackoverflow.com/questions/4005211/beating-jquery-addiction-which-jquery-methods-are-easily-translated-into-pure-j
*/

function AppManager (){
    this.strs = []; // Array for app search suggestions
}

AppManager.prototype.drawBreadcrumb=function drawBreadcrumb(current){
  //if (typeof(deep)=="undefined") deep=0;
  
  //console.log("***************************************");
  //console.log(current);
  var self=this;
  $("#Applications").empty();
  //current_id=$(document.createElement("div")).html("CURRENT:"+current["id"]+" - "+current["name"]).addClass("breadCrumb");
  current_id=$(document.createElement("div")).html(current["name"]).addClass("breadCrumb");
  parent=$("#"+current["id"]+"Container");
  //parent_id=$(document.createElement("div")).html("PARENT:"+$(parent).attr("parentid")+" - "+$(parent).attr("parentname")).addClass("breadCrumb").attr("target",$(parent).attr("parentid")).attr("targetname",$(parent).attr("parentname"));
  parent_id=$(document.createElement("div")).html($(parent).attr("parentname")).addClass("breadCrumb").attr("target",$(parent).attr("parentid")).attr("targetname",$(parent).attr("parentname"));
  if (typeof($(parent).attr("parentname"))!=="undefined" && $(parent).attr("parentname")!="none" ) {

	$("#Applications").append(parent_id);
  }
  $("#Applications").append(current_id);

  $(parent_id).bind("click", function(){
    // Hide all categories
    // Show parent category
    targetid=$(this).attr("target");
    targetname=$(this).attr("targetname");
    if(targetid!==undefined && targetid!=="none") {
      // getting parent properties
      //console.log($("div#"+targetid));
      parentid=$("div#"+targetid).attr("parentid");
      parentname=$("div#"+targetid).attr("parentname");

      $(".catDiv").hide();
  	  $("#"+targetid+"Container").show();

      self.drawBreadcrumb({"id":targetid, "name": targetname});
    }

  });

}

AppManager.prototype.drawCategories=function drawCategories(categories){
  // Drawing categories into categories div (Applications)

  var self=this;



  // Draw Header Breadcum
  self.drawBreadcrumb({"id":"ApplicationsRoot", "name":"Aplicacions"}, 0);

  // Div for Applications Root
  AppsRootDiv=$(document.createElement("div")).addClass("catDiv").attr("id", "ApplicationsRootContainer").attr("parentid","none").attr("parentname", "none");

  for (catindex in categories["categories"]){
    if(typeof(categories["categories"][catindex].children)==="object"){
	  
	  // Check if children is no empty
	  // Ignoring categories with no elements
	  if (categories["categories"][catindex].children.length>0) {	  
		var rootCat={"id":"ApplicationsRoot", "name":"Aplicacions", "parent":null};
		var caticon=self.createCategoryIcon(categories["categories"][catindex], rootCat, 0);
        $(AppsRootDiv).append(caticon);

		self.fillCategory(categories["categories"][catindex]["children"], categories["categories"][catindex], rootCat, 0);
	  } // If has 0 elements, we do nothing
    } else // if is not an object, it's an app
    {
      var appicon=this.createIcon(categories["categories"][catindex]);
      $(AppsRootDiv).append(appicon);
    }
    } 
  // Adding Categories main menu to Appsdiv
  $("#AppsDiv").append(AppsRootDiv);
} // end drawCategories


AppManager.prototype.fillCategory=function fillCategory(items, cat, parentCategory){
  var self=this;
  
  console.log("[FillCategory] "+cat["id"]+" with parent category id:"+parentCategory["id"]);
  // Creates a new div for category
  var newCatDiv=$(document.createElement("div")).addClass("catDiv").attr("id", cat["id"]+"Container").css("display", "none").attr("parentid", parentCategory["id"]).attr("parentname", parentCategory["name"]);
  console.log(newCatDiv);
  $("#AppsDiv").append(newCatDiv);

  for (indexitems in items){
	
	var currentItem=items[indexitems];
	
	
	// Si passem de mirar si és subcategoria sí que fa bé la resta d'icones
	if(typeof(currentItem["children"])==="object"){  // If has children, it is a category
	  if (currentItem["children"].length>0) { // Ignore categories without children
		console.log("cat is");
		console.log(cat);
		console.log("items in FillCategory:");
		console.log(items);
		

		var currentCat={"id":cat["id"], "name":cat["name"], "parent":parentCategory};
		
		var caticon=self.createCategoryIcon(currentItem, currentCat);
		newCatDiv.append(caticon)
		
		var currentItemChildrens=currentItem["children"];		

		self.fillCategory(currentItemChildrens, currentItem, currentCat);
				

	  } //if length is 0, do nothing
	} else {
	  // If items[indexitems] is not a category, it's an icon, let's draw it
	  var icon=self.createIcon(items[indexitems]);
      newCatDiv.append(icon);
	}
  }
  
  return true;

}


AppManager.prototype.createIcon=function createIcon(app){
  var self=this;
   var icon=$(document.createElement("div")).addClass("app").attr("id", app["id"]);
   $(icon).attr("launch", app["exec"]);

   var iconimage=self.renderIcon(app["icon"]); // Pot ser una imatge per defecte
   var name=$(document.createElement("div")).addClass("applabel").html(app["name"]).attr("launch", app["exec"]);
   
   var title=null;
   if (app["comment"]!="") title=$(document.createElement("span")).addClass("tooltip").html(app["comment"]);
   
   icon.append(iconimage, name, title);
   // TO-DO: Posar la descripció en un hover

   $(icon).bind("click", function(){
     var launch=$(icon).attr("launch");
     //require('nw.gui').Window.get().hide();
     //self.shown=false;
     child_process.exec(launch.replace("%u","").replace("%f", "").replace("%F","").replace("%U", ""));
    });

   return(icon);

}

AppManager.prototype.renderIcon=function renderIcon(icon){
  // DEPRECATED!
  
  // Provar la llibreria.. https://github.com/walling/node-rsvg

// Mirar a vore què passa amb els programes que estan a ofimatica, que sembla que vulguen un argument i com no se passa casquen... (revisar eixos desktops)

  var iconimage=null; // Pot ser una imatge per defecte
  if (icon.substr(icon.length-4)==".svg"){
    //var iconimagesvg=$(document.createElement("svg")).attr("xmlns", "http://www.w3.org/2000/svg").attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
    //$(iconimagesvg).attr("width", "64px").attr("height", "64px");
    iconimage=$(document.createElement("div")).addClass("appicon");
    $(iconimage).load(icon,function(){
      //$(iconimagesvg).find("svg").attr("width", "256px").attr("height", "256px");

	  // ENCARA FALLA AMB LES ICONES QUE TNO TENEN VIEWBOX...
	  // IGUAL VAL LA PENA RENDERITZAR LES ICONES ABANS... I AU...
	  // OBTINDRE-LES COM A IMATGE, I SI ES UN SVG RENDERITZAR-LO EN EL .CONFIG
      $(this).find("svg").attr("width", "64px").attr("height", "64px").attr("xmlns", "http://www.w3.org/2000/svg").attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
    });

  } else {
    //iconimage=$(document.createElement("div")).addClass("appicon").css({"background-image":"url('"+icon+"') no-repeat"});
	iconimage=$(document.createElement("img")).attr("width", "64px").attr("height", "64px").attr("src", icon);
  };




return iconimage;

}

AppManager.prototype.createCategoryIcon=function createCategoryIcon(category, parent){
   var self=this;
   
 
   console.log("11111");
   console.log(category);
   var icon=$(document.createElement("div")).addClass("app").attr("id", category["id"]);
   iconimage=self.renderIcon(category["icon"]);

   var name=$(document.createElement("div")).addClass("applabel").html(category["name"]).attr("parent", parent);
   
   icon.append(iconimage, name);
   // TO-DO: Posar la descripció en un hover

   $(icon).bind("click", function(){

  self.drawBreadcrumb({"id":category["id"], "name":category["name"]});

     $(".catDiv").hide();
     $("#"+category["id"]+"Container").show();

	  });

   return(icon);

}

AppManager.prototype.showElements = function showElements(selector){
  var self=this;
  self.strs=[];
  [].forEach.call( document.querySelectorAll(selector), function(element) {
              element.style.display = 'block';
			  //console.log($(element).attr("launch"));
			  //console.log();
			  self.strs.push(element.getAttribute("launch"));
			  
			  console.log(self.strs);
			  
            });
}

AppManager.prototype.hideElements = function hideElements(selector){
  [].forEach.call( document.querySelectorAll(selector), function(element) {
              element.style.display = 'none';
            });
}




AppManager.prototype.substringMatcher = function substringMatcher(){
	var self=this;
    return function findMatches(q, cb) {
	  var matches, substringRegex;
  
	  // an array that will be populated with substring matches
      matches = [];
  
	  // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');
  
	  // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
	  $.each(self.strs, function(i, str) {
		if (substrRegex.test(str)) {
		  matches.push(str);
		}
	  });
  
	  cb(matches);
	};
  };



AppManager.prototype.buildSearchArea = function buildSearchArea(){
  var self=this;
   var inputsearch=$("#inputSearch");
   inputsearch.keyup(
    function() {
          textsearch=$(inputsearch).val();

          if (textsearch!="") {
            // Mostrar totes les categories..
            //$(".catDiv").show();
			self.showElements('.catDiv'); // Javascript selectors instead of jquery
            
			//$(".app").hide();
			self.hideElements('.app'); 
            
            //$("[id*="+textsearch+"].app").show();
			self.showElements("[id*="+textsearch+"].app");
			
			
            
			
          } else{
            //$(".catDiv").hide();
			self.hideElements('.catDiv'); // Javascript selectors instead of jquery
			
           //$(".app").show();
		   self.showElements('.app'); // Javascript selectors instead of jquery
		   
			self.drawBreadcrumb({"id":"ApplicationsRoot", "name":"Aplicacions"}, 0);
            
			self.showElements('#ApplicationsRootContainer'); // Javascript selectors instead of jquery
			//$("#ApplicationsRoot").show();
			
          }
      });
	  
// and now, make autocomplete possible with typeahead

$('.typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 4
},
{
  name: 'apps',
  source: self.substringMatcher(),
  limit: 1
});
 
	  
	  
	  
}
