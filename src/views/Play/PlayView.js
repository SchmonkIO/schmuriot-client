import React, { Component, Fragment } from 'react';

import {
  Star as StarIcon,
  User as UserIcon,
  Loader as LoaderIcon
} from 'react-feather';

class PlayView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerId: this.props.lobbyInfo.playerId,
      playerName: this.props.lobbyInfo.playerName,
      players: this.props.lobbyInfo.players,
      status: 0,
      countdown: 15,
      game: {}
    }

    this.countdownInterval = null;
    this.startRoundSuccess = this.startRoundSuccess.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
  }

  
  componentDidMount() {
    this.props.gameClient.subscribe({
      startRoundSuccess: this.startRoundSuccess
    });
  }

  componentWillUnmount() {
    this.props.gameClient.unsubscribe({
      startRoundSuccess: this.startRoundSuccess
    });
  }

  startRoundSuccess(res) {
    console.log(res);
    this.setState({
      game: res.game
    });

    if(this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.startCountdown(res.game.countdown);
  }
  
  startCountdown(from) {
    this.setState({
      countdown: from
    })

    this.countdownInterval = setInterval(() => {
      this.setState({
        countdown: this.state.countdown -1
      });
    }, 1000)
  }


  render() {
    const { countdown, playerId, players } = this.state;
    const { currentRound, rounds, fields } = this.state.game;

    if(!fields) {
      return (
        <div className="scene">
          <LoaderIcon className="spin"/>
        </div>
      );
    }

    return(
      <div className="scene">
        <div className="play-box">
          <div className="play-header">
            <div>
              <h2>round {currentRound}/{rounds}</h2>
              {
                countdown > 0 
                ? <p>choose your move wisely.. {countdown}</p>
                : <p>you loose</p>
              }
            </div>
            <div className="play-scoreboard">          
              <b className="centered">scores</b>
              <span>1) Player #2: 20 Münzen</span>
              <span>2) Player #1: 12 Münzen</span>
              <span>3) Player #3: 5 Münzen</span>
              <span>4) Player #4: 0 Münzen</span>
            </div>
          </div>
          <div className="play-scene">
              {
                fields.map((rows) => 
                  <div className="play-scene-col">
                    { rows.map((cell) => 
                      <div className={"play-scene-cell " + (cell.player === playerId ? ' play-cell-reachable' : '')}>
                        <div className="play-scene-cell-box">
                          { 
                            cell.coins 
                            ? new Array(cell.coins).fill("_").map((_, i) => 
                                <StarIcon />
                              )          
                            : <span><UserIcon />{ players[cell.player].name }</span>                
                          }
                        </div>
                      </div>
                      )
                    }
                  </div>
                )

              }
          </div>          
        </div>
      </div>
    )
  }  
}

export default PlayView;
