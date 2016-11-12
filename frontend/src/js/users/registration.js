import React from 'react';
import $ from 'jquery';
import { urlToCreateAccount } from '../hardcoded_urls'


var RegistrationForm = React.createClass({
	getInitialState() {
		return {
			username: '',
			email: '',
			password: '',
			first_name: '',
			last_name: ''
		};
	},
	handleUsernameChange(e) {
		this.setState({username: e.target.value});
	},
	handleEmailChange(e) {
		this.setState({email: e.target.value});
	},
	handlePasswordChange(e) {
		this.setState({password: e.target.value});
	},
	handleFirstNameChange(e) {
		this.setState({first_name: e.target.value});
	},
	handleLastNameChange(e) {
		this.setState({last_name: e.target.value});
	},
	handleSubmit(e) {
		e.preventDefault();
		var username = this.state.username.trim();
		var password = this.state.password;
		var email = this.state.email.trim();
		var first_name = this.state.first_name.trim();
		var last_name = this.state.last_name.trim();
		var data = {
			username: username,
			password: password,
			email: email,
			first_name: first_name,
			last_name: last_name
		};
		$.ajax({
			type: 'POST',
			url: urlToCreateAccount,
			data: data,
			success: function(data) {
				if (typeof data === 'object') {
					console.log('Account successfully created.');
					console.log(data);
				} else {
					console.log('Some unnormal errors have been occured. Here is your data:');
					console.log(data);
				}
			},
			error:  function(xhr, str){
				console.log(xhr);
			}
		});
		this.setState(this.getInitialState());
	},
	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit} >
					<legend>Registration Form</legend>
					<div className="form-group">
						<input 
							className="form-control"
							placeholder="Username" 
							name="username" 
							value={this.state.username} 
							type="text"
							onChange={this.handleUsernameChange}
						/>
					</div>
					<div className="form-group">
						<input 
							className="form-control"
							placeholder="Email" 
							name="email" 
							value={this.state.email} 
							type="email"
							onChange={this.handleEmailChange}
						/>
					</div>
					<div className="form-group">
						<input 
							className="form-control"
							placeholder="Password" 
							name="password" 
							value={this.state.password} 
							type="password"
							onChange={this.handlePasswordChange}
						/>
					</div>
					<div className="form-group">
						<input 
							className="form-control"
							placeholder="First name" 
							name="first_name" 
							value={this.state.first_name} 
							type="text"
							onChange={this.handleFirstNameChange}
						/>
					</div>
					<div className="form-group">
						<input 
							className="form-control"
							placeholder="Last name" 
							name="last_name" 
							value={this.state.last_name} 
							type="text"
							onChange={this.handleLastNameChange}
						/>
					</div>
					<div className="form-group">
						<input className="form-control" value="Send" type="submit"/>
					</div>
				</form>
			</div>
		);
	}
});

export default RegistrationForm;