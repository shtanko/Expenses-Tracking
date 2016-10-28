import React from 'react';
import $ from 'jquery';


var CurrentUserBox = React.createClass({
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
			<div>
				<form onSubmit={this.handleSubmit} >
					<table>
						<thead>
							<tr>
								<th>Key</th>
								<th>Value</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Username</td>
								<td>
									<input
										type="text"
										name="username"
										placeholder="Your username"
										onChange={this.handleUsernameChange}
										value={this.state.username}
									/>
								</td>
							</tr>
							<tr>
								<td>Password</td>
								<td>
									<input
										type="password"
										name="password"
										placeholder="Password"
										onChange={this.handlePasswordChange}
										value={this.state.password}
									/>
								</td>
							</tr>
							<tr>
								<td>Email</td>
								<td>
									<input
										type="email"
										name="email"
										placeholder="Your email"
										onChange={this.handleEmailChange}
										value={this.state.email}
									/>
								</td>
							</tr>
							<tr>
								<td>First name</td>
								<td>
									<input
										type="text"
										name="first_name"
										placeholder="Your first name"
										onChange={this.handleFirstNameChange}
										value={this.state.first_name}
									/>
								</td>
							</tr>
							<tr>
								<td>Last name</td>
								<td>
									<input
										type="text"
										name="last_name"
										placeholder="Your username"
										onChange={this.handleLastNameChange}
										value={this.state.last_name}
									/>
								</td>
							</tr>
						</tbody>
					</table>
					<input type="submit" value="Update account" />
				</form>
			</div>
		);
	}
});

export default CurrentUserBox;
