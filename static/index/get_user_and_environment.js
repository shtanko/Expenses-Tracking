var currentUserUrl;

function setUpUserEnvironment(user) {
	$('#user-expenses').css("display", "block");
	$('#list-of-users').css("display", "block");
	if (('groups' in user)) {
		if (user.groups[0] == 3) {
			ReactDOM.render(
				<AdminUserBox urlToListAndCreate={usersUrl} />,
				document.getElementById('list-of-users')
			);
			ReactDOM.render(
				<AdminExpenseBox urlToListAndCreate={expensesUrl} />,
				document.getElementById('user-expenses')
			);
		} else if (user.groups[0] == 2) {
			ReactDOM.render(
				<AdminUserBox urlToListAndCreate={usersUrl} />,
				document.getElementById('list-of-users')
			);
			ReactDOM.render(
				<ExpenseBox urlToListAndCreate={expensesUrl} />,
				document.getElementById('user-expenses')
			);
		}
	} else {
		ReactDOM.render(
			<ExpenseBox urlToListAndCreate={expensesUrl} />,
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