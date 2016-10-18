var AdminUserItem = React.createClass({
	render() {
		return (
			<tr>
				<td>{this.props.id}</td>
				<td>{this.props.groups}</td>
				<td>{this.props.username}</td>
				<td>{this.props.email}</td>
				<td>{this.props.first_name}</td>
				<td>{this.props.last_name}</td>
			</tr>
		);
	}
});

var AdminUserList = React.createClass({
	render: function() {
		var userNodes = this.props.data.map(function(user) {
			return (
				<AdminUserItem 
					key={user.id}
					id={user.id}
					groups={user.groups}
					username={user.username} 
					email={user.email} 
					first_name={user.first_name} 
					last_name={user.last_name} 
					url={user.url} 
				/>
			);
		});
		return (
			<div>
				<h3>List of users</h3>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Groups</th>
							<th>Username</th>
							<th>Email</th>
							<th>Frist name</th>
							<th>Last name</th>
						</tr>
					</thead>
					<tbody>
						{userNodes}
					</tbody>
				</table>
			</div>
		);
	}
});

var AdminCreateUserForm = React.createClass({
	getInitialState() {
		return {
			groups: 0,
			username: '',
			password: '',
			email: '',
			first_name: '',
			last_name: ''
		};
	},
	handleGroupsChange(e) {
		this.setState({groups: e.target.value});
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
		var groups = this.state.groups;
		var username = this.state.username.trim();
		var password = this.state.password;
		var email = this.state.email.trim();
		var first_name = this.state.first_name.trim();
		var last_name = this.state.last_name.trim();
		if (!(username && password)) {
			return;
		}
		this.props.onCreateUserSubmit({
			groups: groups,
			username: username,
			password: password,
			email: email,
			first_name: first_name,
			last_name: last_name
		});
		this.setState({
			groups: 0,
			username: '',
			password: '',
			email: '',
			first_name: '',
			last_name: ''
		});
	},
	render() {
		return (
			<div>
				<h3>Create user form</h3>
				<form onSubmit={this.handleSubmit} >
					<input 
						type="number"
						name="groups"
						onChange={this.handleGroupsChange}
						value={this.state.groups}
					/>
					<input 
						type="text" 
						name="username"
						placeholder="Username"
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
						placeholder="Email"
						onChange={this.handleEmailChange}
						value={this.state.email}
					/>
					<input 
						type="text" 
						name="first_name"
						placeholder="First name"
						onChange={this.handleFirstNameChange}
						value={this.state.first_name}
					/>
					<input 
						type="text" 
						name="last_name"
						placeholder="Last name"
						onChange={this.handleLastNameChange}
						value={this.state.last_name}
					/>
					<input type="submit" value="Create user" />
				</form>
			</div>
		);
	}
});

var AdminUpdateUserForm = React.createClass({
	getInitialState() {
		return {
			id: 0,
			groups: 0,
			username: '',
			password: '',
			email: '',
			first_name: '',
			last_name: '',
			url: ''
		};
	},
	getObjectById(id) {
		for (var i = this.props.data.length - 1; i >= 0; i--) {
			if (id == this.props.data[i].id) {
				return this.props.data[i];
			}
		}
	},
	handleIdChange(e) {
		this.setState({id: e.target.value});
		var item = this.getObjectById(e.target.value);
		this.setState({groups: item.groups});
		this.setState({username: item.username});
		this.setState({email: item.email});
		this.setState({first_name: item.first_name});
		this.setState({last_name: item.last_name});
		this.setState({url: item.url});
	},
	handleGroupsChange(e) {
		this.setState({groups: e.target.value});
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
		var groups = this.state.groups;
		var username = this.state.username.trim();
		var password = this.state.password;
		var email = this.state.email.trim();
		var first_name = this.state.first_name.trim();
		var last_name = this.state.last_name.trim();
		var url = this.state.url;
		if (!(username && password)) {
			return;
		}
		this.props.onUpdateUserSubmit({
			groups: groups,
			username: username,
			password: password,
			email: email,
			first_name: first_name,
			last_name: last_name,
			url: url
		});
		this.setState({
			id: 0,
			groups: 0,
			username: '',
			password: '',
			email: '',
			first_name: '',
			last_name: '',
			url: ''
		});
	},
	render() {
		return (
			<div>
				<h3>Update user form</h3>
				<form onSubmit={this.handleSubmit} >
					<input 
						type="number"
						name="id"
						onChange={this.handleIdChange}
						value={this.state.id}
					/>
					<input 
						type="number"
						name="groups"
						onChange={this.handleGroupsChange}
						value={this.state.groups}
					/>
					<input 
						type="text" 
						name="username"
						placeholder="Username"
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
						placeholder="Email"
						onChange={this.handleEmailChange}
						value={this.state.email}
					/>
					<input 
						type="text" 
						name="first_name"
						placeholder="First name"
						onChange={this.handleFirstNameChange}
						value={this.state.first_name}
					/>
					<input 
						type="text" 
						name="last_name"
						placeholder="Last name"
						onChange={this.handleLastNameChange}
						value={this.state.last_name}
					/>
					<input type="submit" value="Update user" />
				</form>
			</div>
		);
	}
});

var AdminDeleteUserForm = React.createClass({
	getInitialState() {
		return {id: 0, url: ''};
	},
	handleIdChange(e) {
		this.setState({id: e.target.value});
	},
	getObjectById(id) {
		for (var i = this.props.data.length - 1; i >= 0; i--) {
			if (id == this.props.data[i].id) {
				return this.props.data[i];
			}
		}
	},
	handleSubmit(e) {
		e.preventDefault();
		var id = this.state.id;
		if (!id) {
			return;
		}
		var item = this.getObjectById(id);
		this.props.onDeteleUserSubmit({id: id, url: item.url});
		this.setState({id: 0, url: ''});
	},
	render() {
		return (
			<div>
				<h3>Delete user form</h3>
				<form onSubmit={this.handleSubmit} >
					<input
						type="number"
						name="id"
						onChange={this.handleIdChange}
						value={this.state.id}
					/>
					<input type="submit" value="Delete user" />
				</form>
			</div>
		);
	}
});

var AdminUserBox = React.createClass({
	getInitialState() {
		return {data: []};
	},
	componentDidMount() {
		getUserList(this, this.props.usersUrl);
	},
	handleCreateUserSubmit(user) {
		postUser(this, user);
	},
	handleUpdateUserSubmit(user) {
		putUser(this, user);
	},
	handleDeleteUserSubmit(user) {
		deleteUser(this, user);
	},
	render: function() {
		return (
			<div>
				<h2>Manage users box</h2>
				<AdminUserList data={this.state.data} />
				<AdminCreateUserForm 
					onCreateUserSubmit={this.handleCreateUserSubmit} 
				/>
				<AdminUpdateUserForm 
					data={this.state.data}
					onUpdateUserSubmit={this.handleUpdateUserSubmit} 
				/>
				<AdminDeleteUserForm
					data={this.state.data}
					onDeteleUserSubmit={this.handleDeleteUserSubmit}
				/>
			</div>
		);
	}
});
