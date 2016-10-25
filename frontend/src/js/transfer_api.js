import $ from 'jquery';

export function getItemList(reactObj) {
	$.ajax({
		url: reactObj.props.urlToListAndCreate,
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

export function postItem(reactObj, item) {
	$.ajax({
		url: reactObj.props.urlToListAndCreate,
		type: 'POST',
		dataType: 'json',
		data: item,
		success: function(data) {
			var newData = reactObj.state.data.concat([data]);
			reactObj.setState({data: newData});
		}.bind(reactObj),
		error: function(xhr, status, err) {
			console.log(xhr);
		}.bind(reactObj)
	});
}

export function putItem(reactObj, item) {
	$.ajax({
		url: item.url,
		type: 'PUT',
		dataType: 'json',
		data: item,
		success: function(item) {
			console.log(item);
			var data = reactObj.state.data;
			for (var i = data.length - 1; i >= 0; i--) {
				if (item.id === data[i].id) {
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

export function deleteItem(reactObj, item) {
	var itemId = item.id;
	$.ajax({
		url: item.url,
		type: 'DELETE',
		dataType: 'json',
		data: item,
		success: function(resp_data) {
			var data = reactObj.state.data;
			for (var i = data.length - 1; i >= 0; i--) {
				if (itemId === data[i].id) {
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
