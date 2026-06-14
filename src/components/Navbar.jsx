import './Navbar.css';

const Navbar = () => {
	const navLinks = ['Projects', 'Resume', 'Contact'];

	return (
		<nav className="navbar">
			<a className="navbar-brand" href="/">
				Faizan
			</a>
			<ul className="navbar-links">
				{navLinks.map((link) => (
					<li key={link}>
					<a href={`#${link.toLowerCase()}`}>{link}</a>
					</li>
				))}
			</ul>
		</nav>
  	);
};

export default Navbar;
