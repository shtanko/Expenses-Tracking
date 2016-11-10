import React from 'react';


var UpdateExpenseForm = React.createClass({
	getInitialState() {
		return {
			ownerId: 0,
			name: '',
			descr: '',
			value: '',
			date: '',
			time: '',
			url: ''
		};
	},
	componentWillReceiveProps(nextProps) {
		this.setState({
			name: nextProps.item.name,
			descr: nextProps.item.descr,
			value: nextProps.item.value,
			date: nextProps.item.date,
			time: nextProps.item.time,
			url: nextProps.item.url
		});
		if (this.props.isAdmin) {
			this.setState({ownerId: nextProps.item.owner});
		}
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
		var owner = parseInt(this.state.ownerId);
		var name = this.state.name.trim();
		var descr = this.state.descr.trim();
		var date = this.state.date.trim();
		var time = this.state.time.trim();
		var value = this.state.value;
		if (typeof value === 'string') {
			value = value.trim();
		}
		if (!(name && value)) {
			return;
		}
		if (this.props.isAdmin && owner <= 0) {
			return;
		}
		this.props.onUpdateExpenseSubmit({
			owner: owner,
			name: name,
			descr: descr,
			value: value,
			date: date,
			time: time,
			url: this.state.url 
		});
		this.setState(this.getInitialState());
	},
	render() {
		var baseUpdateExpenseInputs = (
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
			<h3>Update expense form</h3>
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
						{baseUpdateExpenseInputs}						
						<input type="submit" value="Update expense" />
					</form>
				</div>
			);
		} else {
			return (
				<div>
					{formHeader}
					<form onSubmit={this.handleSubmit} >
						{baseUpdateExpenseInputs}						
						<input type="submit" value="Update expense" />
					</form>
				</div>
			);
		}
	}
});

export default UpdateExpenseForm;
