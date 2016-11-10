import React from 'react';


export const AdminExpenseItem = React.createClass({
	onUpdate(e) {
		e.preventDefault()
		this.props.onUpdateListItem(e.target.value);
	},
	onDelete(e) {
		e.preventDefault()
		this.props.onDeleteListItem(e.target.value);
	},
	render() {
		return (
			<tr>
				<td>
					<button
						name={'admin-expense-list-update-btn' + this.props.id}
						value={this.props.id}
						className="btn btn-default glyphicon glyphicon-pencil"
						onClick={this.onUpdate}
					>
					</button>
				</td>
				<td>{this.props.id}</td>
				<td>{this.props.owner}</td>
				<td>{this.props.name}</td>
				<td>{this.props.descr}</td>
				<td>{this.props.value}</td>
				<td>{this.props.date}</td>
				<td>{this.props.time}</td>
				<td>
					<button 
						value={this.props.id}
						className="btn btn-danger glyphicon glyphicon-trash"
						onClick={this.onDelete}
					>
					</button>
				</td>
			</tr>
		);
	}
});


export const ExpenseItem = React.createClass({
	onUpdate(e) {
		e.preventDefault()
		this.props.onUpdateListItem(e.target.value);
	},
	onDelete(e) {
		e.preventDefault()
		this.props.onDeleteListItem(e.target.value);
	},
	render() {
		return (
			<tr>
				<td>
					<button
						name={'admin-expense-list-update-btn' + this.props.id}
						value={this.props.id}
						className="btn btn-default glyphicon glyphicon-pencil"
						onClick={this.onUpdate}
					>
					</button>
				</td>
				<td>{this.props.id}</td>
				<td>{this.props.name}</td>
				<td>{this.props.descr}</td>
				<td>{this.props.value}</td>
				<td>{this.props.date}</td>
				<td>{this.props.time}</td>
				<td>
					<button 
						value={this.props.id}
						className="btn btn-danger glyphicon glyphicon-trash"
						onClick={this.onDelete}
					>
					</button>
				</td>
			</tr>
		);
	}
});
