import React from 'react';


var MenuItem = React.createClass({
	handleClick(e) {
		e.preventDefault();
		this.props.onSelect(this.props.name);
	},
	render() {
		return (
			<li className={this.props.active ? 'active' : null}>
				<a href="#" onClick={this.handleClick}>{this.props.name}</a>
			</li>
		);
	}
});



var Menu = React.createClass({
	setActiveItem(item) {
		this.props.onActiveItem(item);
	},
	render() {
		var menuItems = this.props.accessibleEnvs.map(function(item, key) {
			return (
				<MenuItem
					active={this.props.currentEnv === item}
					name={item}
					onSelect={this.setActiveItem}
					key={key}
				/>
			);
		}.bind(this));
		return (
			<ul className="nav navbar-nav">
				{menuItems}
			</ul>
		);
	}
});


var Navbar = React.createClass({
	handleLogout(e) {
		e.preventDefault();
		this.props.handleLogout();
	},
	render() {
		return (
			<div className="container">
				<nav className="navbar navbar-default">
					<div className="container-fluid">
						<div className="navbar-header">
							<button 
								type="button"
								className="navbar-toggle collapsed"
								data-toggle="collapse"
								data-target="#navbar"
								aria-expanded="false"
								aria-controls="navbar"
							>
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							<a className="navbar-brand" href="/index/">Expenses Tracking</a>
						</div>
						<div className="navbar-collapse collapse">
							<Menu
								accessibleEnvs={this.props.accessibleEnvs}
								currentEnv={this.props.currentEnv}
								onActiveItem={this.props.handleEnvChange}
							/>
							<ul className="nav navbar-nav navbar-right">
								<li><a href="#" onClick={this.handleLogout}>Logout</a></li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
		);
	}
});

export default Navbar;
