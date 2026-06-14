import './ProjectLinks.css';

const projects = [
	{
		title: 'Product Scraper',
		href: '/product-scraper',
		description:
			'Write a short description here: what it scrapes, why it matters, and what you built.',
		videoSrc: '',
	},
	{
		title: 'Market Data Bot',
		href: '/market-data-bot',
		description:
			'Write a short description here: what data it tracks, what the bot does, and the result.',
		videoSrc: '',
	},
];

const ProjectLinks = () => {
	return (
		<section className="project-links" id="projects">
			<div className="project-links-heading">
				<p>Selected Work</p>
				<h2>Projects worth opening.</h2>
			</div>

			<div className="project-links-grid">
				{projects.map((project) => (
					<a className="project-link-card" href={project.href} key={project.title}>
						<div className="project-video-frame">
							{project.videoSrc ? (
								<video autoPlay loop muted playsInline src={project.videoSrc} />
							) : (
								<span>Autoplay video area</span>
							)}
						</div>
						<div className="project-link-copy">
							<h3>{project.title}</h3>
							<p>{project.description}</p>
						</div>
					</a>
				))}
			</div>
		</section>
	);
};

export default ProjectLinks;
