import React, { Component, Fragment } from 'react';
import './App.css';

import ConnectingView from './views/ConnectingView';
import DisconnectedView from './views/DisconnectedView';

import LoginView from './views/Login/LoginView';
import RoomListView from './views/Rooms/RoomListView';
import CreateRoomView from './views/Rooms/CreateRoomView';
import LobbyView from './views/Lobby/LobbyView';
import PlayView from './views/Play/PlayView';

import GameClient from './lib/gameClient';
const gameClient = new GameClient()

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverUrl: "wss://schmuriot.fyreek.me/ws",
      view: 'login',
      isLoading: true,
      isConnected: false,
      playerName: null,
      playerId: null,
      players: {}
   }

   this.handleSwitchView = this.handleSwitchView.bind(this);
   this.connectionOpen = this.connectionOpen.bind(this);
   this.connectionClose = this.connectionClose.bind(this);
   this.setUserSuccess = this.setUserSuccess.bind(this);
   this.getRoomSuccess = this.getRoomSuccess.bind(this);
  }

  componentDidMount() {
    gameClient.subscribe({
      connectionOpen: this.connectionOpen,
      connectionClose: this.connectionClose,
      setUserSuccess: this.setUserSuccess,
      getRoomSuccess: this.getRoomSuccess
    })

    gameClient.connect(this.state.serverUrl);
  }

  componentWillUnmount() {
    gameClient.unsubscribe({
      connectionOpen: this.connectionOpen,
      connectionClose: this.connectionClose,
      setUserSuccess: this.setUserSuccess,
      getRoomSuccess: this.getRoomSuccess
    })
  }

  connectionOpen() {
    this.setState({
      isLoading: false,
      isConnected: true
    });
  }

  connectionClose() {
    this.setState({
      isLoading: false,
      isConnected: false,
    })
  }

  handleSwitchView(view) {
    this.setState({
      view: view
    }); 
  }


  setUserSuccess(res) {
    this.setState({
      playerId: res.playerid,
      playerName: res.playername
    });
  }

  getRoomSuccess(res) {
    this.setState({
      players: res.room.players
    })
  }


  render() {
    const { isLoading, isConnected, view, playerId, playerName, players } = this.state;

    if(isLoading) {
      return <ConnectingView />;
    }

    if(!isConnected) {
      return <DisconnectedView />;
    }

    if(view === 'login') {
      return <LoginView gameClient={gameClient} switchViewHandler={this.handleSwitchView} />
    }

    if(view === 'roomlist') {
      return <RoomListView gameClient={gameClient} switchViewHandler={this.handleSwitchView} />;
    }

    if(view === 'createroom') {
      return <CreateRoomView gameClient={gameClient} switchViewHandler={this.handleSwitchView} />;
    }

    if(view === 'lobby') {
      return <LobbyView gameClient={gameClient} switchViewHandler={this.handleSwitchView} />;
    }
    
    return <PlayView gameClient={gameClient} switchViewHandler={this.handleSwitchView} lobbyInfo={{playerName, playerId, players}} />;    
  }
}

export default App;
