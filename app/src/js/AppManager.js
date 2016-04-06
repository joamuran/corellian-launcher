xdg=require('xdg');
fs= require ('fs');
child_process= require ('child_process');
//$ = jQuery = require('./lib/jquery-2.1.0.min.js');
$ = jQuery = require('jquery');
require('jquery-ui');
require('./lib/typeahead.jquery.js');
//require('electron').ipcRenderer;

/*
Interessant: http://code.tutsplus.com/tutorials/from-jquery-to-javascript-a-reference--net-23703
http://stackoverflow.com/questions/4005211/beating-jquery-addiction-which-jquery-methods-are-easily-translated-into-pure-j
*/

function AppManager (){
    this.strs = []; // Array for app search suggestions
    this.breadCrumbStack=[];

	// WIP HERE mainWindowContent=$("body");
}

// this.breadCrumbStack=null;

AppManager.prototype.drawBreadcrumb=function drawBreadcrumb(current){
	var self=this;
	
	var indexitem=self.breadCrumbStack.length;
	if (indexitem==0) $("#Applications").empty();
	self.breadCrumbStack.push(current);

	var bcContainer=$(document.createElement("div")).addClass("bcContainer").attr("id", "bc"+indexitem).attr("index", indexitem).attr("target", current["id"]+"Container");
		
	//var icon=$(document.createElement("div")).addClass("bcIcon").css("background-image","url("+current["icon"]+")");
	var bctext="<span class='bcNameText'>"+current["name"]+"</span>";
	//var bc_arrow=$(document.createElement("span")).addClass("bcArrow").html(">");
	if (indexitem>0) bctext="<span class='bc'>&nbsp;>&nbsp;</span>"+bctext;
	//if (indexitem>0) $(bcContainer).append(bc_arrow);
	var desc=$(document.createElement("div")).addClass("bcName").html(bctext);
	
	// Adding dots inter-icons
	//var BreadCrumbDots=$(document.createElement("div")).addClass("BreadCrumbDots");
	//$(bcContainer).append(icon).append(desc);
	$(bcContainer).append(desc);
	// if (indexitem>0) $(bcContainer).append(BreadCrumbDots);
	
	/*
	TO-DO:
	
	Fer que el height de Aplicacions > ... siga acorde amb el de Places, etc.. (la mateixa distància) -> DONE
	-> Però ara cal millorar que el quadre de cerca d'aplicacions isca be i tal...
	Al placesManager cal reduir els noms de fitxers llargs amb ...
	
	*/
	
	
	$("#Applications").append(bcContainer);
	
	$(bcContainer).bind("click", function(){
		var target=$(this).attr("target");
		var index=$(this).attr("index");
		
		$(".catDiv").hide();
		$("#"+target).show();
		
		console.log(this);
		console.log(index);
		console.log(self.breadCrumbStack.length);
		for (i=parseInt(index)+1;i<=self.breadCrumbStack.length;i++) {
			var item=$("#bc"+i);
			if(item.length>0) { // Only delete item if it has been found
				self.breadCrumbStack.pop();
				$(item).remove();
			}
			
		}
		
	});
		
}

AppManager.prototype.drawCategories=function drawCategories(categories){
  // Drawing categories into categories div (Applications)

  var self=this;



  // Draw Header Breadcum
  self.drawBreadcrumb({"id":"ApplicationsRoot", "name":"Aplicacions", "icon":"css/img/corellian-launcher.png"}, 0);

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
  
  
  var nullicon=$(document.createElement("div")).addClass("emptyIcon");
  newCatDiv.append(nullicon);
  return true;

}


AppManager.prototype.createIcon=function createIcon(app){
  var self=this;
   var icon=$(document.createElement("div")).addClass("app").attr("id", app["id"]);
   $(icon).attr("launch", app["exec"]);

   var iconimage=self.renderIcon(app["icon"]); // Pot ser una imatge per defecte
   var name=$(document.createElement("div")).addClass("applabel").html(app["name"]).attr("launch", app["exec"]);
   
   var title=null;
   //if (app["comment"]!="") title=$(document.createElement("span")).addClass("tooltip").html(app["comment"]);
   
   icon.append(iconimage, name, title);
   
   
   $(icon).on("mouseenter", function(){
		if (app["comment"]!="") {
			$("#BottomAppsDiv").stop(true,true).fadeIn();
			$("#descAppDesc").html(app["comment"]);
			$("#descAppName").html(app["name"]);
			$("#descAppIcon").css("background-image","url('file:///"+app["icon"]+"')");
		}
    })
   $(icon).on("mouseleave", function(){
			$("#BottomAppsDiv").stop(true,true).fadeOut();
			})
	
   
   
   $(icon).bind("click", function(){
     var launch=$(icon).attr("launch");
     
	 //color='rgba('+0+','+0+','+0+','+0+')';
     //$("body").css({"background-color":color});
	 
	 corellian.wm.hideMe();
	 
     //console.log(ipcRenderer.sendSync('synchronous-message', 'hide')); // prints "pong"
	 
     mainWindowShown=false;
	 
     child_process.exec(launch.replace("%u","").replace("%f", "").replace("%F","").replace("%U", ""));
	 
    });

   return(icon);

}

