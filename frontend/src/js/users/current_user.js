import React from 'react';
import $ from 'jquery';
import getFormLegend from '../formLegend'


var CurrentUser = React.createClass({
	statics : {
		formLegend: getFormLegend("Your account", "col-sm-6"),
		submitBnt: (
			<div className="form-group">
				<div className="col-sm-offset-2 col-sm-4">
					<input className="form-control" type="submit" value="Update account" />
				</div>
			</div>
		)
	},
	getInitialState() {
		return  {
			url: '',
			username: '',
			password: '',
			email: '',
			first_name: '',
			last_name: ''
		};
	},
	componentDidMount() {
		this.setState({
			url: this.props.user.url,
			username: this.props.user.username,
			email: this.props.user.email,
			first_name: this.props.user.first_name,
			last_name: this.props.user.last_name
		});
	},
	componentWillReceiveProps(nextProps) {
		this.setState({
			url: nextProps.user.url,
			username: nextProps.user.username,
			email: nextProps.user.email,
			first_name: nextProps.user.first_name,
			last_name: nextProps.user.last_name
		});
	},
	handleUpdateAccountSubmit(newUserData) {
	},
	handleUsernameChange(e) {
		this.setState({username: e.target.value});
	},
	handlePasswordChange(e) {
		this.setState({password: e.target.value});
	},
	handleEmailChange(e) {
		this.setState({email: e.target.value});
	},
	handleFirstNameChange(e) {
		this.setState({first_name: e.target.value});
	},
	handleLastNameChange(e) {
		this.setState({last_name: e.target.value});
	},
	handleSubmit(e) {
		e.preventDefault();
		var user = {
			username: this.state.username.trim(),
			password: this.state.password,
			email: this.state.email.trim(),
			first_name: this.state.first_name.trim(),
			last_name: this.state.last_name.trim(),
		};
		var reactObj = this;
		$.ajax({
			url: reactObj.state.url,
			type: 'PUT',
			dataType: 'json',
			data: user,
			success: function(newUser) {
				reactObj.props.onAccountUpdate(newUser);
			},
			error: function(xhr, status, err) {
				console.log(xhr);
			}
		});
	},
	render() {
		return (
			<div className="container">
				<form onSubmit={this.handleSubmit} className="form-horizontal">
					{this.constructor.formLegend}
					<div className="form-group">
						<label htmlFor="current-user-input-username" className="col-sm-2 control-label">Username</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="current-user-input-username"
								type="text"
								name="username"
								placeholder="Your username"
								onChange={this.handleUsernameChange}
								value={this.state.username}
							/>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="current-user-input-password" className="col-sm-2 control-label">Password</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="current-user-input-password"
								type="password"
								name="password"
								placeholder="Password"
								onChange={this.handlePasswordChange}
								value={this.state.password}
							/>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="current-user-input-email" className="col-sm-2 control-label">Email</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="current-user-input-email"
								type="email"
								name="email"
								placeholder="Your email"
								onChange={this.handleEmailChange}
								value={this.state.email}
							/>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="current-user-input-first-name" className="col-sm-2 control-label">First name</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="current-user-input-first-name"
								type="text"
								name="first_name"
								placeholder="Your first name"
								onChange={this.handleFirstNameChange}
								value={this.state.first_name}
							/>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="current-user-input-last-name" className="col-sm-2 control-label">Last name</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="current-user-input-last-name"
								type="text"
								name="last_name"
								placeholder="Your username"
								onChange={this.handleLastNameChange}
								value={this.state.last_name}
							/>
						</div>
					</div>
					{this.constructor.submitBnt}
				</form>
			</div>
		);
	}
});

export default CurrentUser;
