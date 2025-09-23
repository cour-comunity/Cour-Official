//should be the main script for index home, service script will be what gets imported into here
//setup basic variables here
ServiceManager = new ServicesManager();
ServiceManager.From.HTMLServices.Import('StarterUIService');

window.onload = function() {
  ServiceManager.MessagingService.SubscribeToChannel('Test', function() {
    document.getElementById('MainContent').style.background = 'blue';
  });
  ServiceManager.MessagingService.BroadcastToChannel('Test');
  
};
