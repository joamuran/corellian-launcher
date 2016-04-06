var xdg=require('xdg');
var fs= require ('fs');
var child_process= require ('child_process');
var diff = require('deep-diff').diff;
var $ = jQuery = require('jquery');
require('jquery-ui');
//require('electron').ipcRenderer;




function PlacesManager(){
    this.devices=null;
}


PlacesManager.prototype.renderIcon=function renderIcon(icon){
  // Emplenar en cas de que trobem manera de renderitzar les icones al vol...
  
  	iconimage=$(document.createElement("img")).addClass("appicon").attr("src", "css/icons/"+icon);
  
	return iconimage;

}




PlacesManager.prototype.createPlaceIcon=function createPlaceIcon(item){
   var self=this;

   var icon=$(document.createElement("div")).addClass("app").attr("id", item["id"]);
   $(icon).attr("target", item["url"]);
   iconimage=self.renderIcon(item["icon"]);
   var name=$(document.createElement("div")).addClass("applabel").html(item["name"]);
   
   icon.append(iconimage, name);
   
   $(icon).bind("click", function(){
		corellian.wm.hideMe();
		var target=$(icon).attr("target");
		child_process.exec("xdg-open "+target);

	  });

   return(icon);   
   
}


PlacesManager.prototype.createDeviceIcon=function createDeviceIcon(item){
   var self=this;

   var icon=$(document.createElement("div")).addClass("app").attr("id", item["IdUuid"]);
   
   
   /// ÑAPA - WIP - Construir açò per usuari i mirar si te algun lloc predeterminat on muntar-se i tal...
   
   $(icon).attr("target", "/media/joamuran/"+item["IdUuid"]);
   $(icon).attr("source", item["DeviceFile"]);

	// Setting image   
   if (item["IdType"]==="vfat") icontypeimg="hd_usb.png";
	else icontypeimg="hd.png";
   iconimage=self.renderIcon(icontypeimg);
   
   // Checking if device is mounted or not
   if (!item["DeviceIsMounted"]) {
	$(iconimage).css("opacity","0.5"); // Setting transparency
	$(icon).attr("mounted","false");
	} else{
	 $(icon).attr("mounted","true");
	 // Listen for unmount right click if is mounted
	 $(icon).bind("contextmenu", function(e){
		var option=$(document.createElement("div")).html("umount").addClass("removemedia").css({"left":e.pageX, "top": e.pageY}).attr("source",item["DeviceFile"]);
		$(option).bind("mouseout",function(){$(".removemedia").remove();});
		$(option).bind("click",function(){
			var source=$(option).attr("source");
			ret=child_process.exec("udisksctl unmount -b "+source);
			});
		$("#Devices").append(option);
	   })
	}
	
   
   var name=$(document.createElement("div")).addClass("applabel").html(item["IdUuid"]);
   if (item["IdLabel"]!="") $(name).html(item["IdLabel"]);
   else $(name).html("Disc de "+(item["DeviceSize"]/(1073741824)).toFixed(1)+" Gb ("+item["DeviceFile"]+")");
   
   
   icon.append(iconimage, name);
   
   
   $(icon).bind("click", function(){
	
	
		var target=$(icon).attr("target");
        var source=$(icon).attr("source");
		var mounted=$(icon).attr("mounted");
		if (mounted==="true") {
			child_process.exec("xdg-open "+target);
			
		} else {
            //alert("mount "+source+" "+target);
			ret=child_process.exec("udisksctl mount -b "+source, function(error, stdout, stderr){
			var ret=stdout.split(" ");
			var mountpoint=(ret[ret.length-1]).trim().slice(0, -1);
			child_process.exec("xdg-open "+mountpoint);
				
			});
			//console.log(ret);
			
        }
		

	  });
	
   return(icon);   
   
}


