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
      game: {},
      scores: {}
    }

    this.countdownInterval = null;
    this.startRoundSuccess = this.startRoundSuccess.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.makeMove = this.makeMove.bind(this);
    this.renderPlayerScores = this.renderPlayerScores.bind(this);
    this.coinResultSuccess = this.coinResultSuccess.bind(this);
  }

  
  componentDidMount() {
    this.props.gameClient.subscribe({
      startRoundSuccess: this.startRoundSuccess,
      coinResultSuccess: this.coinResultSuccess
    });
  }

  componentWillUnmount() {
    this.props.gameClient.unsubscribe({
      startRoundSuccess: this.startRoundSuccess,
      coinResultSuccess: this.coinResultSuccess
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

  coinResultSuccess(res) {
    this.setState({
      scores: res.coins
    });
  }

  makeMove(field) {
    this.props.gameClient.send("makeMove", {move: field});
  }

  renderPlayerScores() {
    let { scores, players } = this.state;
    let entrys = [];

    let sortedPlayerIds = Object.keys(scores).sort((a,b) => scores[a]-scores[b]).reverse() || [];
    sortedPlayerIds.forEach(playerId => {
      entrys.push({
        name: players[playerId].name,
        score: scores[playerId]
      })
    });

    Object.keys(players).forEach(playerId => {
      if(!sortedPlayerIds.includes(playerId)) {
        entrys.push({
          name: players[playerId].name,
          score: 0
        });
      }
    });

    return entrys.map((entry, i) =>
      <span>{i+1}.) {entry.name}: {entry.score} coins</span>
    )
  }

  render() {
    const { countdown, playerId, players, scores } = this.state;
    const { currentRound, rounds, fields, canReach } = this.state.game;

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
                ? <p>choose your move wisely.. {countdown} seconds remaining</p>
                : <p>prepare for next round..</p>
              }
            </div>
            <div className="play-scoreboard">          
              <b className="centered">scores</b>
                {this.renderPlayerScores()}
            </div>
          </div>
          <div className="play-scene">
              {
                fields.map((rows,i) => 
                  <div key={"f"+i} className="play-scene-col">
                    {
                      rows.map((cell,ii) => 
                        cell.player === playerId 
                        ? <div key={"c"+ii} className="play-scene-cell play-cell-localplayer">
                            <div className="play-scene-cell-box">
                              <span><UserIcon />{ players[cell.player].name }</span>  
                            </div>
                          </div> 
                        : canReach[playerId].includes(i*3+ii+1)
                          ? <div key={"c"+ii} className="play-scene-cell play-cell-reachable">
                              <div className="play-scene-cell-box clickable" onClick={() => this.makeMove(i*3+ii+1)}>
                                {
                                  new Array(cell.coins).fill("_").map((_, i) => 
                                    <StarIcon key={"s"+i}/>
                                  )
                                }
                              </div>
                            </div> 
                          : <div key={"c"+ii} className="play-scene-cell">
                              <div className="play-scene-cell-box not-clickable">
                                { 
                                  cell.player
                                  ? <span><UserIcon />{ players[cell.player].name }</span>                
                                  : new Array(cell.coins).fill("_").map((_, i) => 
                                      <StarIcon key={"ss"+i}/>
                                    )  
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
