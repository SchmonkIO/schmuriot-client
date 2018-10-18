import React from 'react';
import { 
	Loader as LoaderIcon,
	ZapOff as ZappOffIcon

} from 'react-feather';

import logo from '../images/logo_transparent.png';

const ConnectingView = (props) => {
  return (
		<div className="scene">
			<div className="box">
				<img className="box-logo" src={logo} alt="schmuriot Logo"/>
				<span className="box-sub">disconnected from Server</span>
				<br/>
				<ZappOffIcon />
			</div>
		</div>
	);
}

export default ConnectingView;