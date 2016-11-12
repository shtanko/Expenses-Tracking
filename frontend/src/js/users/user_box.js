import React from 'react';
import $ from 'jquery';
import { getItemList, postItem, putItem, deleteItem } from '../transfer_api';
import getFormLegend from '../formLegend'


var UserItem = React.createClass({
	onUpdate(e) {
		e.preventDefault()
		this.props.onUpdateListItem(e.target.value);
	},
	onDelete(e) {
		e.preventDefault()
		this.props.onDeleteListItem(e.target.value);
	},
	render() {
		return (
			<tr>
				<td>
					<button
						name={'user-list-update-btn-' + this.props.id}
						value={this.props.id}
						className="btn btn-default glyphicon glyphicon-pencil"
						onClick={this.onUpdate}
					>
					</button>
				</td>
				<td>{this.props.id}</td>
				<td>{this.props.groups}</td>
				<td>{this.props.username}</td>
				<td>{this.props.email}</td>
				<td>{this.props.first_name}</td>
				<td>{this.props.last_name}</td>
				<td>
					<button 
						name={'user-list-delete-btn-' + this.props.id}
						value={this.props.id}
						className="btn btn-danger glyphicon glyphicon-trash"
						onClick={this.onDelete}
					>
					</button>
				</td>
			</tr>
		);
	}
});

