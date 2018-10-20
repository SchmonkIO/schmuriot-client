import React, { Component } from 'react';
import {
  Star as StarIcon 
} from 'react-feather';

class LobbyView extends Component {
  state = {
    room: null,
    isLoading: true
  }
 
  componentDidMount() {
    this.props.gameClient.registerEventHandlers({
      getRoom: (data) => {
        this.setState({
          isLoading: false,
          room: data.room
        })
      },
      //createRoom: (data) => {
      //}
    });
  }

  async leaveRoom() {
    this.props.gameClient.leaveRoom();
    this.props.switchViewHandler('roomlist');
  }

  render() {
    console.log(this.state);
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
              Object.keys(players).map((playerId) => 
                <p>{ playerId === owner ? <StarIcon color="#ffd43b"/>: ''}{players[playerId].name}</p>
              )
            }
            <a href="#!" onClick={this.leaveRoom.bind(this)}>this room sucks! Leave</a>
          </div>
        </div>
      </div>
    )
  }
}

export default LobbyView;

