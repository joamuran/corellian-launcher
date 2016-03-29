xdg=require('xdg');
fs= require ('fs');

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
