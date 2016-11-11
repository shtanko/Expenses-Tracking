import React from 'react';
import $ from 'jquery';

import { getItemList, postItem, putItem, deleteItem } from '../transfer_api';
import CreateExpenseForm from './expense_create'
import UpdateExpenseForm from './expense_update'
import DeleteExpenseForm from './expense_delete'
import ExpenseList from './expense_list'


var ExpenseBox = React.createClass({
	getInitialItem() {
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
	getInitialState() {
		return {
			data: [],
			itemToUpdate: this.getInitialItem(),
			itemToDelete: this.getInitialItem()
		};
	},
	getObjectById(id) {
		for (var i = this.state.data.length - 1; i >= 0; i--) {
			if (id === this.state.data[i].id) {
				return this.state.data[i];
			}
		}
	},
	componentDidMount() {
		getItemList(this);
	},
	setNavTabTo(targetName) {
		var activeNavMenuItem = $('ul#expense-box-tablist li.active');
		var activeTab = $(activeNavMenuItem.children('a').attr('href'));
		var targetSelector = 'ul#expense-box-tablist > li > a[href="#expense-box-' + targetName + '"]';
		var targetNavMenuItem = $(targetSelector).parent();
		var targetTab = $(targetNavMenuItem.children('a').attr('href'));
		activeNavMenuItem.removeClass('active');
		activeTab.removeClass('active');
		targetNavMenuItem.addClass('active');
		targetTab.addClass('active');
	},
	handleCreateExpenseSubmit(expense) {
		postItem(this, expense);
		this.setNavTabTo('list');
	},
	handleUpdateExpenseSubmit(expense) {
		putItem(this, expense);
		this.setNavTabTo('list');
		this.setState({itemToUpdate: this.getInitialItem()});
	},
	handleDeleteExpenseSubmit(expense) {
		deleteItem(this, expense);
		this.setNavTabTo('list');
		this.setState({itemToDelete: this.getInitialItem()});
	},
	onUpdateListItem(id) {
		this.setState({itemToUpdate: this.getObjectById(parseInt(id))});
		this.setNavTabTo('update');
	},
	onDeleteListItem(id) {
		this.setState({itemToDelete: this.getObjectById(parseInt(id))});
		this.setNavTabTo('delete');
	},
	render() {
		return (
			<div role="tabpanel" className="container">
				<ul id="expense-box-tablist" className="nav nav-tabs" role="tablist">
					<li role="presentation" className="active">
						<a href="#expense-box-list" aria-controls="list" role="tab" data-toggle="tab">list</a>
					</li>
					<li role="presentation" className="">
						<a href="#expense-box-create" aria-controls="create" role="tab" data-toggle="tab">create</a>
					</li>
					<li role="presentation" className="">
						<a href="#expense-box-update" aria-controls="update" role="tab" data-toggle="tab">update</a>
					</li>
					<li role="presentation" className="">
						<a href="#expense-box-delete" aria-controls="delete" role="tab" data-toggle="tab">delete</a>
					</li>
				</ul>

				<div className="tab-content">
					<div role="tabpanel" className="tab-pane active" id="expense-box-list">
						<ExpenseList 
							isAdmin={this.props.isAdmin}
							onUpdateListItem={this.onUpdateListItem}
							onDeleteListItem={this.onDeleteListItem}
							data={this.state.data}
						/>
					</div>
					<div role="tabpanel" className="tab-pane" id="expense-box-create">
						<CreateExpenseForm
							isAdmin={this.props.isAdmin}
							onCreateExpenseSubmit={this.handleCreateExpenseSubmit} 
						/>
					</div>
					<div role="tabpanel" className="tab-pane" id="expense-box-update">
						<UpdateExpenseForm 
							isAdmin={this.props.isAdmin}
							item={this.state.itemToUpdate}
							onUpdateExpenseSubmit={this.handleUpdateExpenseSubmit} 
						/>
					</div>
					<div role="tabpanel" className="tab-pane" id="expense-box-delete">
						<DeleteExpenseForm
							item={this.state.itemToDelete}
							onDeteleExpenseSubmit={this.handleDeleteExpenseSubmit}
						/>
					</div>
				</div>
			</div>
		);
	}
});

export default ExpenseBox;
