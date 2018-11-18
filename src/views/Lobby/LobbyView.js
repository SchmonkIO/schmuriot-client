import React, { Component } from 'react';
import {
  Star as StarIcon, 
  Check as CheckIcon
} from 'react-feather';

class LobbyView extends Component {
  constructor() {
    super();
    this.state = {
      room: null,
      isLoading: true,
      isReady: false
    }

    this.getRoomSuccess = this.getRoomSuccess.bind(this);
    this.leaveRoomSuccess = this.leaveRoomSuccess.bind(this);
    this.onLeaveRoomClick = this.onLeaveRoomClick.bind(this);
    this.startRoundSuccess = this.startRoundSuccess.bind(this);
    this.onReadyClick = this.onReadyClick.bind(this);
  }

  componentDidMount() {
    this.props.gameClient.subscribe({
      getRoomSuccess: this.getRoomSuccess,
      leaveRoomSuccess: this.leaveRoomSuccess,
      startRoundSuccess: this.startRoundSuccess,
    });
  }

  componentWillUnmount() {
    this.props.gameClient.unsubscribe({
      getRoomSuccess: this.getRoomSuccess,
      leaveRoomSuccess: this.leaveRoomSuccess,
      startRoundSuccess: this.startRoundSuccess
    });
  }

  getRoomSuccess(res) {
    this.setState({
      isLoading: false,
      room: res.room
    });
    if(this.getReadyPlayersCount() === this.state.room.slots) {
      this.props.switchViewHandler('play');
    }
  }

  onLeaveRoomClick() {
    this.props.gameClient.send("leaveRoom", {});
  }

  leaveRoomSuccess() {
    this.props.switchViewHandler('roomlist');
  }

  startRoundSuccess() {
    console.log("this was handled to late..shame");
  }

  onReadyClick() {
    this.setState({
      isReady: !this.state.isReady
    });
    this.props.gameClient.send("toggleReady", {});
  }

  getReadyPlayersCount() {
    let players = this.state.room.players || {};
    return Object.keys(players).filter(playerId => players[playerId].ready).length;
  }

  render() {
    if(this.state.isLoading) {
      return (
        <div className="scene">
          <div className="box">
            <h2>lobby</h2>
            <hr />
            <div className="box-content">
              <p>loading room..</p>
            </div>
          </div>
        </div>
      );
    }

    const { name, players, owner, slots } = this.state.room;
    return (
      <div className="scene">
        <div className="box">
          <h2>lobby: {name}</h2>
          <hr />
          <div className="box-content">
            {
              Object.keys(players).length > 1
              ? <p>there are currectly {Object.keys(players).length} players in this room</p>
              : <p>you're currently alone in this room</p>
            }
            {
              Object.keys(players).map((playerId, i) => 
                <p key={i} >
                  { playerId === owner ? <StarIcon color="#ffd43b"/> : '' } 
                  { players[playerId].name }
                  { players[playerId].ready ? <CheckIcon /> : '' }
                </p>
              )
            }
            {
              this.state.isReady 
                ? <button className="outline-button" onClick={this.onReadyClick} >unready</button>
                : <button className="outline-button" onClick={this.onReadyClick} >ready</button>
            }
            <br/>
            {
              this.getReadyPlayersCount() !== slots
              ? <p>the game will start once enough players are ready ({this.getReadyPlayersCount()} / {slots})</p>
              : <p>the game will start now!!</p>
            }
            <a href="#!" onClick={this.onLeaveRoomClick}>i don't like this place! leave</a>
          </div>
        </div>
      </div>
    )
  }
}

export default LobbyView;

