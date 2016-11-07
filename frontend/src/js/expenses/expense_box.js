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
			<div role="tabpanel" className="container">
				<ul className="nav nav-tabs" role="tablist">
					<li role="presentation" className="active">
						<a href="#expense-box-list" aria-controls="list" role="tab" data-toggle="tab">list</a>
					</li>
					<li role="presentation">
						<a href="#expense-box-create" aria-controls="create" role="tab" data-toggle="tab">create</a>
					</li>
					<li role="presentation">
						<a href="#expense-box-update" aria-controls="update" role="tab" data-toggle="tab">update</a>
					</li>
					<li role="presentation">
						<a href="#expense-box-delete" aria-controls="delete" role="tab" data-toggle="tab">delete</a>
					</li>
				</ul>

				<div className="tab-content">
					<div role="tabpanel" className="tab-pane active" id="expense-box-list">
						<ExpenseList 
							isAdmin={this.props.isAdmin}
							data={this.state.data}
						/>
					</div>
					<div role="tabpanel" className="tab-pane" id="expense-box-create">
						<CreateExpenseForm
							isAdmin={this.props.isAdmin}
							onCreateExpenseSubmit={this.handleCreateExpenseSubmit} 
						/>
					</div>
					<div role="tabpanel" className="tab-pane" id="expense-box-update">
						<UpdateExpenseForm 
							isAdmin={this.props.isAdmin}
							data={this.state.data}
							onUpdateExpenseSubmit={this.handleUpdateExpenseSubmit} 
						/>
					</div>
					<div role="tabpanel" className="tab-pane" id="expense-box-delete">
						<DeleteExpenseForm
							data={this.state.data}
							onDeteleExpenseSubmit={this.handleDeleteExpenseSubmit}
						/>
					</div>
				</div>
			</div>
		);
	}
});

export default ExpenseBox;
