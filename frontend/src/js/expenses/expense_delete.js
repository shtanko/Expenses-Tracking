import React from 'react';


var DeleteExpenseForm = React.createClass({
	getInitialState() {
		return {id: 0};
	},
	handleIdChange(e) {
		this.setState({id: e.target.value});
	},
	getObjectById(id) {
		for (var i = this.props.data.length - 1; i >= 0; i--) {
			if (id === this.props.data[i].id) {
				return this.props.data[i];
			}
		}
	},
	handleSubmit(e) {
		e.preventDefault();
		var id = parseInt(this.state.id);
		if (!id) {
			return;
		}
		var item = this.getObjectById(id);
		this.props.onDeteleExpenseSubmit(item);
		this.setState(this.getInitialState());
	},
	render() {
		return (
			<div>
				<h3>Delete expense form</h3>
				<form onSubmit={this.handleSubmit} >
					<input
						type="number"
						name="id"
						onChange={this.handleIdChange}
						value={this.state.id}
					/>
					<input type="submit" value="Delete expense" />
				</form>
			</div>
		);
	}
});

export default DeleteExpenseForm;