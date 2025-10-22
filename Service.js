



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
        this.LastFrame = null;
        this.AnimationQue = {
          /* Format
          name: { Just the custom name can be auto assinged if not defined
          
            element //Required for a html element if animating an object
            
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
        window.requestAnimationFrame(this.MasterFrame.bind(this));
      } //check this to find the format of animation que
      MasterFrame(Frame) {
        
        Array.from(Object.keys(this.AnimationQue)).forEach(AnimationName => {
          let Animation = this.AnimationQue[AnimationName];
          
          if ('Element' in Animation && !('GlobalPause' in Animation)) {
            
            let ElementToAnimate = Animation.Element;
            
            Array.from(Object.keys(Animation)).forEach(KeyframeName => {
              let Keyframe = Animation[KeyframeName];
              if (KeyframeName !== 'Element' && !('Pause' in Keyframe)) {
                if (!(Keyframe.StartedAt)) {
                  Keyframe.StartedAt = Frame;
                }
                if (!(Keyframe.StartValue)) {
                  Keyframe.StartValue = parseInt(ElementToAnimate.style[KeyframeName], 10);
                }
                if ('DataRegression' in Keyframe) {
                  let NewData = Keyframe.DataRegression({
                    'Frame': Frame,
                    'GlobalServiceManager': this.ServiceManager,
                    'Element': ElementToAnimate,
                    'StartedAt': Keyframe.StartedAt,
                    'Duration': Keyframe.Duration,
                    'DeltaFrames': Frame - (this.LastFrame || 0)
                  });
                  Array.from(Object.keys(NewData)).forEach(ValueName => {
                  
                    if (NewData[String(ValueName)].Mode === 'Replace') {
                      
                      Keyframe[String(ValueName)] = NewData[String(ValueName)].Value;
                    }
                  });
                }
                
                
                let TrueCompletion = (Frame - Keyframe.StartedAt) / Keyframe.Duration;
                let Completion = TrueCompletion; //true complotion is before regression
                
                //apply regression
                if ('Regression' in Keyframe) {
                  Completion = this.Regressions[Keyframe.Regression.Type](Completion, Keyframe.Regression.Variables);
                }
                
                let NewValue = Keyframe.StartValue + (Completion * Keyframe.Duration) * ((Keyframe.EndValue - Keyframe.StartValue) / Keyframe.Duration);
                
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
                    let AfterEventData = Keyframe.DoAfter({'Element': Animation.Element});
                    if ('NewElement' in AfterEventData) {
                      Animation.Element = AfterEventData.NewElement;
                    }
                    if ('Repeat' in AfterEventData && AfterEventData.Repeat) {
                       Keyframe.StartedAt = Frame;
                    }
                  } else if ('DoAfter' in Keyframe && typeof Keyframe.DoAfter === 'string') {
                    this.ServiceManager.MessagingService.BroadcastToChannel(Keyframe.DoAfter);
                    
                  } else {
                    delete this[AnimationName][KeyframeName];
                  }
                  
                }
                
              } else if ('Pause' in Keyframe && !(Keyframe.Pause.FramePaused)) {
                Keyframe.PausedAt = Frame;
              } else if ('Pause' in Keyframe && !(Keyframe.Pause.Paused)) {
                Keyframe.StartedAt = Keyframe.StartedAt + (Frame - Keyframe.Pause.FramePaused);
                delete Keyframe.Pause;
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
          } else if ('GlobalPause' in Animation) {
            if (!Animation.GlobalPause.PausedAtFrame) {
              Animation.GlobalPause.PausedAtFrame = Frame;
            } else if (Animation.GlobalPause.Paused === false) {
              const TimePausedFor = Frame - Animation.GlobalPause.PausedAtFrame;
              Array.from(Object.keys(Animation)).forEach(KeyframeName => {
                if (KeyframeName !== 'Element') {
                  Animation[String(KeyframeName)].StartedAt = Animation[String(KeyframeName)].StartedAt + TimePausedFor;
                }
              });
              
              delete Animation.GlobalPause;
            }
          } else {
            delete this.AnimationQue[AnimationName];
          }
        });
        this.LastFrame = Frame;
        window.requestAnimationFrame(this.MasterFrame.bind(this));
        
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
            this.HaltingAnimations = {
              'OnHover': null,
            };
            document.addEventListener('mousedown', this.MouseDown.bind(this));
            document.addEventListener('mouseup', this.MouseUp.bind(this));
            document.addEventListener('mousemove', this.MouseMove.bind(this));
            document.addEventListener('wheel', this.Wheel.bind(this));
          }
          
          Wheel(Event) {
            event.preventDefault();
            let Target = Event.target;
            while (Target.dataset.passEventToParent) {
              if (Target.dataset.passEventToParent.toLowerCase() === 'true') {
                Target = Target.parentNode;
              }
            }
            
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
            let PauseOnHoverTargetAnimation = null;
            if (Target) {
              while (Target.dataset.passEventToParent) {
                if (Target.dataset.passEventToParent.toLowerCase() === 'true') {
                  Target = Target.parentNode;
                }
              }
              PauseOnHoverTargetAnimation = Target.dataset.haltAninimationOnmouseHover;
            }
            if (this.ParentManager.ServiceManager.AnimationManager) {
              const AnimationManager = this.ParentManager.ServiceManager.AnimationManager;
              if (PauseOnHoverTargetAnimation !== this.HaltingAnimations.OnHover) {
                if (this.HaltingAnimations.OnHover) {
                  AnimationManager.AnimationQue[String(this.HaltingAnimations.OnHover)].GlobalPause.Paused = false;
                  this.HaltingAnimations.OnHover = null;
                }
                if (PauseOnHoverTargetAnimation) {
                  AnimationManager.AnimationQue[String(PauseOnHoverTargetAnimation)].GlobalPause = {'Paused': true};
                  this.HaltingAnimations.OnHover = PauseOnHoverTargetAnimation;
                }
              }
            }
            this.X = Event.clientX;
            this.Y = Event.clientY;
            
          }
          
        }
        this.Mouse = new Mouse(this);
        class Keyboard {
          constructor(Manager) {
            this.ParentManager = Manager;
            this.KeysLogged = ''; //just remove the first key in here and add the last key to log keys
            this.SaveKeyDepth = 1; //defines how many keys to log
            document.addEventListener('keydown', this.KeyDown.bind(this));
            document.addEventListener('keyup', this.KeyUp.bind(this));
          }
          KeyDown(Event) {
            
          }
          KeyUp(Event) {
            
          }
        }
        
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
  
  get PackAlphaInitilization() {
    class InitilizationClass {
      constructor(Manager) {
        this.ServiceManager = Manager;
        
      }
    }
    var GlobalServiceManagerPath = this.GlobalServiceManager;
    this.GlobalServiceManager.From.JSServices.Import('AnimationManager');
    var InitilizedClass = new InitilizationClass(this.GlobalServiceManager);
    
    
    
    const CustomTags = {
      'ui-pack-alpha-conveyor': class Conveyor extends HTMLElement {
        constructor() {
          super();
          this.style.whiteSpace = 'nowrap';
          
          
        }
        connectedCallback() {
          let TempContainer = document.createElement('Container');
          TempContainer.id = 'Conveyor' + this.id + 'TemperaryItemHolder';
          this.parentNode.appendChild(TempContainer);
          for (let i = 0; i < this.children.length; i++) {
            this.children[i].style.position = 'absolute';
            this.children[i].style.bottom = '50%'; //just a test for now
            TempContainer.appendChild(this.children[i]);
            
          }
          for (let i = 0; i <= Math.ceil(this.getBoundingClientRect().width / this.getBoundingClientRect().height); i++) {
            
            let BeltHolder = document.createElement("div");
            
            //BeltHolder.style.position = 'relative';
            BeltHolder.style.height = '100%';
            BeltHolder.style.border = '1px solid black';
            BeltHolder.style.width = String(this.getBoundingClientRect().height * 1.5) + 'px';
            BeltHolder.style.position = 'relative';
            BeltHolder.id = this.id + 'BeltHolder' + String(i);
            BeltHolder.setAttribute('data-halt-aninimation-onmouse-hover', this.id + 'ConveyorAnimationAlphaPack');
            this.appendChild(BeltHolder);
            BeltHolder.style.background = 'grey';
            BeltHolder.style.display = 'inline-block';
            BeltHolder.style.transformStyle = 'preserve-3d';
            BeltHolder.style.transform = 'rotateX(45deg)';
            BeltHolder.style.perspectiveOrigin = 'center';
          }
          
          GlobalServiceManagerPath.AnimationManager.AnimationQue[this.id + 'ConveyorAnimationAlphaPack'] = {
            'Element': this.children[0],
            'width': {
              'StartValue': null,
              'EndValue': 0,
              'Duration': 1000,
              'Suffix': 'px',
              'DataRegression': function Regress(Data) {
                const MousePath = Data.GlobalServiceManager.UserActions;
                const ElementRect = Data.Element.getBoundingClientRect();
                const SizeConstant = 2.75; //for tweaking
                if (MousePath && Math.abs(MousePath.Mouse.Y - (ElementRect.top + (0.5 * ElementRect.height))) < ElementRect.height * SizeConstant) {
                  const DistanceRegressionValue = Math.abs(MousePath.Mouse.Y - (ElementRect.top + (0.5 * ElementRect.height))) / (ElementRect.height * SizeConstant);
                  const FramesAdded = ((1 - DistanceRegressionValue) * (Data.DeltaFrames || 1));
                  return {
                    'StartedAt': {
                      'Mode': 'Replace',
                      'Value':  Data.StartedAt + FramesAdded
                    },
                  };
                } else {
                  return {};
                }
              },
              'DoAfter': function After(Data) {
                let Conveyor = Data.Element.parentNode;
                Conveyor.insertBefore(Conveyor.children[0], null); 
                Conveyor.lastElementChild.style.width = Conveyor.children[0].style.width;
                
                return {
                  'Repeat': true,
                  'NewElement': Conveyor.children[0],
                  
                };
                
              }
              
            }
          }; //working here
          
        }
      }
    };
    
    this.InitilizeElements(CustomTags);
    return InitilizedClass;
  }
  
  get FPSInitilization() {
    class Initilization {
      constructor(Manager) {
        this.ServiceManager = Manager;
      }
    }
  }
  
  
  Import(Service) {
    if (!(String(Service) in this.GlobalServiceManager)) {
      this.GlobalServiceManager[Service] = this[String(Service) + 'Initilization'];
    }
  }
} //this service is for custom elements to be defined and when to define them.
var GlobalExternalServices = {
  
};


class ServicesManager {
  constructor(Data) {
    
    class From {
      constructor(Manager, InitilizationData) {
        this.GlobalServicesManager = Manager;
        //JSS and HTML are the default services
        if (!InitilizationData || !('Import Default' in InitilizationData) || (InitilizationData['Import Default'] === true)) {
          this.JSServices = new JSServicesManager(Manager);
          this.HTMLServices = new HTMLServicesManager(Manager);
        }
        if (InitilizationData && ('Include Services' in InitilizationData)) {
          Array.from(Object.keys(InitilizationData['Include Services'])).forEach(CustomService => {
            this[CustomService] = InitilizationData['Include Services'][CustomService];
            this[CustomService].Manager = this.GlobalServiceManager;
          });
        }
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
      globalThis[Service].ServiceManager = this;
    } else if (typeof Service === 'string' && GlobalExternalServices[Service]) {
      this.From[Service] = new GlobalExternalServices[Service](this);
    }
  }
}


/* To Do
add more services what do you think?


*/