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

  componentDidMount() {
    this.props.gameClient.registerEventHandlers({
      setUser: () => {
        this.props.switchViewHandler('roomlist');
      }
    });
  }

  onNameChange = e => {
    this.setState({
      name: e.target.value
    });
  }

  onKeyPress = e => {
    if (e.key === 'Enter') {
      this.onLoginClick();
    }
  }

  onLoginClick = async () => {
    this.setState({isLoading: true});
    await this.props.gameClient.login(this.state.name);
  }

  render() {
    const { name, isLoading } = this.state;

    return (
      <div className="scene">
        <div className="box">
          <img className="box-logo" src={logo} alt="schmuriot Logo"/>
          <h2>schmuriot</h2>
          <hr />
          <div className="box-content">          
            <input className="box-input" placeholder="please enter your name.." value={this.state.name} onChange={this.onNameChange} onKeyPress={this.onKeyPress}/>
            {
              isLoading
              ? <button className="box-button" disabled={true}><LoaderIcon className="spin"/></button>
              : <button className="box-button" onClick={this.onLoginClick} disabled={!this.state.name}>enter</button>
            }
            </div>
          </div>
      </div>
    )
  }
}

export default LoginView;

