import React from 'react';


var CreateExpenseForm = React.createClass({
	getInitialState() {
		return {
			ownerId: 0,
			name: '',
			descr: '',
			value: '',
			date: '',
			time: ''
		};
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
	handleDateChange(e) {
		this.setState({date: e.target.value});
	},
	handleTimeChange(e) {
		this.setState({time: e.target.value});
	},
	handleOwnerChange(e) {
		this.setState({ownerId: e.target.value});
	},
	handleSubmit(e) {
		e.preventDefault();
		var name = this.state.name.trim();
		var descr = this.state.descr.trim();
		var value = this.state.value.trim();
		var date = this.state.date.trim();
		var time = this.state.time.trim();
		if (!(name && value)) {
			return;
		}
		this.props.onCreateExpenseSubmit({
			owner: parseInt(this.state.ownerId),
			name: name,
			descr: descr,
			value: value,
			date: date,
			time: time
		});
		this.setState(this.getInitialState());
	},
	render() {
		var baseCreateExpenseInputs = (
			<div>
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
				<input 
					type="date"
					name="date"
					placeholder="Date"
					onChange={this.handleDateChange}
					value={this.state.date}
				/>
				<input 
					type="time"
					name="time"
					placeholder="Time"
					onChange={this.handleTimeChange}
					value={this.state.time}
				/>
			</div>
		);
		var formHeader = (
			<h3>Create expense form</h3>
		);
		if (this.props.isAdmin) {
			return (
				<div>
					{formHeader}
					<form onSubmit={this.handleSubmit} >
						<div>
							<input 
								type="number"
								name="ownerId"
								onChange={this.handleOwnerChange}
								value={this.state.ownerId}
							/>
						</div>
						{baseCreateExpenseInputs}						
						<input type="submit" value="Create expense" />
					</form>
				</div>
			);
		} else {
			return (
				<div>
					{formHeader}
					<form onSubmit={this.handleSubmit} >
						{baseCreateExpenseInputs}						
						<input type="submit" value="Create expense" />
					</form>
				</div>
			);
		}
	}
});

export default CreateExpenseForm;
