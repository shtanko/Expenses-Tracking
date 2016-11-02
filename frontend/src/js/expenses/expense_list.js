import React from 'react';
import { AdminExpenseItem, ExpenseItem } from './expense_item'


var AdminExpenseList = React.createClass({
	render() {
		var expenseNodes = this.props.data.map(function(expense) {
			return (
				<AdminExpenseItem 
					key={expense.id}
					id={expense.id}
					owner={expense.owner}
					name={expense.name} 
					descr={expense.descr} 
					value={expense.value} 
					date={expense.date} 
					time={expense.time} 
				/>
			);
		});
		return (
			<div>
				<h3>User expenses</h3>
				<table className="table table-hover">
					<thead>
						<tr>
							<th>ID</th>
							<th>Owner</th>
							<th>Name</th>
							<th>Description</th>
							<th>Value</th>
							<th>Date</th>
							<th>Time</th>
						</tr>
					</thead>
					<tbody>
						{expenseNodes}
					</tbody>
				</table>
			</div>
		);
	}
});


var RegularExpenseList = React.createClass({
	render() {
		var expenseNodes = this.props.data.map(function(expense) {
			return (
				<ExpenseItem 
					key={expense.id} 
					id={expense.id} 
					name={expense.name} 
					descr={expense.descr} 
					value={expense.value} 
					date={expense.date} 
					time={expense.time} 
				/>
			);
		});
		return (
			<div>
				<h3>Your expenses</h3>
				<table className="table table-hover">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Description</th>
							<th>Value</th>
							<th>Date</th>
							<th>Time</th>
						</tr>
					</thead>
					<tbody>
						{expenseNodes}
					</tbody>
				</table>
			</div>
		);
	}
});


var ExpenseList = React.createClass({
	render() {
		if (this.props.isAdmin) {
			return (
				<AdminExpenseList
					data={this.props.data}
				/>
			);
		} else {
			return (
				<RegularExpenseList
					data={this.props.data}
				/>
			);
		}
	}
});

export default ExpenseList;
