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
    return new Initilization(this.GlobalServiceManager);
  } //handles some functions with ui
  
  get AnimationManagerInitilization() {
    class Initilization {
      constructor(Manager) {
        this.ServiceManager = Manager;
        this.AnimationQue = {
          /* Format
          name: { Just the custom name can be auto assinged if not defined
          
            Object //Required for a html element if animating an object
            
            Wait, or waituntil //if theres no object then we will wait until
            time //time for wait
            condition //function of the condition for waituntil
            Keyframe { //the keyframes name NEEDS to be the style were animating through style
              StartValue //starting INTIGER OR FLOAT for the value if not defined will auto become what it should be
              EndValue //ending INTIGER OR FLOAT for the value
              Suffix //if your animating something life style.left include end prefix like PX or %
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
          'Sigmoid': function Sigmoid(X, Data) {
            if (!(Data.W1)) Data.W1 = 7.8;
            if (!(Data.W2)) Data.W2 = 4;
            if (!(Data.B1)) Data.B1 = -2.1;
            return 1 / (1 + (Math.pow(W1, -1 * (w2 * X + B1))));
          }
        };
        this.BiasCurve = {
          
        };
        this.ActivationCurve = {
          
        };
      } //check this to find the format of animation que
      MasterFrame(Frame) { 
        Array.from(Object.keys(this.AnimationQue)).forEach(AnimationName => {
          let Animation = this.AnimationQue[AnimationName];
          
          if ('Element' in Animation) {
            let ElementToAnimate = Animation.Element;
            
            Array.from(Object.keys(Animation)).forEach(KeyframeName => {
              if (KeyframeName !== 'Element') {
                let Keyframe = Animation[KeyframeName];
                if (!(Keyframe.StartedAt)) {
                  Keyframe.StartedAt = Frame;
                }
                if (!(Keyframe.StartValue)) {
                  Keyframe.StartValue = parseInt(ElementToAnimate.style[KeyframeName], 10);
                }
                
                let TrueCompletion = (Frame - Keyframe.StartedAt) / Keyframe.Duration;
                let Completion = TrueCompletion; //true complotion is before regression
                //apply regression
                if ('Regression' in Keyframe) {
                  Completion = this.Regressions[Keyframe.Regression.Type](Completion, Keyframe.Regression.Variables);
                }
                let NewValue = Completion * ((Keyframe.EndValue - Keyframe.StartValue) / Keyframe.Duration);
                if ('ActivationCurve' in Keyframe) {
                  NewValue = this.ActivationCurve[Keyframe.ActivationCurve.Type](NewValue, Keyframe.ActivationCurve.Data);
                }
                if ('BiasCurve' in Keyframe) {
                  NewValue = NewValue + this.BiasCurve[Keyframe.BiasCurve.Type](TrueCompletion, Keyframe.BiasCurve.Data);
                }
                if (!(Keyframe.Suffix)) {
                  Keyframe.Suffix = '';
                }
                ElementToAnimate.style[KeyframeName] = String(NewValue) + Keyframe.Suffix;
                if (TrueCompletion >= 1) {
                  ElementToAnimate.style[KeyframeName] = String(Keyframe.EndValue) + Keyframe.Suffix;
                  //end animation
                  if ('DoAfter' in Keyframe && typeof Keyframe.DoAfter === 'function') {
                    Keyframe.DoAfter();
                  } else if ('DoAfter' in Keyframe && typeof Keyframe.DoAfter === 'string') {
                    this.ServiceManager.MessagingService.BroadcastToChannel(Keyframe.DoAfter);
                  }
                  delete this[AnimationName][KeyframeName];
                }
              }
            });
            if (Object.keys(Animation).length - 1 < 1) {
              delete this.AnimationQue[AnimationName];
            }
          } else if ('Wait' in Animation) {
            if (!(Animation.StartedAt)) {
              Animation.StartedAt = Frame;
            }
            if (Animation.StartedAt + Animation.Duration <= Animation.StartedAt + Frame) {
              if (typeof Animation.DoAfter === 'string') {
                this.ServiceManager.MessagingService.BroadcastToChannel(Animation.DoAfter);
              } else {
                Animation.DoAfter();
              }
            }
          } else if ('WaitUntill' in Animation) {
            if (Animation.Duration()) {
              if (typeof Animation.DoAfter === 'string') {
                this.ServiceManager.MessagingService.BroadcastToChannel(Animation.DoAfter);
              } else {
                Animation.DoAfter();
              }
            }
          } else {
            delete this.AnimationQue[AnimationName];
          }
        });
        
      } //this is the Central hub for managing animations and made easy.
    }
    return new Initilization(this.GlobalServiceManager);
  } //work on this
  
  get UserActionsInitilization() {
    class Initilization {
      constructor(Manager) {
        this.ServiceManager = Manager;
        class Mouse {
          constructor(Parent) {
            this.ParentManager = Parent;
            this.X = null;
            this.Y = null;
            this.LeftClick = false;
            this.RightClick = false;
            this.MiddleClick = false;
            document.addEventListener('mousedown', this.MouseDown.bind(this));
            document.addEventListener('mouseup', this.MouseUp.bind(this));
            document.addEventListener('mousemove', this.MouseMove.bind(this));
          }
          
          
          MouseDown(Event) {
            let Target = Event.target;
            while (Target.dataset.passEventToParent) {
              if (Target.dataset.passEventToParent.toLowerCase() === 'true') {
                Target = Target.parentNode;
              }
            }
            if (event.buttons === 1 && !(this.RightClick || this.MiddleClick) && String(Target.style.cursor)) { //Activate resize Mode
              
            }
            /* event.buttons
            1: Left mouse button.
            2: Right mouse button.
            4: Middle mouse button (wheel).
            */
          }
          MouseUp(Event) {
            let Target = Event.target;
            while (Target.dataset.passEventToParent) {
              if (Target.dataset.passEventToParent.toLowerCase() === 'true') {
                Target = Target.parentNode;
              }
            }
            if (!(this.RightClick || this.LeftClick || this.MiddleClick) && Target.tagName === 'RESIZABLE-WINDOW-V1') {
              let TargetLeft = parseInt(Target.style.left);
              let TargetTop = parseInt(Target.style.top);
              let TargetRight = TargetLeft + parseInt(Target.style.width);
              let TargetBottom = TargetTop + parseInt(Target.style.height);
              
            }//v1 will be for resizablewindows that do not have there own resize elements to save proformance and space
            
          }
          MouseMove(Event) {
            let Target = Event.target;
            while (Target.dataset.passEventToParent) {
              if (Target.dataset.passEventToParent.toLowerCase() === 'true') {
                Target = Target.parentNode;
              }
            }
            
          }
          
        }
        this.Mouse = new Mouse(this);
        
      }
    }
    return new Initilization(this.GlobalServiceManager);
  }
  
  
  
  
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
    class InitilizationClass {
      constructor(Manager) {
        this.ServiceManager = Manager;
      }
    }//a class the user can call in javascript to manage the tags
    var InitilizedClass = new InitilizationClass(this.GlobalServiceManager);
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
        
      }, //runs everything else
      'starter-ui-unpacked-setup-js': class StarterUIUnpackedSetupScript extends HTMLElement {
        constructor() {
          super();
        }
        connectedCallback() {
          document.head.appendChild(this.firstChild);
          if (StarterUIInitilizationScript && typeof StarterUIInitilizationScript === 'function') {
            InitilizedClass.Service = new StarterUIInitilizationScript(InitilizedClass.ServiceManager);
          }
          this.remove();
        }
      } //runs setup javascript
    }; //make sure the tags are named propperly
    
    this.InitilizeElements(CustomTags); //initilize the tags
     
    
    
    //setup dependencys
    this.GlobalServiceManager.From.JSServices.Import('MessagingService');
    
    
    return InitilizedClass;
  } //this is what you put templates for ui inside of to load the propper one later
  
  get UIImportServiceInitilization() {
    class InitilizationClass {
      constructor(Manager) {
        this.ServiceManager = Manager;
      }
    }
    var InitilizedClass = new InitilizationClass(this.GlobalServiceManager);
    const CustomTags = {
      'ui-import-service': class UiImportServiceInitilization extends HTMLElement {
        constructor() {
          super();
          
        }
        connectedCallback() {
          let ChildToImport = document.getElementById('ImportStorage' + this.id);
          this.id = 'DeletingElementSoon';
          
          if (ChildToImport) {
            let ImportedElement = document.importNode(ChildToImport.content, true);
            
            this.parentNode.appendChild(ImportedElement);
            
          }
          this.remove();
        }
      }
    };
    this.InitilizeElements(CustomTags);
    this.GlobalServiceManager.From.JSServices.Import('MessagingService');
    return InitilizedClass;
  }
  
  get SideMenuInitilization() {
    class InitilizationClass {
      constructor(Manager) {
        this.ServiceManager = Manager;
      }
    }
    
    var InitilizedClass = new InitilizationClass(this.GlobalServiceManager);
    this.GlobalServiceManager.From.JSService.Import('AnimationManager');
    const CustomTags = {
      'side-menu': class SDM extends HTMLElement {
        constructor() {
          super();
        }
        static get observedAttributes() {
          return ['data-pinned'];
        }
        attributeChangedCallback(Name, OldValue, NewValue) {
          if (Name === 'data-pinned') {
            if (NewValue === 'True' && OldValue === 'False') {
              
            }
          }
        }
      }
    };
    this.InitilizeElements(CustomTags);
    return InitilizedClass;
    
  }
  
  
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
    } else if (typeof Service === 'string' && GlobalExternalServices[Service]) {
      this.From[Service] = new GlobalExternalServices[Service]();
    }
  }
}


/* To Do
add more services what do you think?


*/