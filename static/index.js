function hide_reg_show_login_form() {
	document.getElementById('registration-form-container').style.display = "none";
	document.getElementById('login-form-container').style.display = "block";
}

function hide_login_form_show_reg() {
	document.getElementById('login-form-container').style.display = "none";
	document.getElementById('registration-form-container').style.display = "block";
}

function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
	beforeSend: function(xhr, settings) {
		if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
			xhr.setRequestHeader("X-CSRFToken", csrftoken);
		}
	}
});

function registration_post() {
	var msg = $('#registration-form').serialize();
	$.ajax({
		type: 'POST',
		url: '/users/',
		data: msg,
		success: function(data) {
			console.log(data)
			$('#registration-results').html(data);
		},
		error:  function(xhr, str){
			alert('Возникла ошибка: ' + xhr.responseCode);
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
			console.log(data)
			$('#login-results').text(data);
		},
		error:  function(xhr, str){
			alert('Возникла ошибка: ' + xhr.responseCode);
		}
	});
}
