function postExpense(reactObj, expense) {
	$.ajax({
		url: reactObj.props.expensesUrl,
		type: 'POST',
		dataType: 'json',
		data: expense,
		success: function(data) {
			var newData = reactObj.state.data.concat([data]);
			reactObj.setState({data: newData});
		}.bind(reactObj),
		error: function(xhr, status, err) {
			console.log(xhr);
			// console.log(status);
			// console.log(err.toString());
			// console.error(reactObj.props.expensesUrl, status, err.toString());
		}.bind(reactObj)
	});
}

function urlToExpense(expensesUrl, expenseId) {
	return expensesUrl + expenseId + '/'
}

function putExpense(reactObj, expense) {
	var url = urlToExpense(expensesUrl, expense.id)
	console.log(url);
	$.ajax({
		url: url,
		type: 'PUT',
		dataType: 'json',
		data: expense,
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
			// console.log(status);
			// console.log(err.toString());
			// console.error(reactObj.props.expensesUrl, status, err.toString());
		}.bind(reactObj)
	});
}

function getExpenseList(reactObj, expensesUrl) {
	$.ajax({
		url: expensesUrl,
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			reactObj.setState({data: data});
		}.bind(reactObj),
		error: function(xhr, status, err) {
			console.log(xhr);
			// console.log(status);
			// console.log(err.toString());
			// console.error(url_to_expenses, status, err.toString());
		}.bind(reactObj)
	});
}
