import React from 'react';


var DeleteExpenseForm = React.createClass({
	handleSubmit(e) {
		e.preventDefault();
		this.props.onDeteleExpenseSubmit(this.props.item);
	},
	render() {
		return (
			<div>
				<h2>Are you sure you want to delete this expense?</h2>
				<div>
					{this.props.item.name}
				</div>
				<div>
					{this.props.item.descr}
				</div>
				<div>
					{this.props.item.date}
				</div>
				<div>
					{this.props.item.time}
				</div>
				<form onSubmit={this.handleSubmit} >
					<input type="submit" value="Delete expense" />
				</form>
			</div>
		);
	}
});

export default DeleteExpenseForm;