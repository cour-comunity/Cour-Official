//services
class JSServicesManager {
  constructor(Manager) {
    this.GlobalServiceManager = Manager;
    this.Import('MessagingService'); //default service for this class
  }
  get MessagingServiceInitilization() {
    class Initilization {
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
        
        let CurrentPath = this.FindChannel(Path);
        
        
        
        CurrentPath.SubscribedFunctions.push(Callback);
        
      } //adds a function to run when the channel gets called
      
      
      BroadcastToChannel(Path, Data) {
        
        let CurrentPath = this.FindChannel(Path);
        CurrentPath.SubscribedFunctions.forEach(eventFunction => {
          eventFunction(Data);
        });
      } //runs every function of the channel
      
    } //your method can vary but you need to return the class for the service at the end. 
    //if your service needs any dependencys then use this.import if your service is inside this class otherwise use this.globalservicemanager.from.(ParentService).import(ServiceName)
    return new Initilization(this.GlobalServiceManager);
  } //all child services needs a get method with the ke word "Initilization" at the end
  
  get UIManagerInitilization() {
    class Initilization {
      constructor(Manager) {
        this.ServiceManager = Manager;
        this.UICache = {
          
        };
      }
      CacheForElement(Element) {
        
      }
    }
  } //handles some functions with ui
  
  get AnimationManagerInitilization() {
    class Initilization {
      constructor(Manager) {
        this.ServiceManager = Manager;
        this.AnimationQue = {
          /* Format
          AnimationName: { Just the custom name can be auto assinged if not defined
          
            Object //Required for a html element if animating an object
            
            Wait, or waituntil //if theres no object then we will wait until
            time //time for wait
            condition //function of the condition for waituntil
            Keyframe { //the keyframes name NEEDS to be the style were animating through style
              StartValue //starting INTIGER OR FLOAT for the value if not defined will auto become what it should be
              EndValue //ending INTIGER OR FLOAT for the value
              Prefix //if your animating something life style.left include end prefix like PX or %
              Curve //curve for this animation
              Regression //explanitory
              
              StartedAt // timestamp that it started this, this should start as null
              duration //how long in ms should the animation last
              
              DoAfter //function to run when animation ends
              
              Pause //is the animation paused
              PausedAt //when the animation was paused should start as null
              after //
              
            } 
            
          }
          */
        };
        
        this.Regressions = {
          
        };
      } //check this to find the format of animation que
      MasterFrame(Frame) { //I will add heavy ammount of comments for ths for those snooping the code if they feel like they will use this service
      
        //loop through each name
        Array.from(Object.keys(this.AnimationQue)).forEach(AnimationName => {
          if ('Object' in this.AnimationQue[AnimationName]) { //if were animating an object
            Array.from(Object.keys(this.AnimationQue[AnimationName])).forEach(StyleToAnimate => {
              
              if (StyleToAnimate !== 'Object') { //make sure not to animate the object
                let KeyframeData = this.AnimationQue[AnimationName][StyleToAnimate]; //this is to simplify the code
                if (!KeyframeData.StartedAt) {
                  KeyframeData.StartedAt = Frame;
                }
                if (!KeyframeData.StartValue) {
                  KeyframeData.StartValue = parseInt(Element.style[StyleToAnimate], 10);
                }
                let Completion = (Frame - KeyframeData.StartedAt) / KeyframeData.Duration;
                if (Completion < 1) {
                  //apply regression
                  if ('Regression' in KeyframeData) {
                    Completion = this.Regressions[KeyframeData.Regression[Regression]](KeyframeData.Regression.Data);
                  }
                  //calculate new value
                  let NewValue = ((KeyframeData.EndValue - KeyframeData.StartValue) * Completion) + KeyframeData.StartValue;
                } else {
                  //do after here
                }
              }
            });
          } else if ('WaitUntil' in this.AnimationQue[AnimationName] || 'Wait' in this.AnimationQue[AnimationName]) { //if were waiting 
            
          } else { //if nothing is in here to animate
            delete this.AnimationQue[AnimationName];
          }
        });
        
        if (Object.keys(AnimationQue).length > 0) {
          //this.Playing = requestAnimationFrame(this.MasterFrame.bind(this));
        }
      } //this is the Central hub for managing animations and made easy.
    }
  } //work on this
  
  
  
  
  Import(Service) {
    //defined how to apply the service
    if (!(String(Service) in this.GlobalServiceManager)) {
      this.GlobalServiceManager[String(Service)] = this[String(Service) + 'Initilization'];
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
            let ImportedUIDestination = document.body;
            ImportedUIDestination.appendChild(ImportedUI);
          }
          if (typeof starterUIInitilization === 'function') {
            starterUIInitilization();
          } else if (typeof StarterUIInitilization === 'function') {
            //add later
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
      'starter-ui-unpacked': class StarterUIUnpacked extends HTMLElement {
        constructor() {
          super();
        }
        connectedCallback() {
          if (this.dataset.replaceElement) {
            let ElementToReplace = document.getElementById(this.dataset.replaceElement);
            while (ElementToReplace.firstChild) {
              ElementToReplace.removeChild(ElementToReplace.firstChild);
            }
            while (this.firstChild) {
              ElementToReplace.appendChild(this.firstChild);
            }
            this.remove();
          }
        }
      },
      'starter-ui-unpacked-style': class StarterUIUnpackedStyleSheet extends HTMLElement {
        constructor() {
          super();
        }
        connectedCallback() {
          while (this.firstChild) {
            document.head.appendChild(this.firstChild);
          }
          this.remove();
        }
        
      }
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
    if (typeof Service === 'string' && globalThis[Service]) {
      this.From[Service] = globalThis[Service];
    }

  }
  
}