var UserList = React.createClass({
	render() {
		var reactObj = this;
		var userNodes = this.props.data.map(function(user) {
			return (
				<UserItem 
					onUpdateListItem={reactObj.props.onUpdateListItem}
					onDeleteListItem={reactObj.props.onDeleteListItem}
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
				<table className="table table-hover table-responsive">
					<thead>
						<tr>
							<th></th>
							<th>ID</th>
							<th>Groups</th>
							<th>Username</th>
							<th>Email</th>
							<th>Frist name</th>
							<th>Last name</th>
							<th></th>
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
	statics : {
		formLegend: getFormLegend("Create user", "col-sm-6"),
		submitBnt: (
			<div className="form-group">
				<div className="col-sm-offset-2 col-sm-4">
					<input className="form-control" type="submit" value="Create user" />
				</div>
			</div>
		)
	},
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
			<div className="container">
				<form onSubmit={this.handleSubmit} className="form-horizontal">
					{this.constructor.formLegend}
					<div className="form-group">
						<label 
							htmlFor="user-box-update-user-input-group"
							className="col-sm-2 control-label"
						>Group</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="user-box-update-user-input-group"
								type="number"
								name="groups"
								onChange={this.handleGroupsChange}
								value={this.state.groups}
							/>
						</div>
					</div>
					<div className="form-group">
						<label 
							htmlFor="user-box-update-user-input-username"
							className="col-sm-2 control-label"
						>Username</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="user-box-update-user-input-username"
								type="text"
								name="username"
								placeholder="Your username"
								onChange={this.handleUsernameChange}
								value={this.state.username}
							/>
						</div>
					</div>
					<div className="form-group">
						<label 
							htmlFor="user-box-update-user-input-password"
							className="col-sm-2 control-label"
						>Password</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="user-box-update-user-input-password"
								type="password"
								name="password"
								placeholder="Password"
								onChange={this.handlePasswordChange}
								value={this.state.password}
							/>
						</div>
					</div>
					<div className="form-group">
						<label 
							htmlFor="user-box-update-user-input-email"
							className="col-sm-2 control-label"
						>Email</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="user-box-update-user-input-email"
								type="email"
								name="email"
								placeholder="Your email"
								onChange={this.handleEmailChange}
								value={this.state.email}
							/>
						</div>
					</div>
					<div className="form-group">
						<label 
							htmlFor="user-box-update-user-input-first-name"
							className="col-sm-2 control-label"
						>First name</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="user-box-update-user-input-first-name"
								type="text"
								name="first_name"
								placeholder="Your first name"
								onChange={this.handleFirstNameChange}
								value={this.state.first_name}
							/>
						</div>
					</div>
					<div className="form-group">
						<label 
							htmlFor="user-box-update-user-input-last-name"
							className="col-sm-2 control-label"
						>Last name</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="user-box-update-user-input-last-name"
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

var UpdateUserForm = React.createClass({
	statics : {
		formLegend: getFormLegend("Update user", "col-sm-6"),
		submitBnt: (
			<div className="form-group">
				<div className="col-sm-offset-2 col-sm-4">
					<input className="form-control" type="submit" value="Update user" />
				</div>
			</div>
		)
	},
	getInitialState() {
		return {
			groups: 0,
			username: '',
			password: '',
			email: '',
			first_name: '',
			last_name: '',
			url: ''
		};
	},
	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		this.setState({
			groups: nextProps.item.groups[0],
			username: nextProps.item.username,
			email: nextProps.item.email,
			first_name: nextProps.item.first_name,
			last_name: nextProps.item.last_name,
			url: nextProps.item.url
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
		if (typeof groups === 'string') {
			groups = groups.trim();
		}
		var username = this.state.username.trim();
		var password = this.state.password;
		var email = this.state.email.trim();
		var first_name = this.state.first_name.trim();
		var last_name = this.state.last_name.trim();
		var url = this.state.url;
		if (!(username && password && url) || groups <= 0) {
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
			<div className="container">
				<form onSubmit={this.handleSubmit} className="form-horizontal">
					{this.constructor.formLegend}
					<div className="form-group">
						<label 
							htmlFor="user-box-create-user-input-group"
							className="col-sm-2 control-label"
						>Group</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="user-box-create-user-input-group"
								type="number"
								name="groups"
								onChange={this.handleGroupsChange}
								value={this.state.groups}
							/>
						</div>
					</div>
					<div className="form-group">
						<label 
							htmlFor="user-box-create-user-input-username"
							className="col-sm-2 control-label"
						>Username</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="user-box-create-user-input-username"
								type="text"
								name="username"
								placeholder="Your username"
								onChange={this.handleUsernameChange}
								value={this.state.username}
							/>
						</div>
					</div>
					<div className="form-group">
						<label 
							htmlFor="user-box-create-user-input-password"
							className="col-sm-2 control-label"
						>Password</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="user-box-create-user-input-password"
								type="password"
								name="password"
								placeholder="Password"
								onChange={this.handlePasswordChange}
								value={this.state.password}
							/>
						</div>
					</div>
					<div className="form-group">
						<label 
							htmlFor="user-box-create-user-input-email"
							className="col-sm-2 control-label"
						>Email</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="user-box-create-user-input-email"
								type="email"
								name="email"
								placeholder="Your email"
								onChange={this.handleEmailChange}
								value={this.state.email}
							/>
						</div>
					</div>
					<div className="form-group">
						<label 
							htmlFor="user-box-create-user-input-first-name"
							className="col-sm-2 control-label"
						>First name</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="user-box-create-user-input-first-name"
								type="text"
								name="first_name"
								placeholder="Your first name"
								onChange={this.handleFirstNameChange}
								value={this.state.first_name}
							/>
						</div>
					</div>
					<div className="form-group">
						<label 
							htmlFor="user-box-create-user-input-last-name"
							className="col-sm-2 control-label"
						>Last name</label>
						<div className="col-sm-4">
							<input
								className="form-control"
								id="user-box-create-user-input-last-name"
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

var DeleteUserForm = React.createClass({
	handleSubmit(e) {
		e.preventDefault();
		this.props.onDeteleUserSubmit(this.props.item);
	},
	render() {
		return (
			<div>
				<h2>Are you sure you want to delete this user?</h2>
				<div>
					{this.props.item.username}
				</div>
				<div>
					{this.props.item.email}
				</div>
				<div>
					{this.props.item.first_name}
				</div>
				<div>
					{this.props.item.last_name}
				</div>
				<form onSubmit={this.handleSubmit} >
					<input type="submit" value="Delete user" />
				</form>
			</div>
		);
	}
});

var UserBox = React.createClass({
	getInitialItem() {
		return {
			groups: 0,
			username: '',
			password: '',
			email: '',
			first_name: '',
			last_name: '',
			url: ''
		};
	},
	getInitialState() {
		return {
			data: [],
			itemToUpdate: this.getInitialItem(),
			itemToDelete: this.getInitialItem()
		};
	},
	getObjectById(id) {
		for (var i = this.state.data.length - 1; i >= 0; i--) {
			if (id === this.state.data[i].id) {
				return this.state.data[i];
			}
		}
	},
	setNavTabTo(targetName) {
		var activeNavMenuItem = $('ul#user-box-tablist li.active');
		var activeTab = $(activeNavMenuItem.children('a').attr('href'));
		var targetSelector = 'ul#user-box-tablist > li > a[href="#user-box-' + targetName + '"]';
		var targetNavMenuItem = $(targetSelector).parent();
		var targetTab = $(targetNavMenuItem.children('a').attr('href'));
		activeNavMenuItem.removeClass('active');
		activeTab.removeClass('active');
		targetNavMenuItem.addClass('active');
		targetTab.addClass('active');
	},
	componentDidMount() {
		if (this.props.isAdminOrManager) {
			getItemList(this);
		}
	},
	handleCreateUserSubmit(user) {
		postItem(this, user);
		this.setNavTabTo('list');
	},
	handleUpdateUserSubmit(user) {
		putItem(this, user);
		this.setNavTabTo('list');
		this.setState({itemToUpdate: this.getInitialItem()});
	},
	handleDeleteUserSubmit(user) {
		deleteItem(this, user);
		this.setNavTabTo('list');
		this.setState({itemToDelete: this.getInitialItem()});
	},
	onUpdateListItem(id) {
		this.setState({itemToUpdate: this.getObjectById(parseInt(id))});
		console.log(this.state.itemToUpdate);
		this.setNavTabTo('update');
	},
	onDeleteListItem(id) {
		this.setState({itemToDelete: this.getObjectById(parseInt(id))});
		this.setNavTabTo('delete');
	},
	render() {
		if (this.props.isAdminOrManager) {
			return (
				<div role="tabpanel" className="container">
					<ul id="user-box-tablist" className="nav nav-tabs" role="tablist">
						<li role="presentation" className="active">
							<a href="#user-box-list" aria-controls="list" role="tab" data-toggle="tab">list</a>
						</li>
						<li role="presentation" className="">
							<a href="#user-box-create" aria-controls="create" role="tab" data-toggle="tab">create</a>
						</li>
						<li role="presentation" className="">
							<a href="#user-box-update" aria-controls="update" role="tab" data-toggle="tab">update</a>
						</li>
						<li role="presentation" className="">
							<a href="#user-box-delete" aria-controls="delete" role="tab" data-toggle="tab">delete</a>
						</li>
					</ul>

					<div className="tab-content">
						<div role="tabpanel" className="tab-pane active" id="user-box-list">
							<UserList 
								onUpdateListItem={this.onUpdateListItem}
								onDeleteListItem={this.onDeleteListItem}
								data={this.state.data} 
							/>
						</div>
						<div role="tabpanel" className="tab-pane" id="user-box-create">
							<CreateUserForm 
								onCreateUserSubmit={this.handleCreateUserSubmit} 
							/>
						</div>
						<div role="tabpanel" className="tab-pane" id="user-box-update">
							<UpdateUserForm 
								item={this.state.itemToUpdate}
								onUpdateUserSubmit={this.handleUpdateUserSubmit} 
							/>
						</div>
						<div role="tabpanel" className="tab-pane" id="user-box-delete">
							<DeleteUserForm
								item={this.state.itemToDelete}
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
