import React, { Component } from 'react';
import { Loader as LoaderIcon } from 'react-feather';

import logo from '../../images/logo_transparent.png';

class LoginView extends Component {
  constructor() {
    super();
    this.state = {
      name: null,
      isLoading: false,
    }

    this.onNameChange = this.onNameChange.bind(this);
    this.onLoginClick = this.onLoginClick.bind(this);
  }

  onNameChange = e => {
    this.setState({
      name: e.target.value
    });
  }

  onLoginClick = async () => {
    this.setState({isLoading: true});
    let res = await this.props.gameClient.login(this.state.name);
    this.props.setClientIdHandler(res.playerid);
  }

  render() {
    const { name, isLoading } = this.state;

    return (
      <div className="login-view">
        <div className="login-box">
          <img className="login-logo" src={logo} alt="schmuriot Logo"/>
          <span className="login-sub">What's your name?</span>
          <input className="login-input" placeholder="e.g. SchmuriotWarrior99" value={this.state.name} onChange={this.onNameChange} />
          {
            isLoading
            ? <button className="login-button" disabled={true}><LoaderIcon className="spin"/></button>
            : <button className="login-button" onClick={this.onLoginClick} disabled={!this.state.name}>Anmelden</button>
          }
          </div>
      </div>
    )
  }
}

export default LoginView;

