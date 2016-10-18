var usersUrl;
var expensesUrl;

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
				usersUrl = data['users'];
				expensesUrl = data['expenses'];
				$('#user-data').css("display", "block");
				ReactDOM.render(
					<CurrentUserBox/>,
					document.getElementById('user-data')
				);
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
			$('#user-data').css("display", "none");
			$('#list-of-users').css("display", "none");
			$('#login-form-container').css("display", "block");
		},
		error: function(xhr, str) {
			console.log(xhr);
		}
	});
}
