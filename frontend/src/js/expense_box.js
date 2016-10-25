import React from 'react';
import { getItemList, postItem, putItem, deleteItem } from './transfer_api';
import { cropServerUrl } from '../App';


var ExpenseItem = React.createClass({
	render() {
		return (
			<tr>
				<td>{this.props.id}</td>
				<td>{this.props.name}</td>
				<td>{this.props.descr}</td>
				<td>{this.props.value}</td>
				<td>{this.props.created}</td>
			</tr>
		);
	}
});

var ExpenseList = React.createClass({
	render() {
		var expenseNodes = this.props.data.map(function(expense) {
			return (
				<ExpenseItem 
					key={expense.id} 
					id={expense.id} 
					name={expense.name} 
					descr={expense.descr} 
					value={expense.value} 
					created={expense.created} 
				/>
			);
		});
		return (
			<div>
				<h3>Your expenses</h3>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Description</th>
							<th>Value</th>
							<th>Date</th>
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

var CreateExpenseForm = React.createClass({
	getInitialState() {
		return {name: '', descr: '', value: ''};
	},
	handleNameChange(e) {
		this.setState({name: e.target.value});
	},
	handleDescriptionChange(e) {
		this.setState({descr: e.target.value});
	},
	handleValueChange(e) {
		this.setState({value: e.target.value});
	},
	handleSubmit(e) {
		e.preventDefault();
		var name = this.state.name.trim();
		var descr = this.state.descr.trim();
		var value = this.state.value.trim();
		if (!name || !value) {
			return;
		}
		this.props.onCreateExpenseSubmit({
			name: name,
			descr: descr,
			value: value
		});
		this.setState({name: '', descr: '', value: ''});
	},
	render() {
		return (
			<div>
				<h3>Create expense form</h3>
				<form onSubmit={this.handleSubmit} >
					<input 
						type="text" 
						name="name" 
						placeholder="Expense short name"
						onChange={this.handleNameChange}
						value={this.state.name}
					/>
					<input 
						type="text" 
						name="descr" 
						placeholder="Expense long description"
						onChange={this.handleDescriptionChange}
						value={this.state.descr}
					/>
					<input 
						type="text" 
						name="value" 
						placeholder="Value"
						onChange={this.handleValueChange}
						value={this.state.value}
					/>
					<input type="submit" value="Create expense" />
				</form>
			</div>
		);
	}
});

var UpdateExpenseForm = React.createClass({
	getInitialState() {
		return {id: 0, name: '', descr: '', value: ''};
	},
	getObjectById(id) {
		for (var i = this.props.data.length - 1; i >= 0; i--) {
			if (id === this.props.data[i].id) {
				return this.props.data[i];
			}
		}
	},
	handleIdChange(e) {
		this.setState({id: e.target.value});
		var item = this.getObjectById(e.target.value);
		this.setState({name: item.name});
		this.setState({descr: item.descr});
		this.setState({value: item.value});
	},
	handleNameChange(e) {
		this.setState({name: e.target.value});
	},
	handleDescriptionChange(e) {
		this.setState({descr: e.target.value});
	},
	handleValueChange(e) {
		this.setState({value: e.target.value});
	},
	handleSubmit(e) {
		e.preventDefault();
		var id = this.state.id;
		var name = this.state.name.trim();
		var descr = this.state.descr.trim();
		var value = this.state.value.trim();
		if (!(id && name && value)) {
			return;
		}
		this.props.onUpdateExpenseSubmit({
			id: id,
			name: name,
			descr: descr,
			value: value
		});
		this.setState({id: 0, name: '', descr: '', value: ''});
	},
	render() {
		return (
			<div>
				<h3>Update expense form</h3>
				<form onSubmit={this.handleSubmit} >
					<input 
						type="number" 
						name="id" 
						onChange={this.handleIdChange}
						value={this.state.id}
					/>
					<input 
						type="text" 
						name="name" 
						placeholder="Expense short name"
						onChange={this.handleNameChange}
						value={this.state.name}
					/>
					<input 
						type="text" 
						name="descr" 
						placeholder="Expense long description"
						onChange={this.handleDescriptionChange}
						value={this.state.descr}
					/>
					<input 
						type="text" 
						name="value" 
						placeholder="Value"
						onChange={this.handleValueChange}
						value={this.state.value}
					/>
					<input type="submit" value="Update expense" />
				</form>
			</div>
		);
	}
});

var DeleteExpenseForm = React.createClass({
	getInitialState() {
		return {id: 0};
	},
	handleIdChange(e) {
		this.setState({id: e.target.value});
	},
	handleSubmit(e) {
		e.preventDefault();
		var id = this.state.id;
		if (!id) {
			return;
		}
		this.props.onDeteleExpenseSubmit({id: id});
		this.setState({id: 0});
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

var ExpenseBox = React.createClass({
	getInitialState() {
		return {data: []};
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
			<div>
				<CreateExpenseForm 
					onCreateExpenseSubmit={this.handleCreateExpenseSubmit} 
				/>
				<UpdateExpenseForm 
					data={this.state.data}
					onUpdateExpenseSubmit={this.handleUpdateExpenseSubmit} 
				/>
				<DeleteExpenseForm
					onDeteleExpenseSubmit={this.handleDeleteExpenseSubmit}
				/>
				<ExpenseList data={this.state.data} />
			</div>
		);
	}
});

export default ExpenseBox;
