setCSRFTokenInRequestHeader();

function hide_reg_show_login_form() {
	document.getElementById('registration-form-container').style.display = "none";
	document.getElementById('login-form-container').style.display = "block";
}

function hide_login_form_show_reg() {
	document.getElementById('login-form-container').style.display = "none";
	document.getElementById('registration-form-container').style.display = "block";
}

function registration_post() {
	var msg = $('#registration-form').serialize();
	$.ajax({
		type: 'POST',
		url: '/users/',
		data: msg,
		success: function(data) {
			if (typeof data === 'object') {
				console.log('Account successfully created.');
				console.log(data);
				$('#state-message').html('Account successfully created. Please, log in.');
				hide_reg_show_login_form();
			} else {
				console.log('Some unnormal errors have been occured. Here is your data:');
				console.log(data);
			}
		},
		error:  function(xhr, str){
			console.log(xhr);
		}
	});
}

function setUpUserExpenses(user) {
	$('#user-expenses').css("display", "block");
	if (('groups' in user) && (user.groups[0] == 3)) {
		ReactDOM.render(
			<AdminExpenseBox get_expenses_url={expenses_url} />,
			document.getElementById('user-expenses')
		);
	} else {
		ReactDOM.render(
			<ExpenseBox get_expenses_url={expenses_url} />,
			document.getElementById('user-expenses')
		);
	}
}

function getUserData(url_to_user) {
	// Attempt to get user object
	console.log(url_to_user)
	var user;
	if (url_to_user !== undefined) {
		$.get({
			url: url_to_user,
			dataType: 'json',
			success: function(user) {
				// If we've got user object, then we can set up this user expenses.
				setUpUserExpenses(user);
			},
			error: function(xhr, status, err) {
				console.log(xhr);
			}
		});
	}
	if (user !== undefined) {
		return user;
	} else {
		return false;
	}
}

function setUpUserData() {
	// Attempt to get url to the current user object
	var url_to_user;
	$.get({
		url: '/users/get_self_url/',
		dataType: 'json',
		success: function(data) {
			// If we've got url, next we get attempt to get user object
			if ('url' in data) {
				getUserData(data.url);
			} else {
				console.log(data);
			}
		},
		error: function(xhr, status, err) {
			console.log(xhr);
		}
	});
	return url_to_user;
}

var users_url;
var expenses_url;

function login_post() {
	var msg = $('#login-form').serialize();
	$.ajax({
		type: 'POST',
		url: '/auth/login/',
		data: msg,
		success: function(data) {
			setCSRFTokenInRequestHeader();
			if (typeof data === 'object') {
				$('#state-message').html('You have been successfully logged in.');
				$('#user-logout').css("display", "block");
				$('#login-form-container').css("display", "none");
				console.log('You have been successfully logged in.');
				console.log(data);
				users_url = data['users'];
				expenses_url = data['expenses'];
				setUpUserData();
			} else {
				console.log('Some unnormal errors have been occured. Here is your data:');
				console.log(data);
			}
		},
		error:  function(xhr, str){
			console.log(xhr);
		}
	});
}

function logout_post() {
	// var msg = $('#logout-form').serialize();
	$.ajax({
		type: 'POST',
		url: '/auth/logout/?next=/',
		// data: msg,
		success: function(data) {
			console.log(data)
			$('#state-message').html('You have been successfully logged out.');
			$('#user-logout').css("display", "none");
			$('#user-expenses').css("display", "none");
			$('#login-form-container').css("display", "block");
		},
		error: function(xhr, str) {
			console.log(xhr);
		}
	});
}
