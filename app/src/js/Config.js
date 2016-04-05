var xdg=require('xdg');
var env=require('xdg-env');
var fs= require ('fs');
var xml2js=require('xml2js');


function Config (){
  /* Keeps llx-launchpad config */
  var self=this;
  this.configPath=xdg.basedir.configHome()+"/corellian-launcher";
}


Config.prototype.getApplicationsMenu=function getApplicationsMenu(){
  /* Loading Application Menu for user config path  */
  var self=this;
  file=self.configPath+"/menu.json";
  contentfile=fs.readFileSync(file).toString();
  return JSON.parse(contentfile);
}


function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}


Config.prototype.getRecentFiles=function getRecentFiles(callback){
  var basedir = require("xdg").basedir;
  
  var recently_used = basedir.dataPath("recently-used.xbel"); // == /home/bob/.local/share/recently-used.xbel
  
  var recent_array=[];
 
  
  var parser = new xml2js.Parser();
  
  var recents=[];
  fs.readFile(recently_used, function(err, data) {
      parser.parseString(data, function (err, result) {
        console.log(result);
          for (i=0;i<result["xbel"]["bookmark"].length;i++) {
            var href=result["xbel"]["bookmark"][i]["$"]["href"];
            var mimetype=result["xbel"]["bookmark"][i]["info"][0]["metadata"][0]["mime:mime-type"][0]["$"]["type"];
            var last_access=result["xbel"]["bookmark"][i]["$"]["modified"];
            var bookmark={"href": href, "mimetype":mimetype, "last_access":last_access};
            recents.push(bookmark); 
          }
          
          sorted=sortByKey(recents, "last_access");
          
          //console.log(sorted);
          
          var max=-1;
          if (sorted.length>20) max=20;
          else max=sorted.length;
          recent_array=[];
          
          for (i=0;i<max;i++)
            recent_array[i]=sorted[i];
            
          callback(recent_array);

      });
  });
  
  console.log(recent_array);
  return recent_array;
  //ret.push({"id":"home", "name": "Home", "url":recents});
  
  //var trashPath=basedir.dataPath("Trash");
  //ret.push({"id":"trash", "name": "Trash", "icon":"", "url":trashPath});
  
  
}


Config.prototype.getPlaces=function getPlaces(){
  
  var ret=[];
  
  var Home = process.env.HOME; // == /home/bob/.local/share
  
  // Adding home
  ret.push({"id":"Home", "name": "Home","icon":"default-user-home.png", "url":Home}); // (li afegirem el distributor-logo de icono, però en el python quan generem els menus...)
  
  ret.push({"id":"desktop", "name": "Desktop", "icon":"default-user-desktop.png", "url":env.USER_DIRS.DESKTOP});
  ret.push({"id":"download", "name": "Download", "icon":"default-folder-download.png","url":env.USER_DIRS.DOWNLOAD});
  ret.push({"id":"documents", "name": "Documents", "icon":"default-folder-documents.png", "url":env.USER_DIRS.DOCUMENTS});
  ret.push({"id":"music", "name": "Music", "icon":"default-folder-music.png", "url":env.USER_DIRS.MUSIC});
  ret.push({"id":"pictures", "name": "Pictures", "icon":"default-folder-pictures.png", "url":env.USER_DIRS.PICTURES});
  ret.push({"id":"videos", "name": "Videos", "icon":"default-folder-video.png","url":env.USER_DIRS.VIDEOS});
    
  // Adding dropbox folder if exists
  if (fs.existsSync(Home+'/.dropbox/info.json')) {
    var dropbox = JSON.parse(fs.readFileSync(Home+'/.dropbox/info.json', 'utf8'));
    var dropboxPlace=dropbox.personal.path;
    ret.push({"id":"dropbox", "name": "Dropbox", "icon":"default-folder-dropbox.png","url":dropboxPlace});
  } 
  
  return ret;


  
/*
Carpeta OwnCloud

joamuran@Toshi:~/.local/share/data/ownCloud/folders$ cat ownCloud 
[ownCloud]
localPath=/home/joamuran/ownCloud/
targetPath=/
backend=owncloud
connection=ownCloud
blackList=@Invalid()


*/
  
  
}


/*

Documents recents: ~/.local/share/recently-used.xbel
Amb xdg:

var basedir = require("xdg").basedir;

var dataHome = basedir.dataHome(); // == /home/bob/.local/share 
var dataPath = basedir.dataPath("recently-used.xbel"); // == /home/bob/.local/share/recently-used.xbel 

Trash:
> basedir.dataPath("Trash");
'/home/joamuran/.local/share/Trash'
> 


https://libraries.io/npm/xdg-env/0.0.2
> var env = require('xdg-env')
undefined
> env
{ DATA_HOME: '/home/joamuran/.local/share',
  CONFIG_HOME: '/home/joamuran/.config',
  DATA_DIRS: 
   [ '/home/joamuran/.local/share',
     '/usr/share/mate',
     '/usr/local/share/',
     '/usr/share/' ],
  CONFIG_DIRS: [ '/etc/xdg/xdg-mate', '/etc/xdg' ],
  CACHE_HOME: '/home/joamuran/.cache',
  RUNTIME_DIR: '/run/user/1000',
  CURRENT_DESKTOP: [ 'MATE' ],
  USER_DIRS: 
   { DESKTOP: '/home/joamuran/Desktop',
     DOWNLOAD: '/home/joamuran/Downloads',
     TEMPLATES: '/home/joamuran/Templates',
     PUBLICSHARE: '/home/joamuran/',
     DOCUMENTS: '/home/joamuran/Documents',
     MUSIC: '/home/joamuran/Music',
     PICTURES: '/home/joamuran/Pictures',
     VIDEOS: '/home/joamuran/Videos' } }

La informació esta està en:
/home/joamuran/.config
joamuran@Toshi:~/.config$ cat user-dirs.dirs


Carpeta dropbox:

en ~/.dropbox/info.json
{"personal": {"path": "/srv/mv/Dropbox", "host": 2765862736}}


COMPTE AMB TOT LO DELS SETTINGS!!!!! ->> DEPEN DE L'ENTORN!!!
--> Quasi que ho llevem del menú d'aplicacions... fem el menú que només siguen aplicacions
--> La configuració pillar-la segons l'entorn, i llançar el centre de control:

gnome-control-center
mate-control-center
xfce4-settings-manager
cinnamon-control-center
(Estil Whishker menu...)


*/