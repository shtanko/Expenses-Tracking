var UpdateCurrentUserDataForm = React.createClass({
	getInitialState() {
		return {
			username: this.props.user.username, 
			password: '',
			email: this.props.user.email, 
			first_name: this.props.user.first_name,
			last_name: this.props.user.last_name
		};
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
		var username = this.state.username.trim();
		var password = this.state.password;
		var email = this.state.email.trim();
		var first_name = this.state.first_name.trim();
		var last_name = this.state.last_name.trim();
		this.props.onUpdateAccountSubmit({
			username: username,
			password: password,
			email: email,
			first_name: first_name,
			last_name: last_name
		});
	},
	render() {
		return (
			<div>
				<h3>Update account data form</h3>
				<form onSubmit={this.handleSubmit} >
					<input 
						type="text" 
						name="username" 
						placeholder="Your username"
						onChange={this.handleUsernameChange}
						value={this.state.username}
					/>
					<input 
						type="password" 
						name="password" 
						placeholder="Password"
						onChange={this.handlePasswordChange}
						value={this.state.password}
					/>
					<input 
						type="email" 
						name="email" 
						placeholder="Your email"
						onChange={this.handleEmailChange}
						value={this.state.email}
					/>
					<input 
						type="text" 
						name="first_name" 
						placeholder="Your first name"
						onChange={this.handleFirstNameChange}
						value={this.state.first_name}
					/>
					<input 
						type="text" 
						name="last_name" 
						placeholder="Your username"
						onChange={this.handleLastNameChange}
						value={this.state.last_name}
					/>
					<input type="submit" value="Update account" />
				</form>
			</div>
		);
	}
});


var CurrentUserData = React.createClass({
	render() {
		return (
			<div>
				<h3>Your account data</h3>
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
							<td>{this.props.user.username}</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>{this.props.user.email}</td>
						</tr>
						<tr>
							<td>First name</td>
							<td>{this.props.user.first_name}</td>
						</tr>
						<tr>
							<td>Last name</td>
							<td>{this.props.user.last_name}</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
});

var CurrentUserBox = React.createClass({
	getInitialState() {
		return {
			username: '',
			password: '',
			email: '',
			first_name: '',
			last_name: ''
		};
	},
	componentDidMount() {
		setUpUserData(this);
	},
	handleUpdateAccountSubmit(newUserData) {
		putUser(this, newUserData);
	},
	render() {
		var user = {
			username: this.state.username,
			password: this.state.password,
			email: this.state.email,
			first_name: this.state.first_name,
			last_name: this.state.last_name
		};
		return (
			<div>
				<CurrentUserData user={user} />
				<UpdateCurrentUserDataForm 
					user={user}
					onUpdateAccountSubmit={this.handleUpdateAccountSubmit}
					/>
			</div>
		);
	}
});
