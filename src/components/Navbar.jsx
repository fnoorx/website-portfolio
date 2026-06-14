import './Navbar.css';

const Navbar = () => {
	const navLinks = [
		{ label: 'Projects', href: '/#projects' },
		{ label: 'Resume', href: '/#resume' },
		{ label: 'Contact', href: '/#contact' },
	];

	return (
		<nav className="navbar">
			<a className="navbar-brand" href="/">
				Faizan
			</a>
			<ul className="navbar-links">
				{navLinks.map((link) => (
					<li key={link.label}>
						<a href={link.href}>{link.label}</a>
					</li>
				))}
			</ul>
		</nav>
  	);
};

export default Navbar;
