import React from 'react';
import $ from 'jquery';
import './App.css';
import setCSRFTokenInRequestHeader from './js/add_csrf_in_request_header';
import LoginForm from './js/users/login';
import RegistrationForm from './js/users/registration';
import CurrentUser from './js/users/current_user';
import UserBox from './js/users/user_box';
import ExpenseBox from './js/expenses/expense_box';
import Navbar from './js/navbar';
import { urlToLogout } from './js/hardcoded_urls'


const user_group_names = {
	// edit key if your group name is not default value
	admin_users: 'admin_users',
	manager_users: 'manager_users',
	regular_users: 'regular_users'
};


var App = React.createClass({
	defaultState() {
		return {
			envArrayOfAccessible: ['home', 'expenses'],
			user: '',
			groups: '',
			isAuthenticated: false,
			isAdmin: false,
			isAdminOrManager: false,
			urlToCurrentUser: '',
			urlToUserList: '',
			urlToExpenseList: '',
			urlToGroups: '',
			groupId: 0
		};
	},
	getInitialState() {
		setCSRFTokenInRequestHeader();
		return this.defaultState();
	},
	setPermissionFlags(currentUserGroupId, userGroups) {
		this.setState({
			isAdmin: currentUserGroupId === userGroups.admin_users,
			isAdminOrManager: (
				(currentUserGroupId === userGroups.admin_users) ||
				(currentUserGroupId === userGroups.manager_users)
			)
		});
		if (this.state.isAdminOrManager) {
			this.state.envArrayOfAccessible.push('users');
		}
	},
	getUser(userGroups) {
		var reactObj = this;
		$.get({
			url: this.state.urlToCurrentUser,
			dataType: 'json',
			success: function(user) {
				var userGroupId = (('groups' in user) ? user.groups[0] : userGroups.regular_users);
				reactObj.setPermissionFlags(userGroupId, userGroups);
				reactObj.setState({
					user: user,
					groupId: userGroupId,
					isAuthenticated: true
				});
			}.bind(reactObj),
			error: function(xhr, status, err) {
				console.log(xhr);
			}.bind(reactObj)
		});
	},
	processRawGroups(raw_groups) {
		var groups = new Object();
		raw_groups.forEach(function(group) {
			// From group.name we'll get back-end user group name.
			// And from user_group_names we'll get same front-end user group name.
			// This mechanism let you easy to use your custom user group name.
			groups[user_group_names[group.name]] = group.id;
		});
		this.setState({groups: groups});
		return groups;
	},
	getGroups() {
		var reactObj = this;
		$.get({
			url: reactObj.state.urlToGroups,
			dataType: 'json',
			success: function(raw_groups) {
				var groups = reactObj.processRawGroups(raw_groups);
				reactObj.getUser(groups);
			}.bind(reactObj),
			error: function(xhr, status, err) {
				console.log(xhr);
			}.bind(reactObj)
		})
	},
	handleSuccessfulLogin(data) {
		this.setState({
			urlToExpenseList: data.expenses,
			urlToUserList: data.users,
			urlToCurrentUser: data.url_to_user_data,
			urlToGroups: data.groups
		});
		this.getGroups();
		// getUser() will run after successful getGroups()
	},
	handleAccountUpdate(newUserData) {
		setCSRFTokenInRequestHeader();
		this.setState(this.defaultState());
	},
	handleLogout(e) {
		var reactObj = this;
		$.ajax({
			type: 'POST',
			url: urlToLogout,
			success: function(data) {
				setCSRFTokenInRequestHeader();
				reactObj.setState(this.defaultState());
			}.bind(reactObj),
			error: function(xhr, str) {
				console.log(xhr);
			}.bind(reactObj)
		});
	},
	render() {
		if (this.state.isAuthenticated) {
			return (
				<div className="container">
					<Navbar
						accessibleEnvs={this.state.envArrayOfAccessible}
						handleLogout={this.handleLogout}
					/>
					<div className="tab-content">
						<div id="main-navbar-home" className="tab-pane in active">
							<CurrentUser
								user={this.state.user}
								onAccountUpdate={this.handleAccountUpdate}
							/>
						</div>
						<div id="main-navbar-users" className="tab-pane">
							<UserBox
								isAdminOrManager={this.state.isAdminOrManager}
								urlToListAndCreate={this.state.urlToUserList}
							/>
						</div>
						<div id="main-navbar-expenses" className="tab-pane">
							<ExpenseBox
								isAdmin={this.state.isAdmin}
								urlToListAndCreate={this.state.urlToExpenseList}
							/>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="container">
					<LoginForm onSuccessfulLogin={this.handleSuccessfulLogin} className="raw" />
					<RegistrationForm className="raw" />
				</div>
			);
		}
	}
});

export default App;
