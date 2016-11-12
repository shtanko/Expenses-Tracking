import React from 'react';
import getFormLegend from '../formLegend'


var CreateExpenseForm = React.createClass({
	statics : {
		formLegend: getFormLegend("Create expense", "col-sm-6"),
		submitBnt: (
			<div className="form-group">
				<div className="col-sm-offset-2 col-sm-4">
					<input className="form-control" type="submit" value="Create expense" />
				</div>
			</div>
		)
	},
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
				<div className="form-group">
					<label 
						htmlFor="expense-box-create-expense-input-name"
						className="col-sm-2 control-label"
					>Name</label>
					<div className="col-sm-4">
						<input
							className="form-control"
							id="expense-box-create-expense-input-name"
							type="text"
							name="name"
							placeholder="Expense short name"
							onChange={this.handleNameChange}
							value={this.state.name}
						/>
					</div>
				</div>
				<div className="form-group">
					<label 
						htmlFor="expense-box-create-expense-input-description"
						className="col-sm-2 control-label"
					>Description</label>
					<div className="col-sm-4">
						<input
							className="form-control"
							id="expense-box-create-expense-input-description"
							type="text"
							name="descr"
							placeholder="Expense long description"
							onChange={this.handleDescriptionChange}
							value={this.state.descr}
						/>
					</div>
				</div>
				<div className="form-group">
					<label 
						htmlFor="expense-box-create-expense-input-value"
						className="col-sm-2 control-label"
					>Value</label>
					<div className="col-sm-4">
						<input
							className="form-control"
							id="expense-box-create-expense-input-value"
							type="text"
							name="value"
							placeholder="Value"
							onChange={this.handleValueChange}
							value={this.state.value}
						/>
					</div>
				</div>
				<div className="form-group">
					<label 
						htmlFor="expense-box-create-expense-input-date"
						className="col-sm-2 control-label"
					>Date</label>
					<div className="col-sm-4">
						<input
							className="form-control"
							id="expense-box-create-expense-input-date"
							type="date"
							name="date"
							placeholder="Date"
							onChange={this.handleDateChange}
							value={this.state.date}
						/>
					</div>
				</div>
				<div className="form-group">
					<label 
						htmlFor="expense-box-create-expense-input-time"
						className="col-sm-2 control-label"
					>Time</label>
					<div className="col-sm-4">
						<input
							className="form-control"
							id="expense-box-create-expense-input-time"
							type="time"
							name="time"
							placeholder="Time"
							onChange={this.handleTimeChange}
							value={this.state.time}
						/>
					</div>
				</div>
			</div>
		);
		if (this.props.isAdmin) {
			return (
				<div className="container">
					<form onSubmit={this.handleSubmit} className="form-horizontal">
						{this.constructor.formLegend}
						<div className="form-group">
							<label 
								htmlFor="expense-box-create-expense-input-owner-id"
								className="col-sm-2 control-label"
							>Owner ID</label>
							<div className="col-sm-4">
								<input
									className="form-control"
									id="expense-box-create-expense-input-owner-id"
									type="number"
									name="ownerId"
									onChange={this.handleOwnerChange}
									value={this.state.ownerId}
								/>
							</div>
						</div>
						{baseCreateExpenseInputs}
						{this.constructor.submitBnt}
					</form>
				</div>
			);
		} else {
			return (
				<div className="container">
					<form onSubmit={this.handleSubmit} className="form-horizontal">
						{this.constructor.formLegend}
						{baseCreateExpenseInputs}						
						{this.constructor.submitBnt}
					</form>
				</div>
			);
		}
	}
});

export default CreateExpenseForm;
