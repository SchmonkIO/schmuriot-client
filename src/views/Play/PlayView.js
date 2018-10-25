import React, { Component, Fragment } from 'react';

import {
  Star as StarIcon,
  User as UserIcon
} from 'react-feather';

class PlayView extends Component {
  state = {
    status: 0,
    countdown: 15,
    fields: [
      [
        {
          id: 0,
          coins: 3,
          canReach: true
        },
        {
          id: 1,
          player: "Player #1"
        },
        {
          id: 2,
          coins: 4
        } 
      ], 
      [
        {
          id: 1,
          player: "-- ME --"
        },
        {
          id: 2,
          coins: 4,
          canReach: true
        },
        {
          id: 1,
          player: "Player #3"
        },
      ], 
      [
        {
          id: 0,
          coins: 3,
          canReach: true
        },
        {
          id: 1,
          player: "Player #4"
        },
        {
          id: 2,
          coins: 4
        } 
      ], 
    ]
  }
  
  componentDidMount() {
    setInterval(() => {
      let num = this.state.countdown -1;
      this.setState({
        countdown: num ? num : 16,
        status: num? 0 : 1 
      })
    }, 1000)
  }

  render() {
    const { status, fields, countdown } = this.state;

    return(
      <div className="scene">
        <div className="play-box">
          <div className="play-header">
            <div>
              <h2>Runde #1</h2>
              {
                status === 0 
                ? <p>Zug wählen.. {countdown}</p>
                : <p>Du hast verloren</p>
              }
            </div>
            <div className="play-scoreboard">          
              <b className="centered">Scoreboard:</b>
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
                      <div className={"play-scene-cell " + (cell.canReach ? ' play-cell-reachable' : '')}>
                        <div className="play-scene-cell-box">
                          { 
                            cell.coins 
                            ? new Array(cell.coins).fill("_").map((_, i) => 
                                <StarIcon />
                              )          
                            : <span><UserIcon />{ cell.player }</span>                
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
