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


var Navbar = React.createClass({
	setActiveMenuItem(item) {
		this.props.handleEnvChange(item);
	},
	handleLogout(e) {
		e.preventDefault();
		this.props.handleLogout();
	},
	render() {
		var menuItems = this.props.accessibleEnvs.map(function(item, key) {
			return (
				<MenuItem
					active={this.props.currentEnv === item}
					name={item}
					onSelect={this.setActiveMenuItem}
					key={key}
				/>
			);
		}.bind(this));
		return (
			<div className="container">
				<nav className="navbar navbar-default">
					<div className="container-fluid">
						<div className="navbar-header">
							<button 
								type="button"
								className="navbar-toggle collapsed"
								data-toggle="collapse"
								data-target="#my-322-custom-navbar-yay"
								aria-expanded="false"
							>
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							<a className="navbar-brand" href="/index/">Expenses Tracking</a>
						</div>
						<div 
							id="my-322-custom-navbar-yay" 
							className="navbar-collapse collapse"
						>
							<ul className="nav navbar-nav">
								{menuItems}
							</ul>
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
