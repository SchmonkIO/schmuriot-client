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

    this.onReadyClick = this.onReadyClick.bind(this);
    this.onLeaveRoomClick = this.onLeaveRoomClick.bind(this);
    this.renderReadyPlayersCount = this.renderReadyPlayersCount.bind(this);
  }

  componentDidMount() {
    this.props.gameClient.registerEventHandlers({
      getRoom: (data) => {
        this.setState({
          isLoading: false,
          room: data.room
        })
      }
    });
  }

  onLeaveRoomClick() {
    this.props.gameClient.leaveRoom();
    this.props.switchViewHandler('roomlist');
  }

  onReadyClick() {
    this.props.gameClient.toggleReady();
    this.setState({
      isReady: !this.state.isReady
    })
  }

  renderReadyPlayersCount() {
    let players = this.rooms.players || {};
    console.log(players);
    return Object.keys(players).filter(playerId => players[playerId].ready).length;
  }

  render() {
    if(this.state.isLoading) {
      return (
        <div className="scene">
          <div className="box">
            <h2>schmuriot</h2>
            <hr />
            <div className="box-content">
              <p>loading room..</p>
            </div>
          </div>
        </div>
      );
    }
    const { id, name, players, owner } = this.state.room;
    return (
      <div className="scene">
        <div className="box">
          <h2>lobby: {name}</h2>
          <hr />
          <div className="box-content">
            <p>there are currectly {Object.keys(players).length} players in this room.</p>
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
            <p>The game will start when all players are ready ({this.renderReadyPlayersCount()} / players.length)</p>
            <a href="#!" onClick={this.onLeaveRoomClick}>this room sucks! Leave</a>
          </div>
        </div>
      </div>
    )
  }
}

export default LobbyView;

