import React from 'react';
import { getItemList, postItem, putItem, deleteItem } from '../transfer_api';


var UserItem = React.createClass({
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

var UserList = React.createClass({
	render() {
		var userNodes = this.props.data.map(function(user) {
			return (
				<UserItem 
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
				<table className="table table-hover">
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

var CreateUserForm = React.createClass({
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
		this.setState(this.getInitialState());
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

var UpdateUserForm = React.createClass({
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
			if (id === this.props.data[i].id) {
				return this.props.data[i];
			}
		}
	},
	handleIdChange(e) {
		var item = this.getObjectById(parseInt(e.target.value));
		this.setState({
			id: e.target.value,
			groups: item.groups,
			username: item.username,
			email: item.email,
			first_name: item.first_name,
			last_name: item.last_name,
			url: item.url
		});
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
		this.setState(this.getInitialState());
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

var DeleteUserForm = React.createClass({
	getInitialState() {
		return {id: 0};
	},
	handleIdChange(e) {
		this.setState({id: e.target.value});
	},
	getObjectById(id) {
		for (var i = this.props.data.length - 1; i >= 0; i--) {
			if (id === this.props.data[i].id) {
				return this.props.data[i];
			}
		}
	},
	handleSubmit(e) {
		e.preventDefault();
		var id = parseInt(this.state.id);
		if (!id) {
			return;
		}
		var item = this.getObjectById(id);
		this.props.onDeteleUserSubmit(item);
		this.setState(this.getInitialState());
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

var UserBox = React.createClass({
	getInitialState() {
		return {data: []};
	},
	componentDidMount() {
		if (this.props.isAdminOrManager) {
			getItemList(this);
		}
	},
	handleCreateUserSubmit(user) {
		postItem(this, user);
	},
	handleUpdateUserSubmit(user) {
		putItem(this, user);
	},
	handleDeleteUserSubmit(user) {
		deleteItem(this, user);
	},
	render() {
		if (this.props.isAdminOrManager) {
			return (
				<div role="tabpanel" className="container">
					<ul className="nav nav-tabs" role="tablist">
						<li role="presentation" className="active">
							<a href="#user-box-list" aria-controls="list" role="tab" data-toggle="tab">list</a>
						</li>
						<li role="presentation">
							<a href="#user-box-create" aria-controls="create" role="tab" data-toggle="tab">create</a>
						</li>
						<li role="presentation">
							<a href="#user-box-update" aria-controls="update" role="tab" data-toggle="tab">update</a>
						</li>
						<li role="presentation">
							<a href="#user-box-delete" aria-controls="delete" role="tab" data-toggle="tab">delete</a>
						</li>
					</ul>

					<div className="tab-content">
						<div role="tabpanel" className="tab-pane active" id="user-box-list">
							<UserList data={this.state.data} />
						</div>
						<div role="tabpanel" className="tab-pane" id="user-box-create">
							<CreateUserForm 
								onCreateUserSubmit={this.handleCreateUserSubmit} 
							/>
						</div>
						<div role="tabpanel" className="tab-pane" id="user-box-update">
							<UpdateUserForm 
								data={this.state.data}
								onUpdateUserSubmit={this.handleUpdateUserSubmit} 
							/>
						</div>
						<div role="tabpanel" className="tab-pane" id="user-box-delete">
							<DeleteUserForm
								data={this.state.data}
								onDeteleUserSubmit={this.handleDeleteUserSubmit}
							/>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
});

export default UserBox;
