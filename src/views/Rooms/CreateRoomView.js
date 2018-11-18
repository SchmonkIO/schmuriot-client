import React, { Component } from 'react';
import { Loader as LoaderIcon } from 'react-feather';
import RoomListEntry from './RoomListEntry';
import doggo from './../../images/doggo.png';


class CreateRoomView extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      error: null,
      roomName: '',
      roomPassword: ''
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.createRoomSuccess = this.createRoomSuccess.bind(this);
    this.createRoomError = this.createRoomError.bind(this);
    this.handleCreateRoomSubmit = this.handleCreateRoomSubmit.bind(this);
    this.backToRoomListClick = this.backToRoomListClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    this.props.gameClient.subscribe({
      createRoomSuccess: this.createRoomSuccess,
      createRoomError: this.createRoomError
    });
  }

  componentWillUnmount() {
    this.props.gameClient.unsubscribe({
      createRoomSuccess: this.createRoomSuccess,
      createRoomError: this.createRoomError
    });
  }

  onInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onKeyPress(ev) {
    if (ev.key === 'Enter') {
      this.handleCreateRoomSubmit();
    }
  }

  createRoomSuccess() {
    this.props.switchViewHandler("lobby");
  }

  createRoomError(res) {
    console.log(res);
    this.setState({
      isLoading: false,
      error: res.message
    })
  }


  handleCreateRoomSubmit() {
    this.setState({
      isLoading: true
    })
    this.props.gameClient.send("createRoom", {name: this.state.roomName, password: this.state.roomPassword});
  }

  backToRoomListClick() {
    this.props.gameClient.send("getRooms", {});
    this.props.switchViewHandler('roomlist');
  }

  render() {
    const {error, isLoading, roomName, roomPassword} = this.state;

    return (
      <div className="scene">
        <div className="box">
          <h2>create a room</h2>
          <hr />
          <div className="box-content">  
            {
              error 
                ? <div class="alert-error">{error}</div>
                : ''
            }
            <p>please enter room information</p>
            <input type="text" className="box-input" name="roomName" placeholder="room name.." value={roomName} onChange={this.onInputChange} onKeyPress={this.onKeyPress} />
            <input type="password" className="box-input" name="roomPassword" placeholder="room password (optional).." value={roomPassword} onChange={this.onInputChange} onKeyPress={this.onKeyPress}/>
            {
              isLoading
              ? <button className="box-button" disabled={true}><LoaderIcon className="spin"/></button>
              : <button className="box-button" onClick={this.handleCreateRoomSubmit} disabled={!roomName}>create room</button>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default CreateRoomView;

