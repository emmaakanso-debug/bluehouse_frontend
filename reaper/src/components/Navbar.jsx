import { NavLink } from 'react-router-dom'

function Navbar() {
	return (
		<header className="site-header">
			<nav className="navbar container" aria-label="Main navigation">
				<NavLink className="brand" to="/" aria-label="Reaper home">
					REAPER<span>.</span>
				</NavLink>
				<div className="nav-links">
					<NavLink to="/">Home</NavLink>
					<NavLink to="/about">About</NavLink>
					<NavLink to="/products">Products</NavLink>
					<NavLink to="/contact">Contact</NavLink>
				</div>
				<NavLink className="nav-button" to="/contact">
					Start a project <span aria-hidden="true">-&gt;</span>
				</NavLink>
			</nav>
		</header>
	)
}

export default Navbar
