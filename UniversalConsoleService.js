GlobalExternalServices.UniversalConsole = class UniversalConsole {
  constructor(Manager) {
    this.ServiceManager = Manager;
    this.ServiceManager.UniversalConsole = this; //this is the path to the entire service not just the console
    
    this.CurrentChannel = 'Bash'; //tells us what channel its on bash is default console 
    this.ChannelsCatch = {
      'Bash': {
        'Outputs': [],
      }
    }; //will store all the channels and any extrea data to store for them
    
    //Set up the console for us.
    this.Console = document.createElement('div'); //holder of the console
    this.Console.id = 'UniversalConsole';
    this.Console.style.background = 'black';
    this.Console.style.position = 'absolute';
    this.Console.style.minWidth = '15rem';
    this.Console.style.minHeight = '15%';
    this.Console.style.left = '20%';
    this.Console.style.top = '20%';
    document.body.appendChild(this.Console);
    
    //output feild for the console
    
    this.ConsoleOutput = document.createElement('div');
    this.ConsoleOutput.id = 'UniversalConsoleOutput';
    this.ConsoleOutput.style.width = '100%';
    this.ConsoleOutput.style.height = '100%';
    this.ConsoleOutput.style.background = 'black';
    
    this.ConsoleOutput.style.position = 'absolute';
    this.ConsoleOutput.style.left = '0px';
    this.ConsoleOutput.style.top = '0px';
    
    this.Console.appendChild(this.ConsoleOutput);
    
    //input feild for the console
    this.ConsoleInput = document.createElement('input');
    this.ConsoleInput.style.position = 'absolute';
    this.ConsoleInput.style.bottom = '-1rem';
    this.ConsoleInput.style.left = '0px';
    this.ConsoleInput.style.border = '0px';
    this.ConsoleInput.style.width = this.ConsoleOutput.style.width;
    this.ConsoleInput.type = 'text';
    this.ConsoleInput.placeholder = 'Console';
    this.ConsoleInput.id = 'UniversalConsoleInputFeild';
    this.Console.appendChild(this.ConsoleInput);
    this.ConsoleInput.addEventListener('keydown', this.HandleCommand.bind(this));
    
    
    
  }
  HandleCommand(Event) {
    
    if (Event.key === 'Enter') {
      
      Event.preventDefault(); //not sure if this is needed tbh
      this.ConsolePush({'Message': this.ConsoleInput.value, 'Orgin': 'User'});
      if (this.ConsoleInput.value.startsWith('--')) {
        this[this.ConsoleInput.value.split(' ')[0].slice(2) + 'Command'](this.ConsoleInput.value.slice(this.ConsoleInput.value.indexOf(' ') + 1));
      } else {
        this[String(this.CurrentChannel) + 'Command'](this.ConsoleInput.value);
      }
      this.ConsoleInput.value = '';
      
    }
  }
  
  get getAll() {
    return ['Debugging'];
  }
  
  get DebuggingInitilization() { //this is to handle and intercept errors or warnings or make custom warnings.
    document.body.style.background = 'blue';
    class Initilization {
      constructor(Manager) {
        
      }
    }
    return new Initilization(this.ServiceManager);
  }
  
  get OnlineChatInitilization() {
    this.ServiceManager.Import('PeerToPeerService');
    
    
    
  }
  OnlineChatCommand(Command) {
    if (Command.toLowerCase().startsWith('new')) {
      let NewUser = this.ServiceManager.PeerToPeer.InitilizeConnection(Command.split(' ')[2], Command.split(' ')[1]);
      if (NewUser.Success) {
        this.OnlineChatSignal = document.createElement('textarea');
        this.OnlineChatSignal.id = 'UniversalConsolePeerToPeerSignal';
        this.OnlineChatContainer = document.createElement('div');
        this.OnlineChatContainer.style.position = 'absolute';
        this.OnlineChatContainer.style.left = '25%';
        this.OnlineChatContainer.style.top = '25%';
        
      }
    }
  }
  
  BashCommand(Command) { //all channel commands will have this function with (channel)Commands(Command) feild
    
    if (Command.toLowerCase().startsWith('print')) { //printing command or ping if you wanna be fancy
      this.ConsolePush({'Message': Command.slice(6), 'Orgin': 'Bash'});
    } else {
      this.ConsolePush({'Message': 'Error Unkown Command: ' + Command, 'Orgin': 'Bash'});
    }
  }
  ConsolePush(Data) {
    const Recipient = (Data.To || this.CurrentChannel);
    
    if (Data.To) delete Data.To;
    
    this.ChannelsCatch[Recipient].Outputs.push(Data);
    
    if (Recipient === this.CurrentChannel) {
      const NewMessage = document.createElement('p');
      NewMessage.style.margin = '0';
      NewMessage.style.whiteSpace = 'nowrap';
      this.ConsoleOutput.appendChild(NewMessage);
      NewMessage.textContent = (Data.Orgin || 'User') + ': ' + Data.Message;
      NewMessage.style.color = ('white' || Data.Color);
    }
    
  }
  
  
  
  BashLoad() { //all channels have this to setup themselves
    //delete all elements 
    while (this.ConsoleOutput.firstChild) {
      this.ConsoleOutput.removeChild(this.ConsoleOutput.firstChild);
    }
    //add all the text
    this.ChannelsCatch.Batch.Outputs.forEach(MessageData => {
      this.BashPush(MessageData);
    });
  }
  
  
  
  
  Import(Service) {
    if (Service === 'all' || Service === '*') {
      (this.getAll).forEach(ServiceToInitilize => {
        this.Import(ServiceToInitilize);
      });
    } else if (!(String(Service) in this.ServiceManager)) {
      this.ServiceManager[String(Service)] = this[String(Service) + 'Initilization'];
    }
  }
};