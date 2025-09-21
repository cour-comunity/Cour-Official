//services
class JSServices {
 constructor(Manager) {
   this.GlobalServiceManager = Manager;
   this.ServicesTemplate = {
     'EventsService': {
        'Service': class EventsService {
          constructor(ServiceManager) {
            this.ServiceManager = ServiceManager;
            console.log('In developement');
          }
        },
        'Dependencys': [],
      }
   };
 }
 GetService(Service, Data) {
   //setup data
   if ('RecursionDepth' in Data === false) {
     Data.RecursionDepth = 0;
   }
   //logic
   if (String(Service) in this.GlobalServiceManager) {
     return this.ImportedService[Service];
   } else if (String(Service) in this.ServicesTemplate) {
      //set up the data
      const ServicePath = this.ServicesTemplate[Service];
      
      //get the dependencys first
      if (ServicePath.Dependencys.length > 0) {
        ServicePath.Dependencys.forEach(DependentService => {
          //make it so if the dependency is a js one then it will skip the recursive from the service manager to skip recursive steps for proformance
          if (DependentService.startsWith("HTML/")) {
            this.GlobalServiceManager.Import(DependentService.replace("HTML/", ""), 'HTML');
          } else if (DependentService.startsWith("JS/")) {
            this.GetService(DependentService.replace("JS/", ""), Data.RecusionDepth + 1);
          } else {
            this.GlobalServiceManager.Import(DependentService);
          }
        });
      }
      //initialize the service maby add ability to shorten it so its not stored twice
      this.GlobalServiceManager[String(Service)] = new ServicePath.Service(this);
   } else if ('Orgin-Conflicts' in Data === false) {
     
   } else {
     //that service doesnt exsist throw debug
   }
 }
}

class HTMLServices {
 constructor(Manager) {
   this.GlobalServiceManager = Manager;
   this.ServicesTemplate = {
     'UILoader': {
        'HTMLTags': {
          'STARTER-UI-LOADER': class StarterUI extends HTMLElement {
            constructor() { //Right as element is made
              super();
              //customElements.define('my-greeting', MyGreeting);
            }
            connectedCallback() { //when elements in the body
             
            }
            disconnectedCallback() {
              
            }
            static get observedAttributes() {
              
            }
            attributeChangedCallback(name, oldValue, newValue) {
              
            }
          }
        }
     }
   };
 }
 GetService(Service, Data) {
   //get variable data
   if ('RecursionDepth' in Data === false) {
     Data.RecursionDepth = 0;
   }
   
   if (String(Service) in this.GlobalServiceManager) {
     return this.ImportedService[Service];
   } else if (String(Service) in this.ServicesTemplate) {
      //set up the data
      const ServicePath = this.ServicesTemplate[Service];
   } else if ('Orgin-Conflicts' in Data === false) {
     
   } else {
     //error debug
   }
   
 }
}


class Services {
  constructor() {

    this.JSServicManager = new JSServices(this);
    this.HTMLServiceManager = new HTMLServices(this);
  }
  Import(Service, Strict) {
    //check if its in html service or jss service
  }
}
const ServiceManager = new Services();
