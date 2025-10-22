//should be the main script for index home, service script will be what gets imported into here
//setup basic variables here
//document.body.style.background = 'blue';
ServiceManager = new ServicesManager();
ServiceManager.From.HTMLServices.Import('StarterUIService');
ServiceManager.From.HTMLServices.Import('UIImportService');
ServiceManager.From.HTMLServices.Import('SideMenuService');
ServiceManager.From.JSServices.Import('UserActions');
ServiceManager.Import('UniversalConsole');
ServiceManager.From.UniversalConsole.Import('OnlineChat');




window.onload = function() {
  
};
