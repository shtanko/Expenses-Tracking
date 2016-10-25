import React from 'react';
import { getItemList, postItem, putItem, deleteItem } from './transfer_api';


var AdminExpenseItem = React.createClass({
	render() {
		return (
			<tr>
				<td>{this.props.id}</td>
				<td>{this.props.owner}</td>
				<td>{this.props.name}</td>
				<td>{this.props.descr}</td>
				<td>{this.props.value}</td>
				<td>{this.props.created}</td>
			</tr>
		);
	}
});

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
					created={expense.created} 
				/>
			);
		});
		return (
			<div>
				<h3>User expenses</h3>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Owner</th>
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

var AdminCreateExpenseForm = React.createClass({
	getInitialState() {
		return {owner: 0, name: '', descr: '', value: ''};
	},
	handleOwnerChange(e) {
		this.setState({owner: e.target.value});
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
		var owner = this.state.owner;
		var name = this.state.name.trim();
		var descr = this.state.descr.trim();
		var value = this.state.value.trim();
		if (!(owner && name && value)) {
			return;
		}
		this.props.onCreateExpenseSubmit({
			owner: owner,
			name: name,
			descr: descr,
			value: value
		});
		this.setState({owner: 0, name: '', descr: '', value: ''});
	},
	render() {
		return (
			<div>
				<h3>Create expense form</h3>
				<form onSubmit={this.handleSubmit} >
					<input 
						type="number"
						name="owner"
						onChange={this.handleOwnerChange}
						value={this.state.owner}
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
					<input type="submit" value="Create expense" />
				</form>
			</div>
		);
	}
});

var AdminUpdateExpenseForm = React.createClass({
	getInitialState() {
		return {id: 0, owner: 0, name: '', descr: '', value: ''};
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
		this.setState({owner: item.owner});
		this.setState({name: item.name});
		this.setState({descr: item.descr});
		this.setState({value: item.value});
	},
	handleOwnerChange(e) {
		this.setState({owner: e.target.value});
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
		var owner = this.state.owner;
		var name = this.state.name.trim();
		var descr = this.state.descr.trim();
		var value = this.state.value.trim();
		if (!(id && owner && name && value)) {
			return;
		}
		this.props.onUpdateExpenseSubmit({
			id: id,
			owner: owner,
			name: name,
			descr: descr,
			value: value
		});
		this.setState({id: 0, owner: 0, name: '', descr: '', value: ''});
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
						type="number"
						name="owner"
						onChange={this.handleOwnerChange}
						value={this.state.owner}
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
					<input type="submit" value="Create expense" />
				</form>
			</div>
		);
	}
});

var AdminDeleteExpenseForm = React.createClass({
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

var AdminExpenseBox = React.createClass({
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
				<AdminExpenseList data={this.state.data} />
				<AdminCreateExpenseForm 
					onCreateExpenseSubmit={this.handleCreateExpenseSubmit} 
				/>
				<AdminUpdateExpenseForm 
					data={this.state.data}
					onUpdateExpenseSubmit={this.handleUpdateExpenseSubmit} 
				/>
				<AdminDeleteExpenseForm
					onDeteleExpenseSubmit={this.handleDeleteExpenseSubmit}
				/>
			</div>
		);
	}
});

export default AdminExpenseBox;
