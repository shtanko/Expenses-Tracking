import React from 'react';
import $ from 'jquery';
import './App.css';
import setCSRFTokenInRequestHeader from './js/add_csrf_in_request_header';
import LoginForm from './js/login';
import RegistrationForm from './js/registration';
import CurrentUserBox from './js/current_user_box';
import AdminUserBox from './js/users_box';
import ExpenseBox from './js/expense_box';
import AdminExpenseBox from './js/admin_expense_box';
import { urlToLogout } from './js/hardcoded_urls'


var App = React.createClass({
	defaultState() {
		return {
			user: '',
			groups: '',
			isAuthenticated: false,
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
	processRawGroups(raw_groups) {
		var groups = new Object();
		raw_groups.forEach(function(group) {
			groups[group.name] = group.id;
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
				this.processRawGroups(raw_groups);
				reactObj.getUser();
			}.bind(reactObj),
			error: function(xhr, status, err) {
				console.log(xhr);
			}.bind(reactObj)
		})
	},
	getUser() {
		var reactObj = this;
		$.get({
			url: this.state.urlToCurrentUser,
			dataType: 'json',
			success: function(user) {
				if ('groups' in user) {
					reactObj.setState({
						user: user,
						isAuthenticated: true,
						groupId: user.groups[0] 
					});
				} else {
					reactObj.setState({
						user: user,
						isAuthenticated: true,
						groupId: this.state.groups.regular_users
					});
				}
			}.bind(reactObj),
			error: function(xhr, status, err) {
				console.log(xhr);
			}.bind(reactObj)
		});
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
			if (this.state.groupId === this.state.groups.regular_users) {
				return (
					<div className="App">
						<div className="container" >
							<CurrentUserBox
								user={this.state.user}
								onAccountUpdate={this.handleAccountUpdate}
								setUpUserPermissions={this.handleUserPermissions}
								setCurrentUserUrl={this.handleCurrentUserUrl}
							/>
							<div className="container" >
								<ExpenseBox 
									urlToListAndCreate={this.state.urlToExpenseList}
								/>
							</div>
						</div>
						<button onClick={this.handleLogout}>Logout</button>
					</div>
				);
			} else if (this.state.groupId === this.state.groups.manager_users) {
				return (
					<div className="App">
						<div className="container" >
							<CurrentUserBox
								user={this.state.user}
								onAccountUpdate={this.handleAccountUpdate}
								setUpUserPermissions={this.handleUserPermissions}
								setCurrentUserUrl={this.handleCurrentUserUrl}
							/>
							<div className="container" >
								<AdminUserBox 
									urlToListAndCreate={this.state.urlToUserList}
								/>
							</div>
							<div className="container" >
								<ExpenseBox 
									urlToListAndCreate={this.state.urlToExpenseList}
								/>
							</div>
						</div>
						<button onClick={this.handleLogout}>Logout</button>
					</div>
				);
			} else if (this.state.groupId === this.state.groups.admin_users) {
				return (
					<div className="App">
						<div className="container">
							<CurrentUserBox
								user={this.state.user}
								onAccountUpdate={this.handleAccountUpdate}
								setUpUserPermissions={this.handleUserPermissions}
								setCurrentUserUrl={this.handleCurrentUserUrl}
							/>
							<div className="container">
								<AdminUserBox 
									urlToListAndCreate={this.state.urlToUserList}
								/>
							</div>
							<div className="container">
								<AdminExpenseBox 
									urlToListAndCreate={this.state.urlToExpenseList}
								/>
							</div>
						</div>
						<button onClick={this.handleLogout}>Logout</button>
					</div>
				);

			}
		} else {
			return (
				<div className="App">
					<div className="container" >
						<RegistrationForm />
						<LoginForm onSuccessfulLogin={this.handleSuccessfulLogin} />
					</div>
					<button onClick={this.handleLogout}>Logout</button>
				</div>
			);
		}
	}
});

export default App;