PlacesManager.prototype.getMimetypeIcon=function getMimetypeIcon(mime){
	// ÑAPA
	
	if (mime==="image/svg+xml") return "mimetypes/svg.png";
	else if (mime==="image/png") return "mimetypes/png.png";
	else if (mime==="image/bmp") return "mimetypes/bmp.png";
	else if (mime==="application/vnd.oasis.opendocument.text") return "mimetypes/odt.png";
	else return ("mimetypes/unknown.png");
	
	// Solventing ÑAPA
	// En /usr/share/icons/Numix/256x256/mimetypes estan els fitxers corresponents als mimetypes
	// per exemple, per a image/bmp tenim image-bmp.svg,
	// Caldria saber la ruta del tema i renderitzar-lo al vol, o bé fer com en les aplicacions
	// i crear-los en "chache"
}



PlacesManager.prototype.createRecentIcon=function createRecentIcon(item){
   var self=this;

   var path=item["href"].split("/");
   var filename=path[path.length-1];
   var mimeicon=self.getMimetypeIcon(item["mimetype"]);
   
   var icon=$(document.createElement("div")).addClass("app");
   
   $(icon).attr("target", item["href"]);
   
   var iconimage=self.renderIcon(mimeicon);
   
   
   
   
   var reducedText=filename;
   if (reducedText.length>11) reducedText=reducedText.substring(0,11)+"...";	
   
   var name=$(document.createElement("div")).addClass("applabel").html(reducedText);
   
   icon.append(iconimage, name);
   
   $(icon).bind("click", function(){
	
		var target=$(icon).attr("target");
		//alert(target); --> Caldrà comprovar quan creem la llista que els fitxers existixen...
		child_process.exec("xdg-open "+target);

	  });

   return(icon);

   
}

// this.breadCrumbStack=null;

PlacesManager.prototype.drawPlaces=function drawPlaces(places){
	var self=this;
	for (i=0; i<places.length;i++) {
		icon=self.createPlaceIcon(places[i]);
		$("#Places").append(icon);
				
		/*var item=$(document.createElement("div")).css({"color":"#ffffff", "font-size":"2em"}).html(places[i]["name"]).attr("target", places[i]["url"]);
		$("#PlacesDivContainer").append(item);
		$(item).bind("click",function(){
			place=$(this).attr("target");
			child_process.exec("xdg-open "+place);
			});*/
	}
	
}




PlacesManager.prototype.drawRecent=function drawRecent(recent){
	var self=this;
	 
	for (i=0; i<recent.length;i++) {
		icon=self.createRecentIcon(recent[i]);
		$("#Files").append(icon);
	}
	
}

PlacesManager.prototype.readfstab=function readfstab(callback){
	var fstab=[];
	var inputFile="/etc/fstab";
	var fs = require('fs'),
     readline = require('readline'),
     instream = fs.createReadStream(inputFile),
     outstream = new (require('stream'))(),
     rl = readline.createInterface(instream, outstream);
     
    rl.on('line', function (line) {
        if(line.substring(0,4)=="UUID"){
			fstab.push(line.substring(5, 41));
        }
        
    });
    
    rl.on('close', function (line) {
        //console.log(line);
		callback(fstab);
        //console.log('done reading file.');
    });
}

PlacesManager.prototype.drawDevices=function drawDevices(devicelist){
	var self=this;
    var devdiff=diff(devicelist, this.devices);
    
    // Check if device list has changed
    if (self.devices!=null && typeof(devdiff)==="undefined") return 0;
    self.devices=devicelist;
    
    $("#Devices").empty();
	var fstab=self.readfstab(function(fstab){
		console.log("******************"); // Torna undefined... cabron...
		console.log(fstab);
		
		/*
		WIP HERE	:
		
		Queda en el create icon, posar el icono, en funció del tipus de
		suport que siga i el sitema de fitxers, i si està muntat o no...
		
		i associar el clic a l'event de muntatge...
		*/
		
		for (i=0; i<devicelist.length;i++) {
			/*if (devicelist[i]["DeviceIsPartition"]===true &&
				devicelist[i]["IdType"]!="swap" &&
				fstab.indexOf(devicelist[i]["IdUuid"])==-1) {*/
			if (devicelist[i]["IdUsage"]==="filesystem"&&
				fstab.indexOf(devicelist[i]["IdUuid"])==-1){
				icon=self.createDeviceIcon(devicelist[i]);
				$("#Devices").append(icon);
			}
			
		}
		
		});
	
	
	
}
