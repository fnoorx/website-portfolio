import XpButton from './XpButton';

const tabs = [
	['general', 'General'],
	['experience', 'Experience'],
	['skills', 'Skills'],
	['education', 'Education'],
	['contact', 'Contact'],
];

const skillGroups = [
	['Languages', 'Python, Java, JavaScript, SQL, C, C++'],
	['Frameworks & libraries', 'Flask, Selenium, OpenCV, zxing-cpp, pytest, Pydantic, Discord.py'],
	['Data & integrations', 'SQLite, REST APIs, OAuth 2.0, StockX API, Google Sheets API, OpenAI API'],
	['Tools', 'Git, Linux / Unix, Codex, Claude Code'],
];

const experience = [
	{
		role: 'Owner & Software Developer',
		org: 'Independent E-commerce Operations Platform',
		period: 'Jul 2023 - Present',
		points: [
			'Built and operate an internal Python platform integrating Discord, SQLite, StockX, and Google Sheets to automate market research, inventory tracking, and sale reconciliation across daily operations.',
			'Founded and scaled the multi-marketplace resale business the platform serves to roughly $153K CAD in revenue, $57K gross profit, and 1,064 completed sales at about a 37% gross margin.',
			'Used margin, sell-through, and seasonal-demand data to guide purchasing and inventory allocation, contributing to 31% year-over-year revenue growth from about $59K in 2024 to $77K in 2025.',
		],
	},
	{
		role: 'Co-Founder & Operations Lead',
		org: 'Amazon FBA Business',
		period: 'Jan 2024 - Apr 2026',
		points: [
			'Led operations for a three-person business generating $104K+ CAD in revenue, managing product launches, supplier relationships, inventory planning, and marketing strategy.',
		],
	},
];

export default function RecruiterProfile({ activeTab, onTabChange, onOpenProject, onOpenResume }) {
	const activateTab = (event) => {
		const offset = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
		if (!offset) return;

		event.preventDefault();
		const index = tabs.findIndex(([id]) => id === activeTab);
		const [nextId] = tabs[(index + offset + tabs.length) % tabs.length];
		onTabChange(nextId);
		document.getElementById(`profile-tab-${nextId}`)?.focus();
	};

	return (
		<div className="profile-app">
			<div className="profile-tabs">
				<div className="profile-tablist" role="tablist" aria-label="Faizan Noor profile sections" onKeyDown={activateTab}>
					{tabs.map(([id, label]) => (
						<button
							className={activeTab === id ? 'active' : ''}
							type="button"
							role="tab"
							id={`profile-tab-${id}`}
							aria-selected={activeTab === id}
							aria-controls="profile-panel"
							tabIndex={activeTab === id ? 0 : -1}
							key={id}
							onClick={() => onTabChange(id)}
						>
							{label}
						</button>
					))}
				</div>
				<button className="profile-resume-tab" type="button" onClick={onOpenResume} aria-label="Open Faizan Noor resume PDF">
					Resume
				</button>
			</div>

			<div className="profile-panel" role="tabpanel" id="profile-panel" aria-labelledby={`profile-tab-${activeTab}`} tabIndex={0}>
				{activeTab === 'general' && (
					<>
						<header className="profile-identity">
							<span className="profile-avatar" aria-hidden="true">FN</span>
							<div>
								<p>Software engineering candidate</p>
								<h1>Faizan Noor</h1>
								<span>Computer Science at Toronto Metropolitan University</span>
							</div>
							<strong className="availability-badge">Open to internships and early-career roles</strong>
						</header>

						<p className="profile-summary">
							I started a resale business, got tired of repetitive work, and decided to automate it. Since 2023, I&apos;ve built
							and operated the internal systems behind 1,000+ sales and $150K+ CAD in revenue. That work has taught me how to turn
							messy workflows, unreliable APIs, and real operating constraints into dependable software.
						</p>

						<div className="profile-proof" aria-label="Candidate highlights">
							<div><strong>1,000+ sales</strong><span>Completed through systems I built and operate</span></div>
							<div><strong>$150K+ CAD</strong><span>Business revenue supported by the platform since 2023</span></div>
							<div><strong>Expected 2027</strong><span>BSc (Honours), Computer Science</span></div>
						</div>

						<section className="profile-focus">
							<h2>What I work on</h2>
							<p>Python automation, API integrations, data systems, and software that still has to work when inputs and external services do not.</p>
						</section>

						<div className="profile-actions">
							<XpButton onClick={() => onOpenProject('resale-platform')}>Resale Operations Platform</XpButton>
							<XpButton variant="secondary" onClick={() => onOpenProject('product-scraper')}>Product Discovery Engine</XpButton>
							<XpButton variant="secondary" onClick={onOpenResume}>Open resume</XpButton>
						</div>
					</>
				)}

				{activeTab === 'experience' && (
					<section className="profile-section">
						<h1>Experience</h1>
						<p>Three continuous years of building and operating software against a live business, where a bug shows up as a mispriced unit rather than a failing test.</p>
						{experience.map((entry) => (
							<article className="experience-record" key={entry.role}>
								<header>
									<strong>{entry.role}</strong>
									<span className="record-period">{entry.period}</span>
								</header>
								<span className="record-org">{entry.org}</span>
								<ul>
									{entry.points.map((point) => <li key={point}>{point}</li>)}
								</ul>
							</article>
						))}
						<div className="profile-actions">
							<XpButton onClick={() => onOpenProject('resale-platform')}>See the platform</XpButton>
							<XpButton variant="secondary" onClick={onOpenResume}>Open resume</XpButton>
						</div>
					</section>
				)}

				{activeTab === 'skills' && (
					<section className="profile-section">
						<h1>Technical skills</h1>
						<p>Core technologies used across coursework, production tools, and portfolio projects.</p>
						<dl className="skill-groups">
							{skillGroups.map(([name, values]) => (
								<div key={name}><dt>{name}</dt><dd>{values}</dd></div>
							))}
						</dl>
					</section>
				)}

				{activeTab === 'education' && (
					<section className="profile-section">
						<h1>Education</h1>
						<div className="education-record">
							<strong>Bachelor of Science (Honours), Computer Science</strong>
							<span>Toronto Metropolitan University</span>
							<span>Expected graduation: 2027</span>
						</div>
						<h2>Relevant coursework</h2>
						<p>Algorithms, Database Systems, Operating Systems, and UNIX / C / C++.</p>
					</section>
				)}

				{activeTab === 'contact' && (
					<section className="profile-section contact-section">
						<h1>Contact Faizan</h1>
						<div className="contact-links">
							<div><strong>Based in</strong><span>Greater Toronto Area, Ontario</span></div>
							<a href="mailto:faizan.noor@outlook.com"><strong>Email</strong><span>faizan.noor@outlook.com</span></a>
							<a href="tel:+14372383313"><strong>Phone</strong><span>(437) 238-3313</span></a>
							<a href="https://github.com/fnoorx" target="_blank" rel="noreferrer"><strong>GitHub</strong><span>github.com/fnoorx</span></a>
							<a href="https://www.linkedin.com/in/faizan-n" target="_blank" rel="noreferrer"><strong>LinkedIn</strong><span>linkedin.com/in/faizan-n</span></a>
						</div>
						<div className="profile-actions">
							<XpButton onClick={onOpenResume}>Open resume</XpButton>
						</div>
					</section>
				)}
			</div>

			<footer className="app-status-bar"><span>Faizan Noor</span><span>Greater Toronto Area, ON</span></footer>
		</div>
	);
}
