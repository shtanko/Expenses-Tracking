function postExpense(react_obj, expense) {
	$.ajax({
		url: react_obj.props.get_expenses_url,
		type: 'POST',
		dataType: 'json',
		data: expense,
		success: function(data) {
			console.log(data);
			var newData = react_obj.state.data.concat([data]);
			react_obj.setState({data: newData});
		}.bind(react_obj),
		error: function(xhr, status, err) {
			console.log(xhr);
			// console.log(status);
			// console.log(err.toString());
			// console.error(react_obj.props.get_expenses_url, status, err.toString());
		}.bind(react_obj)
	});
}

function getExpenseList(react_obj, url_to_expenses) {
	$.ajax({
		url: url_to_expenses,
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			react_obj.setState({data: data});
		}.bind(react_obj),
		error: function(xhr, status, err) {
			console.log(xhr);
			// console.log(status);
			// console.log(err.toString());
			// console.error(url_to_expenses, status, err.toString());
		}.bind(react_obj)
	});
}

var ExpenseItem = React.createClass({
	render: function() {
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
	render: function() {
		console.log(this.props.data);
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

var ExpenseBox = React.createClass({
	getInitialState() {
		return {data: []};
	},
	componentDidMount() {
		getExpenseList(this, this.props.get_expenses_url);
	},
	handleCreateExpenseSubmit(expense) {
		postExpense(this, expense);
	},
	render: function() {
		return (
			<div>
				<CreateExpenseForm 
					onCreateExpenseSubmit={this.handleCreateExpenseSubmit} 
				/>
				<ExpenseList data={this.state.data} />
			</div>
		);
	}
});


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
	render: function() {
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
		if (!owner || !name || !value) {
			return;
		}
		this.props.onCreateExpenseSubmit({
			owner: owner,
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

var AdminExpenseBox = React.createClass({
	getInitialState() {
		return {data: []};
	},
	componentDidMount() {
		getExpenseList(this, this.props.get_expenses_url);
	},
	handleCreateExpenseSubmit(expense) {
		postExpense(this, expense);
		getExpenseList(this, this.props.get_expenses_url)
	},
	render: function() {
		return (
			<div>
				<AdminCreateExpenseForm 
					onCreateExpenseSubmit={this.handleCreateExpenseSubmit} 
				/>
				<AdminExpenseList data={this.state.data} />
			</div>
		);
	}
});
