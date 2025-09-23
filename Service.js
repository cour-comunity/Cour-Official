//services
class JSServicesManager {
  constructor(Manager) {
    this.GlobalServiceManager = Manager;
    this.Import('MessagingService'); //default service for this class
  }
  get MessagingServiceInitialization() {
    class Initialization {
      constructor(Manager) {
        this.ServiceManager = Manager;
        this.Global = {
          'SubscribedFunctions': [],
        };
      }
      
      
      FindChannel(Path) {
        
        let CurrentPath = this.Global;
        Path.split('.').forEach(Key => {
          if (!(Key in CurrentPath)) {
            CurrentPath[Key] = {
              'SubscribedFunctions': [] //sets up the default stuff for that channel
            };
          }
          CurrentPath = CurrentPath[Key];
        });
        return CurrentPath;
      } //called to return the channel and make it if it doesnt exsist
      
      
      SubscribeToChannel(Path, Callback) {
        CurrentPath = this.FindChannel(Path);
        CurrentPath.SubscribedFunctions.push(Callback);
      } //adds a function to run when the channel gets called
      
      
      BroadcastToChannel(Path, Data) {
        CurrentPath = this.FindChannel(Path);
        CurrentPath.SubscribedFunctions.forEach(eventFunction => {
          eventFunction(Data);
        });
      } //runs every function of the channel
      
    } //your method can vary but you need to return the class for the service at the end. 
    //if your service needs any dependencys then use this.import if your service is inside this class otherwise use this.globalservicemanager.from.(ParentService).import(ServiceName)
    return new Initialization(this.GlobalServiceManager);
  } //all child services needs a get method with the ke word "Initilization" at the end
  Import(Service) {
    //defined how to apply the service
    if (!(String(Service) in this.GlobalServiceManager)) {
      this.GlobalServiceManager[String(Service)] = this[String(Service) + 'Initialization'];
    }
  }
  
} //this service is built to help with javascript developement and can be used to help html elements too
class HTMLServicesManager {
  constructor(Manager) {
    this.GlobalServiceManager = Manager;
  }
  InitilizeElements(Tags) {
    Array.from(Object.keys(Tags)).forEach(CustomTag => {
      customElements.define(CustomTag, Tags[CustomTag]);
    });
    //document.body.getElementsByTagName('yourTag'); 
  }
  
  get StarterUIServiceInitilization() {
    const CustomTags = {
      'starter-ui': class Initialization extends HTMLElement {
        constructor() {
          super();
        }
        connectedCallback() { //when elements in the body
          let UI = localStorage.getItem(String(this.dataset.uiStoragePath));
          if (!UI || !(this.querySelector('#' + String(UI)))) {
            localStorage.setItem(String(this.dataset.uiStoragePath), String(this.dataset.fallbackUi));
            UI = String(this.dataset.fallbackUi);
          }
          UI = document.getElementById(UI);
          if (UI) {
            let ImportedUI = document.importNode(UI.content, true);
            document.getElementById('PageContent').appendChild(ImportedUI);
          }
          if (typeof starterUIInitilization === 'function') {
            starterUIInitilization();
          } else if (typeof StarterUIInitilization === 'function') {
            
          }
          this.remove();
        }
        disconnectedCallback() {
        }
        static get observedAttributes() {
          return [];
        }
        attributeChangedCallback(Name, OldValue, NewValue) {
          
        }
      }, //id recomend only using one of these
      
    }; //make sure the tags are named propperly
    
    this.InitilizeElements(CustomTags); //initilize the tags
    
    class InitilizationClass {
      constructor(Manager) {
        this.Manager = Manager;
      }
    } //a class the user can call in javascript to manage the tags
    
    
    //setup dependencys
    this.GlobalServiceManager.From.JSServices.Import('MessagingService');
    
    return new InitilizationClass(this.GlobalServiceManager);
  } //this is what you put templates for ui inside of to load the propper one later
  Import(Service) {
    if (!(String(Service) in this.GlobalServiceManager)) {
      this.GlobalServiceManager[Service] = this[String(Service) + 'Initilization'];
    }
  }
} //this service is for custom elements to be defined and when to define them.

class ServicesManager {
  constructor() {
    
    class From {
      constructor(Manager) {
        this.GlobalServicesManager = Manager;
        //JSS and HTML are the default services
        this.JSServices = new JSServicesManager(Manager);
        this.HTMLServices = new HTMLServicesManager(Manager);
      }
    } //This is to add proper syntax and let people store more Services. the syntax to get a service from a service path is servicemanager.from.ParentService.import(childService)
    
    this.From = new From(this); //initialize the storage of parent services
    this.ServicePaths = {
      'JSService': JSServicesManager,
      'HTMLServices': HTMLServicesManager
    };
  }
  Import(Service) {
    
    if (typeof window !== 'undefined' && window[Service] && typeof window[Service] === 'function') {
      
    }
  }
  
}
