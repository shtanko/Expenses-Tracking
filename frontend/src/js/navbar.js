import React from 'react';


var MenuItem = React.createClass({
	render() {
		return (
			<li className={this.props.active ? 'active' : null}>
				<a href={"#main-navbar-" + this.props.name} data-toggle="tab">
					{this.props.name}
				</a>
			</li>
		);
	}
});


var Navbar = React.createClass({
	handleLogout(e) {
		e.preventDefault();
		this.props.handleLogout();
	},
	render() {
		var menuItems = this.props.accessibleEnvs.map(function(item, key) {
			var isActive = true;
			if (key === 0) {
				isActive = true;
			} else {
				isActive = false;
			}
			return (
				<MenuItem
					active={isActive}
					name={item}
					key={key}
				/>
			);
		}.bind(this));
		return (
			<div className="container">
				<nav className="navbar navbar-default" role="navigation">
					<div className="container-fluid">
						<div className="navbar-header">
							<button 
								type="button"
								className="navbar-toggle collapsed"
								data-toggle="collapse"
								data-target="#main-navbar-menu"
								aria-expanded="false"
							>
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							<a className="navbar-brand" href="/index/">Expenses Tracking</a>
						</div>
						<div id="main-navbar-menu" className="navbar-collapse collapse">
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
