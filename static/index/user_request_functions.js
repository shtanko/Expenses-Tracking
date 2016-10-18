var currentUserUrl;

function setUpUserEnvironment(user) {
	$('#user-expenses').css("display", "block");
	$('#list-of-users').css("display", "block");
	if (('groups' in user)) {
		if (user.groups[0] == 3) {
			ReactDOM.render(
				<AdminUserBox usersUrl={usersUrl} />,
				document.getElementById('list-of-users')
			);
			ReactDOM.render(
				<AdminExpenseBox expensesUrl={expensesUrl} />,
				document.getElementById('user-expenses')
			);
		} else if (user.groups[0] == 2) {
			ReactDOM.render(
				<AdminUserBox usersUrl={usersUrl} />,
				document.getElementById('list-of-users')
			);
			ReactDOM.render(
				<ExpenseBox expensesUrl={expensesUrl} />,
				document.getElementById('user-expenses')
			);
		}
	} else {
		ReactDOM.render(
			<ExpenseBox expensesUrl={expensesUrl} />,
			document.getElementById('user-expenses')
		);
	}
}

function getUserData(reactObj, urlToCurrentUserObj) {
	// Attempt to get user object
	$.get({
		url: urlToCurrentUserObj,
		dataType: 'json',
		success: function(user) {
			reactObj.setState({
				username: user.username,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name
			});
			// If we've got user object, then we can set up this user expenses.
			setUpUserEnvironment(user);
		}.bind(reactObj),
		error: function(xhr, status, err) {
			console.log(xhr);
		}.bind(reactObj)
	});
}

function setUpUserData(reactObj) {
	// Attempt to get url to the current user object
	$.get({
		url: '/users/get_self_url/',
		dataType: 'json',
		success: function(data) {
			console.log(data);
			// If we've got url, next we get attempt to get user object
			if ('url' in data) {
				currentUserUrl = data.url;
				getUserData(reactObj, currentUserUrl);
			} else {
				console.log(data);
			}
		},
		error: function(xhr, status, err) {
			console.log(xhr);
		}
	});
}

function putUser(reactObj, newUserData) {
	$.ajax({
		url: currentUserUrl,
		type: 'PUT',
		dataType: 'json',
		data: newUserData,
		success: function(newUser) {
			reactObj.setState({
				username: newUser.username,
				email: newUser.email,
				first_name: newUser.first_name,
				last_name: newUser.last_name
			});
		},
		error: function(xhr, status, err) {
			console.log(xhr);
		}
	});
}

function getUserList(reactObj, usersUrl) {
	$.ajax({
		url: usersUrl,
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			reactObj.setState({data: data});
		}.bind(reactObj),
		error: function(xhr, status, err) {
			console.log(xhr);
		}.bind(reactObj)
	});
}

function postUser(reactObj, user) {
	$.ajax({
		url: reactObj.props.usersUrl,
		type: 'POST',
		dataType: 'json',
		data: user,
		success: function(data) {
			var newData = reactObj.state.data.concat([data]);
			reactObj.setState({data: newData});
		}.bind(reactObj),
		error: function(xhr, status, err) {
			console.log(xhr);
		}.bind(reactObj)
	});
}

function putUser(reactObj, user) {
	console.log(user)
	$.ajax({
		url: user.url,
		type: 'PUT',
		dataType: 'json',
		data: user,
		success: function(item) {
			console.log(item);
			var data = reactObj.state.data;
			for (var i = data.length - 1; i >= 0; i--) {
				if (item.id == data[i].id) {
					data[i] = item;
					break;
				}
			}
			reactObj.setState({data: data});
		}.bind(reactObj),
		error: function(xhr, status, err) {
			console.log(xhr);
		}.bind(reactObj)
	});
}

function deleteUser(reactObj, user) {
	var itemId = user.id;
	$.ajax({
		url: user.url,
		type: 'DELETE',
		dataType: 'json',
		data: user,
		success: function(data) {
			var data = reactObj.state.data;
			for (var i = data.length - 1; i >= 0; i--) {
				if (itemId == data[i].id) {
					data.splice(i, 1);
					break;
				}
			}
			reactObj.setState({data: data});
		}.bind(reactObj),
		error: function(xhr, status, err) {
			console.log(xhr);
		}.bind(reactObj)
	});
}
