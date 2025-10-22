
// ... (rest of your signaling and movement code)

GlobalExternalServices.PeerToPeerService = class P2p {
  constructor(Manager) {
    this.OnMessage = {};
    this.GlobalServiceManager = Manager;
    this.PeerConnections = {};
    this.GlobalServiceManager.PeerToPeer = this;
  }
  InitilizeConnection(Connection, Channel) {
    //initilize a new Connection
    this.PeerConnections[Connection] = {};
    this.PeerConnections[Connection].PeerConnection = new RTCPeerConnection();
    this.PeerConnections[Connection].DataChannel = this.PeerConnections[Connection].PeerConnection.createDataChannel(Channel);
  
    //when a new message
    this.PeerConnections[Connection].DataChannel.onmessage = (Event) => {
      let MessageData = JSON.parse(Event.data);
      console.log('MessageRecieved');
      if (MessageData.Action && MessageData.Action === 'Ping') {
        this.PeerConnections[Connection].DataChannel.send(JSON.stringify({Action: 'ReturnPing'}));
      }
      Array.from(Object.keys(this.OnMessage)).forEach(ToDo => {
        this.OnMessage[ToDo](this.MessageData);
      });
    };
    
    //make sure the connection was a success
    this.PeerConnections[Connection].DataChannel.onopen = () => alert("P2P Connection Open!");
    
    // ICE candidates
    this.PeerConnections[Connection].PeerConnection.onicecandidate = (Event) => {
      if (!Event.candidate) {
        // Offer/Answer is ready
        this.SignalConsole.value = JSON.stringify(this.PeerConnections[Connection].PeerConnection.localDescription);
      }
    };
    this.PeerConnections[Connection].CreateOffer = async () => {
      let Offer = await this.PeerConnections[Connection].PeerConnection.createOffer();
      await this.PeerConnections[Connection].PeerConnection.setLocalDescription(Offer);
    };
    
    this.PeerConnections[Connection].Connect = async (Offer) => {
      let RemoteDescription = JSON.parse(Offer);
      await this.PeerConnections[Connection].PeerConnection.setRemoteDescription(RemoteDescription);
  
      if (RemoteDescription.type === "offer") {
        let Answer = await this.PeerConnections[Connection].PeerConnection.createAnswer();
        await this.PeerConnections[Connection].PeerConnection.setLocalDescription(Answer);
        this.SignalConsole.value = JSON.stringify(this.PeerConnections[Connection].PeerConnection.localDescription);
      }
    };
    this.PeerConnections[Connection].PeerConnection.ondatachannel = (event) => {
      // This will run on the answerer when the data channel is established
      this.PeerConnections[Connection].DataChannel = event.channel; // Assign the incoming channel to your dataChannel variable
      
      this.PeerConnections[Connection].DataChannel.onclose = () => console.log("Data channel closed");
      this.PeerConnections[Connection].DataChannel.onerror = (err) => console.error("Data channel error:", err);
    };
    return ({'Success': true, 'Message': 'New chat: ' + Connection + ' has been initialized'});
    /*
    if (DataChannel.readyState === "open") {
        DataChannel.send(JSON.stringify(playerState));
    }
    */
    
    
    
    
    
    //check for creation
    
  }
  CreateOffer(Channel) {
    this.PeerConnections[Channel].CreateOffer();
  }
  Connect(Channel, Offer) {
    this.PeerConnections[Channel].Connect(Offer);
  }
  Send(Channel, Data) {
    if (this.PeerConnections[Channel].DataChannel.readyState === "open") {
      this.PeerConnections[Channel].DataChannel.send(JSON.stringify(Data));
    }
  }
  OnMessageDo(Name, Func) {
    this.OnMessage[Name] = Func;
  }
  
}

/* removable
v=0
s=-
t=0 0
a=msid-semantic:WMS
a=extmap-allow-mixed
*/



