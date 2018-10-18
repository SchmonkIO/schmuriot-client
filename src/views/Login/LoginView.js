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
          <span className="box-sub">What's your name?</span>
          <input className="box-input" placeholder="e.g. SchmuriotWarrior99" value={this.state.name} onChange={this.onNameChange} />
          {
            isLoading
            ? <button className="box-button" disabled={true}><LoaderIcon className="spin"/></button>
            : <button className="box-button" onClick={this.onLoginClick} disabled={!this.state.name}>Enter</button>
          }
          </div>
      </div>
    )
  }
}

export default LoginView;

