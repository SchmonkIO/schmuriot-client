import React, { Component } from 'react';
 import { Lock as LockIcon } from 'react-feather';

const RoomListEntry = (props) => {
  const { name, slots, players } = props.room;

  return (
    <div className="roomlist-entry">
      <h4> {name} ({Object.keys(players).length}/{slots}) { props.room.protected ? <LockIcon /> : ''}</h4>
      <button className="outline-button" onClick={props.joinRoomHandler} >Join Room</button>
    </div>
  );
}

export default RoomListEntry;

