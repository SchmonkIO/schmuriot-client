import React, { Component } from 'react';
import { Loader as LoaderIcon } from 'react-feather';

import logo from '../../images/logo_transparent.png';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      isLoading: false,
      error: null
    }

    this.onChange = this.onChange.bind(this);
    this.onLoginClick = this.onLoginClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.setUserSuccess = this.setUserSuccess.bind(this);
    this.setUserError = this.setUserError.bind(this);
  }

  componentDidMount() {
    this.props.gameClient.subscribe({
      setUserSuccess: this.setUserSuccess,
      setUserError: this.setUserError
    })
  }

  componentWillUnmount() {
    this.props.gameClient.unsubscribe({
      setUserSuccess: this.setUserSuccess,
      setUserError: this.setUserError
    })
  }

  setUserSuccess() {
    this.props.switchViewHandler('roomlist');
  }

  setUserError(res) {
    console.log(res.message);
    this.setState({
      isLoading: false,
      error: res.message
    });
  }

  onChange(ev) {
    this.setState({
      [ev.target.name]: ev.target.value,
      error: false
    });
  }

  onKeyPress(ev) {
    if (ev.key === 'Enter') {
      this.onLoginClick();
    }
  }

  onLoginClick() {
    this.setState({ isLoading: true });
    this.setUser(this.state.name);
  }

  setUser(name) {    
    this.props.gameClient.send("setUser",  {name: name});
  }

  render() {
    const { name, isLoading, error } = this.state;

    return (
      <div className="scene">
        <div className="box">
          <img className="box-logo" src={logo} alt="schmuriot Logo"/>
          <h2>schmuriot</h2>
          <hr />
          <div className="box-content">  
            {
              error 
                ? <div class="alert-error">{error}</div>
                : ''
            }
            <input className="box-input" name="name" placeholder="please enter your name.." value={name} onChange={this.onChange} onKeyPress={this.onKeyPress}/>
            {
              isLoading
              ? <button className="box-button" disabled={true}><LoaderIcon className="spin"/></button>
              : <button className="box-button" onClick={this.onLoginClick} disabled={!name}>enter</button>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default LoginView;

