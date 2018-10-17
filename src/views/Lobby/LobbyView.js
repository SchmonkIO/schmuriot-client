import React, { Component } from 'react';

class LobbyView extends Component {
  state = {
    room: null,
    isLoading: true
  }
 
  async componentDidMount() {
    this.update();
  }
  async update() {
    let res = await this.props.gameClient.getRoom();
    console.log(res);
    this.setState({
      isLoading: false,
      room: res.room
    });
  }
  async leaveRoom() {
    let res = await this.props.gameClient.leaveRoom();
    this.props.setJoinedHandler(false);
  }

  render() {
    if(this.state.isLoading) {
      return (
        <div className="roomlist-view">
          <div className="roomlist-box">
            <h2>Loading Lobby..</h2>
          </div>
        </div>
      );
    }
    const { id, name, players } = this.state.room;
    return (
      <div className="roomlist-view">
        <div className="roomlist-box">
          <h2>Lobby: {name}</h2>
          <p>There are currectly {Object.keys(players).length} players in this room.</p>
          {
            Object.keys(players).map((playerId) => 
              <p>{players[playerId].name}</p>
            )
          }
          <a href="#!" onClick={this.leaveRoom.bind(this)}>This room sucks! Leave</a>
        </div>
      </div>
    )
  }
}

export default LobbyView;

