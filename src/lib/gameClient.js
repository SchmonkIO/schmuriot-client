class gameClient {
  constructor(url, evCallback) {
    if(!url) {
      throw new Error("Server url is required");
    }
    this.url = url;
    this.evCallback = evCallback;
    this.connection = null;

    // game client actions
    this.login = this.login.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.getRoom = this.getRoom.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);

    this.handleMessage = this.handleMessage.bind(this);

    this.registerEventHandlers = this.registerEventHandlers.bind(this);
    this.registeredEventHandlers = {}
  }

  connect() {        
    console.log("gameClient:connecting");
    let connection =  new WebSocket(this.url);
    connection.onopen =  this.registeredEventHandlers.onConnect || (() => {});
    connection.onclose = this.registeredEventHandlers.onClose || (() => {});    
    connection.onerror = this.registeredEventHandlers.onClose || (() => {});
    connection.onmessage = this.handleMessage;

    this.connection = connection;
  }

  registerEventHandlers(handlers) {
    Object.assign(this.registeredEventHandlers, handlers, this.registeredEventHandlers);
  }

  removeEventHandlers(handlers) {
    handlers.forEach(handler => {
      delete this.registeredEventHandlers[handler];
    })
  };

  handleMessage(ev) {    ;
    let data = JSON.parse(ev.data);
    console.log("gameClient:response", data)

    if(this.registeredEventHandlers[data.action]) {
      if (data.status) {
        this.registeredEventHandlers[data.action](data);
      }
    } 
  }

  login(name) {
    this.connection.send(JSON.stringify({
      action: "setUser",
      name: name
    }));
  }

  getRooms() {
    this.connection.send(JSON.stringify({
      action: "getRooms"
    }));
  }

  getRoom() {
    this.connection.send(JSON.stringify({
      action: "getRoom"
    }));
  }

  joinRoom(id, password) {
    this.connection.send(JSON.stringify({
      action: "joinRoom",
      id: id,
      pass: password || ""
    }));
  }

  leaveRoom() {
    this.connection.send(JSON.stringify({
      action: "leaveRoom"
    }));
  }

  createRoom(name, password) {
    this.connection.send(JSON.stringify({
      action: "createRoom",
      name: name,
      pass: password,
      map: "",
      slots: 4
    }));
  }

  toggleReady() {
    this.connection.send(JSON.stringify({
      action: "toggleReady"
    }));
  }

}

export default gameClient;