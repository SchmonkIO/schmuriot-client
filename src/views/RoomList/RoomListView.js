import React, { Component } from 'react';
import { Loader as LoaderIcon } from 'react-feather';
import RoomListEntry from './RoomListEntry';

class RoomListView extends Component {
  constructor() {
    super();
    this.state = {
      rooms: {},
      isLoading: true,
      isCreatingRoom: false,
      roomName: null,
      roomPassword: null
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmitCreateRoom = this.onSubmitCreateRoom.bind(this);
  }


  componentDidMount() {
    this.props.gameClient.registerEventHandlers({
      getRooms: (data) => {
        this.setState({
          isLoading: false,
          rooms: data.rooms
        })
      }
    });

    //this.props.gameClient.getRooms();
  }

  componentWillUnmount() {
    this.props.gameClient.removeEventHandlers(['getRooms']);
  }

  onInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleJoinRoom(room) {
    if(room.protected) {
      var password = prompt("enter the rooms password:");
    }
    this.props.gameClient.joinRoom(room.id, password || '');
    this.props.switchViewHandler('lobby');
  }

  onSubmitCreateRoom() {
    if(this.state.roomName) {
      this.props.gameClient.createRoom(this.state.roomName, this.state.roomPassword || '');
      this.props.switchViewHandler('lobby');
    } else {
      alert("please enter room name");
    }
  }

  render() {
    const {isLoading, rooms} = this.state;

    return (
      <div className="scene">
        <div className="box">
          <h2>rooms</h2>
          <hr />
          {
            this.state.isCreatingRoom
            ? <div className="box-content">
                <p>create a room</p>                
                <input className="box-input" name="roomName" placeholder="enter room name.." onChange={this.onInputChange} />
                <input className="box-input" name="roomPassword" placeholder="(optonal) enter password.." onChange={this.onInputChange} />
                <button className="outline-button" onClick={this.onSubmitCreateRoom} >create</button>
                <p>i have no friends who will join me. <a href="#!" onClick={() => this.setState({isCreatingRoom: false})}>back to roomlist</a></p>
              </div>
            : <div className="box-content">   
                { isLoading ? <span>Loading..</span>: '' }
                { Object.keys(rooms).length === 0 ? <p>wow, such empty</p> : <p>join existing room</p>}
                {
                  Object.keys(rooms).map((roomId, i) =>
                    <RoomListEntry room={rooms[roomId]} joinRoomHandler={() => this.handleJoinRoom(rooms[roomId])} />
                  )
                }
                <p>cannot find what you need? <a href="#!" onClick={() => this.setState({isCreatingRoom: true})}>create a new room</a></p>
              </div>
          }
        </div>
      </div>
    )
  }
}

export default RoomListView;

