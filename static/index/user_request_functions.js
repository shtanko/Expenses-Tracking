var currentUserUrl;

function setUpUserExpenses(user) {
	$('#user-expenses').css("display", "block");
	if (('groups' in user) && (user.groups[0] == 3)) {
		ReactDOM.render(
			<AdminExpenseBox expensesUrl={expensesUrl} />,
			document.getElementById('user-expenses')
		);
	} else {
		ReactDOM.render(
			<ExpenseBox expensesUrl={expensesUrl} />,
			document.getElementById('user-expenses')
		);
	}
}

function getUserData(reactObj, urlToCurrentUserObj) {
	// Attempt to get user object
	if (urlToCurrentUserObj !== undefined) {
		$.get({
			url: urlToCurrentUserObj,
			dataType: 'json',
			success: function(user) {
				reactObj.setState({
					username: user.username,
					email: user.email,
					first_name: user.first_name,
					last_name: user.last_name
				});				// If we've got user object, then we can set up this user expenses.
				setUpUserExpenses(user);
			}.bind(reactObj),
			error: function(xhr, status, err) {
				console.log(xhr);
			}.bind(reactObj)
		});
	}
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