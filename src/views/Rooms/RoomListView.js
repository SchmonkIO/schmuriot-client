import React, { Component } from 'react';
import { Loader as LoaderIcon } from 'react-feather';
import RoomListEntry from './RoomListEntry';
import doggo from './../../images/doggo.png';


class RoomListView extends Component {
  constructor() {
    super();
    this.state = {
      rooms: {},
      isLoading: true,
      error: null
    }

    this.getRoomsSuccess = this.getRoomsSuccess.bind(this);
    this.joinRoomSuccess = this.joinRoomSuccess.bind(this);
    this.joinRoomError = this.joinRoomError.bind(this);
    this.createRoomClick = this.createRoomClick.bind(this);
  }

  componentDidMount() {
    this.props.gameClient.subscribe({
      getRoomsSuccess: this.getRoomsSuccess,
      joinRoomSuccess: this.joinRoomSuccess,
      joinRoomError: this.joinRoomError
    });
  }

  componentWillUnmount() {
    this.props.gameClient.unsubscribe({
      getRoomsSuccess: this.getRoomsSuccess,
      joinRoomSuccess: this.joinRoomSuccess,
      joinRoomError: this.joinRoomError
    });
  }

  onInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  getRoomsSuccess(res) {
    this.setState({
      isLoading: false,
      rooms: res.rooms
    });
  }

  joinRoomSuccess() {
    this.props.switchViewHandler('lobby');
  }

  joinRoomError(res) {
    console.log(res);
    this.setState({
      error: res.message
    })
  }
  
  handleJoinRoom(room) {
    if(room.protected) {
      var password = prompt("enter room password:");
    }
    this.props.gameClient.send("joinRoom", {id:  room.id, password: password || null});
  }

  createRoomClick() {
    this.props.switchViewHandler('createroom');
  }

  render() {
    const {isLoading, rooms, error} = this.state;

    return (
      <div className="scene">
        <div className="box">
          <h2>rooms</h2>
          <hr />
          <div className="box-content">   
            {
              error 
                ? <div class="alert-error">{error}</div>
                : ''
            }
            { isLoading 
              ? <LoaderIcon className="spin"/>
              : Object.keys(rooms).length === 0 
                ? <div className="center-content">
                    <img src={doggo} alt="doggo" height="64px" width="64px"/>
                    <p>wow, such empty</p>
                  </div>
                : <p>we found {Object.keys(rooms).length} rooms</p>             
            }
            {
              Object.keys(rooms).map((roomId, i) =>
                <RoomListEntry room={rooms[roomId]} joinRoomHandler={() => this.handleJoinRoom(rooms[roomId])} />
              )
             }
            <p>cannot find what you need? <a href="#!" onClick={this.createRoomClick}>create a new room</a></p>
          </div>
        </div>
      </div>
    )
  }
}

export default RoomListView;

