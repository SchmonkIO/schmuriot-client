class PubSub {
  events = { };

  publish = (event, data) => {
    console.log("response::", event);
    if (this.events[event]) {
      this.events[event].forEach((handler) => {
        handler(data);
      });
    }
  }

  subscribe = (event, handler) => {
    this.events[event] = this.events[event] || [];
    this.events[event].push(handler);
  }

  unsubscribe = (event, handler) => {
    if (this.events[event]) {
      for (var i = 0; i < this.events[event].length; i++) {
        if (this.events[event][i] === handler) {
          this.events[event].splice(i, 1);
          break;
        }
      };
    }
  }

}

export default PubSub;