import React, { Component } from 'react';
import { Loader as LoaderIcon } from 'react-feather';
import RoomListEntry from './RoomListEntry';

class RoomListView extends Component {
  state = {
    rooms: {},
    isLoading: true
  }

  async componentDidMount() {
    let res = await this.props.gameClient.getRooms();
    console.log(res);
    this.setState({
      isLoading: false,
      rooms: res.rooms
    });
  }

  async handleJoinRoom(room) {
    if(room.protected) {
      var password = prompt("Enter the room password:");
    }
    let res = await this.props.gameClient.joinRoom(room.id, password || '');
    this.props.setJoinedHandler(true);
  }

  async createRoom() {
    let name = prompt("Please enter a room name:");
    await this.props.gameClient.createRoom(name);
    this.props.setJoinedHandler(true);
  }

  render() {
    const {isLoading, rooms} = this.state;

    return (
      <div className="roomlist-view">
        <div className="roomlist-box">
          <h2>Shrooms</h2>
          <p>Pick a room to join or create a new one.</p>
          { isLoading ? <span>Loading..</span>: '' }
          {
            Object.keys(rooms).map((roomId, i) =>
              <RoomListEntry room={rooms[roomId]} joinRoomHandler={() => this.handleJoinRoom(rooms[roomId])} />
            )
          }
          <p>Why so schmurios? <a href="#!" onClick={this.createRoom.bind(this)}>Create a new shroom</a></p>
        </div>
      </div>
    )
  }
}

export default RoomListView;
