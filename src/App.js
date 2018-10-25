import React, { Component, Fragment } from 'react';
import './App.css';

import ConnectingView from './views/ConnectingView';
import DisconnectedView from './views/DisconnectedView';

import LoginView from './views/Login/LoginView';
import RoomListView from './views/RoomList/RoomListView';
import LobbyView from './views/Lobby/LobbyView';
import PlayView from './views/Play/PlayView';

import gameClient from './lib/gameClient';
const client = new gameClient("wss://schmuriot.fyreek.me/ws"/*wss://schmuriot.fyreek.me/ws"*/)

class App extends Component {
  constructor() {
    super();
    this.state = {
      view: 'login',
      isLoading: true,
      isConnected: false,
   }

   this.handleSwitchView = this.handleSwitchView.bind(this);
  }

  componentDidMount() {
    client.registerEventHandlers({
      onConnect: () => {
        setTimeout(() => {
          this.setState({
            isLoading: false,
            isConnected: true
          });
        }, 800);
      },
      onClose: () => {
        this.setState({
          isLoading: false,
          isConnected: false
        });
      }
      
    });

    client.connect();
  }

  handleSwitchView(view) {
    this.setState({
      view: view
    }); 
  }

  render() {
    
    if(this.state.isLoading) {
      return <ConnectingView />;
    }

    if(!this.state.isConnected) {
      return <DisconnectedView />;
    }

    if(this.state.view === 'login') {
      return <LoginView gameClient={client} switchViewHandler={this.handleSwitchView} />
    }

    if(this.state.view === 'roomlist') {
      return <RoomListView gameClient={client} switchViewHandler={this.handleSwitchView} />;
    }

    if(this.state.view === 'lobby') {
      return <LobbyView gameClient={client} switchViewHandler={this.handleSwitchView} />;
    }
    
    return <PlayView />;    

  }
}

export default App;
