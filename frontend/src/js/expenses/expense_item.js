import React from 'react';


export const AdminExpenseItem = React.createClass({
	render() {
		return (
			<tr>
				<td>{this.props.id}</td>
				<td>{this.props.owner}</td>
				<td>{this.props.name}</td>
				<td>{this.props.descr}</td>
				<td>{this.props.value}</td>
				<td>{this.props.date}</td>
				<td>{this.props.time}</td>
			</tr>
		);
	}
});


export const ExpenseItem = React.createClass({
	render() {
		return (
			<tr>
				<td>{this.props.id}</td>
				<td>{this.props.name}</td>
				<td>{this.props.descr}</td>
				<td>{this.props.value}</td>
				<td>{this.props.date}</td>
				<td>{this.props.time}</td>
			</tr>
		);
	}
});
