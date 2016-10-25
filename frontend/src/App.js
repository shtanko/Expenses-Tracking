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
import { urlToGetSelfDataUrl, urlToLogout } from './js/hardcoded_urls'


var App = React.createClass({
	getInitialState() {
		setCSRFTokenInRequestHeader();
		return {
			user: '',
			isAuthenticated: false,
			urlToCurrentUser: '',
			urlToUsers: '',
			urlToExpenses: '',
			groupId: 1
		};
	},
	getUserData(urlToCurrentUserObj) {
		// Attempt to get user object
		var reactObj = this;
		$.get({
			url: urlToCurrentUserObj,
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
						isAuthenticated: true
					});
				}
			}.bind(reactObj),
			error: function(xhr, status, err) {
				console.log(xhr);
			}.bind(reactObj)
		});
	},
	handleSuccessfulLogin(data) {
		// Attempt to get url to the current user object
		var reactObj = this;
		$.get({
			url: urlToGetSelfDataUrl,
			dataType: 'json',
			success: function(data) {
				// If we've got url, next we get attempt to get user object
				if ('url' in data) {
					var urlToUser = data.url;
					reactObj.getUserData(urlToUser);
					reactObj.setState({urlToCurrentUser: urlToUser});
				} else {
					console.log(data);
				}
			},
			error: function(xhr, status, err) {
				console.log(xhr);
			}
		});		
		this.setState({
			urlToExpenses: data.expenses,
			urlToUsers: data.users
		});
	},
	handleAccountUpdate(newUserData) {
		// this.setState({user : newUserData});
		setCSRFTokenInRequestHeader();
		this.setState({
			user: '',
			isAuthenticated: false,
			urlToCurrentUser: '',
			urlToUsers: '',
			urlToExpenses: '',
			groupId: 1
		});
	},
	handleLogout(e) {
		var reactObj = this;
		$.ajax({
			type: 'POST',
			url: urlToLogout,
			success: function(data) {
				setCSRFTokenInRequestHeader();
				reactObj.setState({
					user: '',
					isAuthenticated: false,
					urlToCurrentUser: '',
					urlToUsers: '',
					urlToExpenses: '',
					groupId: 1
				});
			},
			error: function(xhr, str) {
				console.log(xhr);
			}
		});
	},
	render() {
		if (this.state.isAuthenticated) {
			if (this.state.groupId === 1) {
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
									urlToListAndCreate={this.state.urlToExpenses}
								/>
							</div>
						</div>
						<button onClick={this.handleLogout}>Logout</button>
					</div>
				);
			} else if (this.state.groupId === 2) {
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
									urlToListAndCreate={this.state.urlToUsers}
								/>
							</div>
							<div className="container" >
								<ExpenseBox 
									urlToListAndCreate={this.state.urlToExpenses}
								/>
							</div>
						</div>
						<button onClick={this.handleLogout}>Logout</button>
					</div>
				);
			} else if (this.state.groupId === 3) {
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
									urlToListAndCreate={this.state.urlToUsers}
								/>
							</div>
							<div className="container">
								<AdminExpenseBox 
									urlToListAndCreate={this.state.urlToExpenses}
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