AppManager.prototype.renderIcon=function renderIcon(icon){
  
  
  // Provar la llibreria.. https://github.com/walling/node-rsvg

// Mirar a vore què passa amb els programes que estan a ofimatica, que sembla que vulguen un argument i com no se passa casquen... (revisar eixos desktops)

  var iconimage=null; // Pot ser una imatge per defecte
  
  if (icon.substr(icon.length-4)==".svg"){
    // Create SVG render instance.
	//var svg = new Rsvg();

	/*// When finishing reading SVG, render and save as PNG image.
	svg.on('finish', function() {  
	var img_src=svg.render({
	    format: 'png',
	    width: 128,
	    height: 128
	  }).data;
	*/
	//iconimage=$(document.createElement("img")).attr("width", "64px").attr("height", "64px").attr("src", img_src);
  	  iconimage=$(document.createElement("img")).attr("width", "64px").attr("height", "64px").attr("src", "");
	//});

	// Stream SVG file into render instance.
	//fs.createReadStream(icon).pipe(svg);

		
	/*//var iconimagesvg=$(document.createElement("svg")).attr("xmlns", "http://www.w3.org/2000/svg").attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
    //$(iconimagesvg).attr("width", "64px").attr("height", "64px");
    iconimage=$(document.createElement("div")).addClass("appicon");
    $(iconimage).load(icon,function(){
      //$(iconimagesvg).find("svg").attr("width", "256px").attr("height", "256px");

	  // ENCARA FALLA AMB LES ICONES QUE TNO TENEN VIEWBOX...
	  // IGUAL VAL LA PENA RENDERITZAR LES ICONES ABANS... I AU...
	  // OBTINDRE-LES COM A IMATGE, I SI ES UN SVG RENDERITZAR-LO EN EL .CONFIG
      $(this).find("svg").attr("width", "64px").attr("height", "64px").attr("xmlns", "http://www.w3.org/2000/svg").attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
    });*/

  } else {
    //iconimage=$(document.createElement("div")).addClass("appicon").css({"background-image":"url('"+icon+"') no-repeat"});
	//iconimage=$(document.createElement("img")).attr("width", "64px").attr("height", "64px").attr("src", icon);
	//console.log(icon);
	iconimage=$(document.createElement("img")).addClass("appicon").attr("src", "file://"+icon);
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
    
    self.drawBreadcrumb({"id":category["id"], "name":category["name"],"icon":category["icon"]});

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
			
			$("#Applications").empty();
			$("#Applications").append("<div>Search results for "+textsearch+"</div>");
			
            // If there is any text in text search, let's show all categories..
			self.showElements('.catDiv'); // Javascript selectors instead of jquery
			// And hide blank space after categories
			self.hideElements('.emptyIcon');
			
			//$(".app").hide();
			self.hideElements('.app'); 
            
            //$("[id*="+textsearch+"].app").show();
			self.showElements("[id*="+textsearch+"].app");
			
			
            
			
          } else{
            //$(".catDiv").hide();
			self.hideElements('.catDiv'); // Javascript selectors instead of jquery
			
			// Show blank space after categories
			self.showElements('.emptyIcon');
			
           //$(".app").show();
		   self.showElements('.app'); // Javascript selectors instead of jquery
		   
		    // Empty breadcrumb list
			self.breadCrumbStack=[];
			$("#Applications").empty();
			//self.drawBreadcrumb({"id":"ApplicationsRoot", "name":"Aplicacions", "icon":null}, 0);
            self.drawBreadcrumb({"id":"ApplicationsRoot", "name":"Aplicacions", "icon":"css/img/corellian-launcher.png"}, 0);
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


AppManager.prototype.bindEvents = function bindEvents(){
	$("#AppsDivContainer").on("cleanContainer", function(){
		// Clean breadcrumbs list and show applications
		$("#bc0").trigger("click");
		});
	
}
