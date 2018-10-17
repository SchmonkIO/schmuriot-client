import React, { Component, Fragment } from 'react';
import './App.css';

import LoginView from './views/Login/LoginView';
import RoomListView from './views/RoomList/RoomListView';
import LobbyView from './views/Lobby/LobbyView';
import PlayView from './views/Play/PlayView';

import gameClient from './lib/gameClient';

class App extends Component {
  state = {
    clientId: null,
    joined: false,
    gameClient: new gameClient("ws://172.20.192.217:8080/ws")
 }

  componentDidMount() {
    this.state.gameClient.connect();
  }
  handleSetClientId(clientId) {
    this.setState({
      clientId: clientId
    })
  }
  handleSetJoined(joined) {
    console.log("SET JOINED:", joined);
    this.setState({
      joined: joined
    })
  }

  render() {
    const { clientId, joined } = this.state;

    //return <PlayView/>;

    if(!clientId) {
      return <LoginView gameClient={this.state.gameClient} setClientIdHandler={this.handleSetClientId.bind(this)} />;
    }

    if(joined) {  
      return <LobbyView gameClient={this.state.gameClient} setJoinedHandler={this.handleSetJoined.bind(this)}/>
    }

    return <RoomListView gameClient={this.state.gameClient} clientId={this.state.clientId} setJoinedHandler={this.handleSetJoined.bind(this)} />;
    
  }
}

export default App;
