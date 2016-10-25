import React from 'react';
import $ from 'jquery';
import setCSRFTokenInRequestHeader from './add_csrf_in_request_header';
import { urlToLogin } from './hardcoded_urls'


var LoginForm = React.createClass({
	getInitialState() {
		return {
			username: '',
			password: '',
		};
	},
	handleUsernameChange(e) {
		this.setState({username: e.target.value});
	},
	handlePasswordChange(e) {
		this.setState({password: e.target.value});
	},
	handleSubmit(e) {
		e.preventDefault();
		var username = this.state.username.trim();
		var password = this.state.password;
		var data = {
			username: username,
			password: password
		};
		setCSRFTokenInRequestHeader();
		var reactObj = this;
		$.ajax({
			type: 'POST',
			url: urlToLogin,
			data: data,
			success: function(data) {
				if (typeof data === 'object') {
					console.log('You are successfully logged in.');
					console.log(data);
					reactObj.props.onSuccessfulLogin(data);
				} else {
					console.log('Some unnormal errors have been occured. Here is your data:');
					console.log(data);
				}
			},
			error:  function(xhr, str){
				console.log(xhr);
			}
		});
	},
	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit} >
					<legend>Login Form</legend>
					<div>
						<input 
							placeholder="Username" 
							name="username" 
							value={this.state.username} 
							type="text"
							onChange={this.handleUsernameChange}
						/>
					</div>
					<div>
						<input 
							placeholder="Password" 
							name="password" 
							value={this.state.password} 
							type="password"
							onChange={this.handlePasswordChange}
						/>
					</div>
					<input value="Send" type="submit"/>
				</form>
			</div>
		);
	}
});

export default LoginForm;