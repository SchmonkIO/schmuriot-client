import React from 'react';
import { Loader as LoaderIcon } from 'react-feather';

import logo from '../images/logo_transparent.png';

const ConnectingView = (props) => {
  return (
		<div className="scene">
			<div className="box">
				<img className="box-logo" src={logo} alt="schmuriot Logo"/>
				<h2>schmuriot</h2>
				<hr />
				<div className="box-content">
					<LoaderIcon className="spin"/>
				</div>
			</div>
		</div>
	);
}

export default ConnectingView;