import React from 'react';
import { getItemList, postItem, putItem, deleteItem } from '../transfer_api';
import CreateExpenseForm from './expense_create'
import UpdateExpenseForm from './expense_update'
import DeleteExpenseForm from './expense_delete'
import ExpenseList from './expense_list'


var ExpenseBox = React.createClass({
	getInitialState() {
		return {data: new Array()};
	},
	componentDidMount() {
		getItemList(this);
	},
	handleCreateExpenseSubmit(expense) {
		postItem(this, expense);
	},
	handleUpdateExpenseSubmit(expense) {
		putItem(this, expense);
	},
	handleDeleteExpenseSubmit(expense) {
		deleteItem(this, expense);
	},
	render() {
		return (
			<div className="container">
				<CreateExpenseForm
					isAdmin={this.props.isAdmin}
					onCreateExpenseSubmit={this.handleCreateExpenseSubmit} 
				/>
				<UpdateExpenseForm 
					isAdmin={this.props.isAdmin}
					data={this.state.data}
					onUpdateExpenseSubmit={this.handleUpdateExpenseSubmit} 
				/>
				<DeleteExpenseForm
					data={this.state.data}
					onDeteleExpenseSubmit={this.handleDeleteExpenseSubmit}
				/>
				<ExpenseList 
					isAdmin={this.props.isAdmin}
					data={this.state.data}
				/>
			</div>
		);
	}
});

export default ExpenseBox;
