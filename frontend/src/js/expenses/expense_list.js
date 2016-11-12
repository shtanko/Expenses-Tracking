import React from 'react';
import { AdminExpenseItem, ExpenseItem } from './expense_item'


var ExpenseList = React.createClass({
	statics: {
		adminTableHead: (
			<tr>
				<th></th>
				<th>ID</th>
				<th>Owner</th>
				<th>Name</th>
				<th>Description</th>
				<th>Value</th>
				<th>Date</th>
				<th>Time</th>
				<th></th>
			</tr>
		),
		regularTableHead: (
			<tr>
				<th></th>
				<th>ID</th>
				<th>Name</th>
				<th>Description</th>
				<th>Value</th>
				<th>Date</th>
				<th>Time</th>
				<th></th>
			</tr>
		)
	},
	getInitialState() {
		return {
			expenseNodes: false,
			tableHead: false
		};
	},
	setStateInstances(props) {
		var reactObj = this;
		var expenseNodes;
		var tableHead;
		if (props.isAdmin) {
			tableHead = this.constructor.adminTableHead;
			expenseNodes = props.data.map(function(expense) {
				return (
					<AdminExpenseItem
						onUpdateListItem={reactObj.props.onUpdateListItem}
						onDeleteListItem={reactObj.props.onDeleteListItem}
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
		} else {
			tableHead = this.constructor.regularTableHead;
			expenseNodes = props.data.map(function(expense) {
				return (
					<ExpenseItem 
						onUpdateListItem={reactObj.props.onUpdateListItem}
						onDeleteListItem={reactObj.props.onDeleteListItem}
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
		}
		this.setState({
			tableHead: tableHead,
			expenseNodes: expenseNodes
		});
	},
	componentDidMount() {
		this.setStateInstances(this.props);
	},
	componentWillReceiveProps(nextProps) {
		this.setStateInstances(nextProps);
	},
	render() {
		return (
			<div>
				<table className="table table-hover table-responsive">
					<thead>
						{this.state.tableHead}
					</thead>
					<tbody>
						{this.state.expenseNodes}
					</tbody>
				</table>
			</div>
		);
	}
});

export default ExpenseList;
