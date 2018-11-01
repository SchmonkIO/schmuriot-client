import PubSub from './pubSub';

class GameClient {
  serverUrl = null;
  pubsub = new PubSub();
  connection = null;

  
  connect(serverUrl) {        
    let connection =  new WebSocket(serverUrl);
    
    connection.onopen = () => this.pubsub.publish('connectionOpen', null);
    connection.onclose = () => this.pubsub.publish('connectionClose', null);
    connection.onerror = (ev) => {
      console.log(ev);
    }

    connection.onmessage = (ev) => {
      let data = JSON.parse(ev.data);
      if(data.status) {
        this.pubsub.publish(data.action + "Success", data);
      } else {
        this.pubsub.publish(data.action + "Error", data);
      }
    } 

    this.connection = connection;
  }

  subscribe(events) {
    Object.keys(events).forEach(event => {
      this.pubsub.subscribe(event, events[event]);
    });
  }

  unsubscribe(events) {
    Object.keys(events).forEach(event => {
      this.pubsub.unsubscribe(event, events[event]);
    });
  }

  send(action, opts) {
    console.log("send::", opts);
    let data = Object.assign({}, {action}, opts);
    this.connection.send(JSON.stringify(data));
  }

}

export default GameClient;