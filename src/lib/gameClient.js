class gameClient {
  constructor(url, evCallback) {
    if(!url) {
      throw new Error("Server url is required");
    }
    this.url = url;
    this.evCallback = evCallback;
    this.connection = null;

    // websocket handlers
    this.handleConnect = this.handleConnect.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleError = this.handleError.bind(this);

    // game client actions
    this.login = this.login.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.getRoom = this.getRoom.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);

    // request stuff
    this.request = this.request.bind(this);
    this.requestPromiseResolvers = {};
    this.requestPromiseRejecters = {};
  }

  connect() {        
    console.log("gameClient:connecting");
    let connection =  new WebSocket(this.url);
    connection.onopen =  this.handleConnect;
    connection.onclose = this.handleClose;
    connection.onmessage = this.handleMessage;
    connection.onerror = this.handleError;

    this.connection = connection;
  }
  handleConnect() {
    console.log("gameClient:connected");
    console.log(this.connection);
  }
  handleClose() {
    console.log("gameClient:disconnected");
  }
  handleMessage(ev) {    ;
    let data = JSON.parse(ev.data);
    console.log("gameClient:response", data)
    if(this.requestPromiseResolvers[data.action]) {
      if(data.status) {
        this.requestPromiseResolvers[data.action](data);
      } else {
        alert("WTF");
        this.requestPromiseRejecters[data.action](data);
      }
      delete this.requestPromiseResolvers[data.action];
      delete this.requestPromiseRejecters[data.action];
    } else {
      console.log("gameClient:unhandled_response");
      // TODO: do something 
    }
  }
  handleError(ev) {
    console.log("gameClient:error", ev.data);
    let data = JSON.parse(ev.data);
    if(this.requestPromiseRejecters[data.action]) {
      this.requestPromiseRejecters[data.action](data);
      delete this.requestPromiseRejecters[data.action];
    } else {
      console.log("gameClient:unhandled_response");
      // TODO: do something 
    }
  }

  login(name) {
    return this.request({
      action: "setUser",
      name: name
    })
  }

  getRooms() {
    return this.request({
      action: "getRooms"
    });
  }

  getRoom() {
    return this.request({
      action: "getRoom"
    });
  }

  joinRoom(id, password) {
    return this.request({
      action: "joinRoom",
      id: id,
      pass: password || ""
    });
  }

  leaveRoom() {
    return this.request({
      action: "leaveRoom"
    });
  }

  createRoom(name) {
    return this.request({
      action: "createRoom",
      name: name,
      pass: "",
      map: "",
      slots: 4
    });
  }
  /*********************************/
  request(payload) {
    
    console.log("gameClient:request", payload);
    return new Promise((resolve, reject) => {
      this.requestPromiseResolvers[payload.action] = resolve;
      this.requestPromiseRejecters[payload.action] = reject;
      this.connection.send(JSON.stringify(payload));
    }).then();
  }

}

export default gameClient;