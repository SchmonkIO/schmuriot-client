import React, { Component } from 'react';
import { Loader as LoaderIcon } from 'react-feather';
import RoomListEntry from './RoomListEntry';

class RoomListView extends Component {
  state = {
    rooms: {},
    isLoading: true
  }

  componentDidMount() {
    this.props.gameClient.registerEventHandlers({
      getRooms: (rooms) => {
        this.setState({
          isLoading: false,
          rooms: rooms
        })
      }
    });

    this.props.gameClient.getRooms();
  }

  componentWillUnmount() {
    this.props.gameClient.removeEventHandlers(['getRooms']);
  }

  async handleJoinRoom(room) {
    if(room.protected) {
      var password = prompt("enter the rooms password:");
    }
    let res = await this.props.gameClient.joinRoom(room.id, password || '');
    this.props.setJoinedHandler(true);
  }

  async createRoom() {
    let name = prompt("please give your room a name:");
    await this.props.gameClient.createRoom(name);
  }

  render() {
    const {isLoading, rooms} = this.state;

    return (
      <div className="scene">
        <div className="box">
          <h2>rooms</h2>
          <hr />
          <div className="box-content">   
            { isLoading ? <span>Loading..</span>: '' }
            { Object.keys(rooms).length === 0 ? <p>wow, such empty</p> : ''}
            {
              Object.keys(rooms).map((roomId, i) =>
                <RoomListEntry room={rooms[roomId]} joinRoomHandler={() => this.handleJoinRoom(rooms[roomId])} />
              )
            }
            <p>cannot find what you need? <a href="#!" onClick={this.createRoom.bind(this)}>create a new room</a></p>
          </div>
        </div>
      </div>
    )
  }
}

export default RoomListView;

