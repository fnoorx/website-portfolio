import { useEffect, useState } from 'react';
import BudgetOptimizer from '../demos/BudgetOptimizer';
import InventoryLifecycleSimulator from '../demos/InventoryLifecycleSimulator';
import RecruiterProfile from './RecruiterProfile';
import ResumeViewer from './ResumeViewer';
import XpButton from './XpButton';
import XpWindow, { FileIcon, WindowsLogo } from './XpWindow';
import './Desktop.css';
import '../demos/InteractiveDemos.css';

const projects = [
	{
		id: 'resale-platform',
		name: 'Resale Operations & Inventory Platform',
		status: 'Running in production since 2023',
		stack: ['Python', 'SQLite', 'Discord.py', 'OpenCV', 'zxing-cpp', 'OpenAI API', 'StockX API', 'Google Sheets API', 'pytest'],
		outcome:
			'The internal platform that runs the business day to day. It takes a physical shoe box from label scan to reconciled sale: resolving the exact product variant, giving every unit a permanent identity, and keeping inventory, payouts, and profit in sync across SQLite, Discord, and Google Sheets.',
		metrics: [
			['45s \u2192 5s', 'Price research per item'],
			['1,129 rows', 'Backfilled, zero duplicate IDs'],
			['100+ tests', 'Failure recovery validated'],
		],
		achievements: [
			['Durable identity layer', 'Transactional SQLite with immutable unit IDs, schema migrations, and message-level idempotency, so a retried Discord command or a half-finished sync can never mint a duplicate unit.'],
			['Retry-safe synchronization', 'Google Sheets writes are replay-safe rather than fire-and-forget. A backfill of 1,129 historical rows completed without a single duplicate unit identity.'],
			['Hybrid label intake', 'OpenCV and zxing-cpp read the barcode, UPC/EAN check digits validate it, and OpenAI Structured Outputs resolve the exact StockX variant. Ambiguous scans are blocked rather than guessed.'],
			['Automated reconciliation', 'StockX sales match back to inventory by normalized style and size, updating payout, profit, and unit state. 100+ tests cover the failure paths using temporary databases and mocked APIs.'],
		],
		flow: ['Label intake', 'Variant resolution', 'Inventory identity', 'Sale reconciliation'],
		details: [
			['Type', 'Internal operations platform'],
			['Scale', '1,064 sales and 1,129 inventory rows under management'],
			['Status', 'In daily production use'],
		],
		appId: 'inventory-lifecycle',
		demoId: 'inventory-lifecycle-demo',
		sourceNote: 'Private production system; the simulator reproduces the real intake and reconciliation logic on synthetic data.',
	},
	{
		id: 'product-scraper',
		name: 'Product Discovery & Profitability Engine',
		status: 'Demo ready',
		stack: ['Python', 'Selenium', 'REST APIs', 'Regex', 'JSON', 'Concurrent Processing', 'Dynamic Programming'],
		outcome:
			'An authenticated catalogue-monitoring and purchasing engine that discovers products, evaluates resale profitability, and ranks buying opportunities against a fixed budget.',
		metrics: [
			['15 min \u2192 2-3 min', 'Recurring catalogue review'],
			['80%', 'Faster end to end'],
			['~50 hrs', 'Saved annually'],
		],
		achievements: [
			['Catalogue monitoring', 'Snapshots and diffs an authenticated, dynamic catalogue instead of repeatedly reviewing every product.'],
			['Resilient extraction', 'Stabilizes lazy-loaded and paginated pages, recovers partial results, and validates style codes parsed from image URLs.'],
			['Profit optimization', 'Throttles concurrent StockX requests, estimates net profit after fees, ranks ROI, and applies 0/1 knapsack selection.'],
		],
		flow: ['Catalogue diff', 'Resilient extraction', 'Profit & ROI model', 'Budget optimizer'],
		details: [
			['Type', 'Discovery and purchasing engine'],
			['Impact', '80% faster; ~50 hours saved annually'],
			['Status', 'Working demo'],
		],
		appId: 'optimizer',
		demoId: 'optimizer-demo',
		videoId: 'scraper-video',
		sourceNote: 'Private production project; architecture and behavior are demonstrated here.',
	},
];

const demos = [
	{
		id: 'inventory-lifecycle-demo',
		name: 'Inventory Lifecycle Simulator',
		fileName: 'interactive label-to-sale workflow',
		kind: 'app',
		appId: 'inventory-lifecycle',
		projectId: 'resale-platform',
		projectName: 'Resale Operations & Inventory Platform',
		description:
			'Process a synthetic shoe-box label, review the validation evidence, create a permanent inventory record, and reconcile a simulated StockX sale. One of the three sample labels carries a deliberate size conflict so you can see how ambiguous scans are blocked instead of guessed.',
	},
	{
		id: 'optimizer-demo',
		name: 'Budget Optimizer',
		fileName: 'interactive 0/1 knapsack demo',
		kind: 'app',
		appId: 'optimizer',
		projectId: 'product-scraper',
		projectName: 'Product Discovery & Profitability Engine',
		description:
			'Enter products, costs, expected profits, and a budget. The optimizer selects the group of products with the highest total profit without going over budget.',
	},
	{
		id: 'scraper-video',
		name: 'Catalogue Monitor to Discord Alert',
		fileName: 'product-scraper-demo.mp4',
		kind: 'video',
		src: '/videos/product-scraper-demo.mp4',
		projectId: 'product-scraper',
		projectName: 'Product Discovery & Profitability Engine',
		description:
			'The engine scans a retailer catalogue, finds new products, compares retail prices with estimated market values, and sends a Discord alert showing each item\'s possible profit or loss.',
	},
];

const desktopFiles = [
	{ id: 'resale-platform', label: 'Resale Operations Platform.exe', icon: 'app' },
	{ id: 'product-scraper', label: 'Product Discovery Engine.exe', icon: 'app' },
	{ id: 'about', label: 'About Faizan.exe', icon: 'app' },
	{ id: 'resume', label: 'Faizan Noor - Resume.pdf', icon: 'pdf', windowId: 'resume' },
	{ id: 'contact', label: 'Contact Faizan.url', icon: 'document' },
];

function bringWindowToFront(current, id, updates = {}) {
	const orderedIds = Object.keys(current)
		.filter((windowId) => windowId !== id)
		.sort((first, second) => current[first].z - current[second].z);
	const next = { ...current };

	orderedIds.forEach((windowId, index) => {
		next[windowId] = { ...current[windowId], z: index + 1 };
	});
	next[id] = { ...current[id], ...updates, z: orderedIds.length + 1 };
	return next;
}

function Desktop() {
	const [selectedProjectId, setSelectedProjectId] = useState('about');
	const [selectedDemoId, setSelectedDemoId] = useState('inventory-lifecycle-demo');
	const [profileTab, setProfileTab] = useState('general');
	const [videoStarted, setVideoStarted] = useState(false);
	const [startOpen, setStartOpen] = useState(false);
	const [activeWindow, setActiveWindow] = useState('project');
	const [time, setTime] = useState(new Date());
	const [windowStates, setWindowStates] = useState({
		project: { open: true, minimized: false, maximized: false, position: { x: 0, y: 0 }, z: 3 },
		demos: { open: true, minimized: false, maximized: false, position: { x: 0, y: 0 }, z: 2 },
		optimizer: { open: false, minimized: false, maximized: false, position: { x: 0, y: 0 }, z: 1 },
		'inventory-lifecycle': { open: false, minimized: false, maximized: false, position: { x: 24, y: 16 }, z: 1 },
		resume: { open: false, minimized: false, maximized: false, position: { x: 20, y: 12 }, z: 1 },
	});

	useEffect(() => {
		const timer = window.setInterval(() => setTime(new Date()), 30000);
		return () => window.clearInterval(timer);
	}, []);

	const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0];
	const selectedDemo = demos.find((demo) => demo.id === selectedDemoId) ?? demos[0];

	const focusWindow = (id) => {
		setWindowStates((current) => bringWindowToFront(current, id));
		setActiveWindow(id);
	};

	const openWindow = (id) => {
		setWindowStates((current) => bringWindowToFront(current, id, { open: true, minimized: false }));
		setActiveWindow(id);
		setStartOpen(false);
	};

	const minimizeWindow = (id) => {
		setWindowStates((current) => ({ ...current, [id]: { ...current[id], minimized: true } }));
		if (activeWindow === id) setActiveWindow(null);
	};

	const closeWindow = (id) => {
		setWindowStates((current) => ({ ...current, [id]: { ...current[id], open: false, minimized: false } }));
		if (activeWindow === id) setActiveWindow(null);
	};

	const toggleMaximize = (id) => {
		setWindowStates((current) => ({
			...current,
			[id]: { ...current[id], maximized: !current[id].maximized },
		}));
		focusWindow(id);
	};

	const moveWindow = (id, position) => {
		setWindowStates((current) => ({ ...current, [id]: { ...current[id], position } }));
	};

	const toggleTaskWindow = (id) => {
		const state = windowStates[id];
		if (!state.open || state.minimized) {
			openWindow(id);
		} else if (activeWindow === id) {
			minimizeWindow(id);
		} else {
			focusWindow(id);
		}
	};

	const openProject = (id) => {
		setSelectedProjectId(id);
		const project = projects.find((entry) => entry.id === id);
		if (project?.demoId) selectDemo(project.demoId);
		openWindow('project');
	};

	const openProfile = (tab = 'general') => {
		setProfileTab(tab);
		openProject('about');
	};

	const openDesktopFile = (file) => {
		if (file.id === 'contact') {
			openProfile('contact');
		} else if (file.windowId) {
			openWindow(file.windowId);
		} else {
			openProject(file.id);
		}
	};

	const playProjectDemo = () => {
		openWindow(selectedProject.appId);
	};

	const playProjectVideo = () => {
		if (!selectedProject.videoId) return;
		selectDemo(selectedProject.videoId);
		openWindow('demos');
	};

	const selectDemo = (id) => {
		setSelectedDemoId(id);
		setVideoStarted(false);
	};

	const taskbarItems = [
		{
			id: 'project',
			title: selectedProjectId === 'about' ? 'About Faizan' : selectedProject.name,
			iconType: 'app',
		},
		{ id: 'demos', title: 'Project Demos', iconType: 'app' },
		{ id: 'optimizer', title: 'Budget Optimizer', iconType: 'app' },
		{ id: 'inventory-lifecycle', title: 'Inventory Lifecycle', iconType: 'app' },
		{ id: 'resume', title: 'Faizan Noor - Resume.pdf', iconType: 'pdf' },
	];

	return (
		<main className="xp-desktop" onClick={() => startOpen && setStartOpen(false)}>
			<div className="desktop-workspace">
				<nav className="desktop-files" aria-label="Desktop files">
					{desktopFiles.map((file) => (
						<button className="desktop-file" type="button" key={file.id} onClick={() => openDesktopFile(file)}>
							<FileIcon type={file.icon} />
							<span>{file.label}</span>
						</button>
					))}
				</nav>

				<XpWindow
					id="project"
					title={selectedProjectId === 'about' ? 'Faizan Noor - System Properties' : `${selectedProject.name} - My Projects`}
					iconType="app"
					className="project-window"
					windowState={windowStates.project}
					isActive={activeWindow === 'project'}
					onFocus={focusWindow}
					onMinimize={minimizeWindow}
					onMaximize={toggleMaximize}
					onClose={closeWindow}
					onMove={moveWindow}
				>
					{selectedProjectId === 'about' ? (
						<RecruiterProfile
							activeTab={profileTab}
							onTabChange={setProfileTab}
							onOpenProject={openProject}
							onOpenResume={() => openWindow('resume')}
						/>
					) : (
						<div className="project-explorer">
							<div className="window-menu" aria-hidden="true">
								<span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span><span>Help</span>
							</div>
							<div className="explorer-address">
								<span>Address</span>
								<div><FileIcon type="app" /> C:\Faizan\Projects\{selectedProject.name}</div>
							</div>
							<div className="project-content">
								<aside className="project-sidebar">
									<div className="sidebar-panel">
										<h2>Project Tasks</h2>
										<button className="play-demo-link" type="button" onClick={playProjectDemo}>Launch interactive demo</button>
										{selectedProject.videoId && <button className="watch-video-link" type="button" onClick={playProjectVideo}>Watch video walkthrough</button>}
										<button type="button" onClick={() => openProfile('general')}>View candidate profile</button>
										<button type="button" onClick={() => openWindow('resume')}>Open resume</button>
									</div>
									<div className="sidebar-panel details-panel">
										<h2>Details</h2>
										<span>{selectedProject.status}</span>
										{selectedProject.sourceNote && <span>{selectedProject.sourceNote}</span>}
									</div>
								</aside>
								<article className="project-details">
									<div className="project-heading">
										<FileIcon type="app" />
										<div>
											<p>Faizan Noor presents</p>
											<h1>{selectedProject.name}</h1>
										</div>
									</div>
									<p className="project-description">{selectedProject.outcome}</p>
									{selectedProject.metrics && (
										<div className="project-metrics" aria-label="Project outcomes">
											{selectedProject.metrics.map(([value, label]) => (
												<div key={label}><strong>{value}</strong><span>{label}</span></div>
											))}
										</div>
									)}
									<div className="project-demo-actions project-demo-actions--primary">
										<XpButton onClick={playProjectDemo}>Launch interactive demo</XpButton>
										{selectedProject.videoId && (
											<XpButton variant="secondary" icon={<span className="video-action-icon" aria-hidden="true" />} onClick={playProjectVideo}>Watch video walkthrough</XpButton>
										)}
									</div>
									{selectedProject.flow && (
										<section className="project-flow">
											<h2>System flow</h2>
											<div>
												{selectedProject.flow.map((stage, index) => (
													<span key={stage}><b>{index + 1}</b>{stage}</span>
												))}
											</div>
										</section>
									)}
									{selectedProject.achievements && (
										<section className="project-highlights">
											<h2>Engineering decisions</h2>
											<div className="decision-list">
												{selectedProject.achievements.map(([title, detail]) => (
													<div key={title}><strong>{title}</strong><p>{detail}</p></div>
												))}
											</div>
										</section>
									)}
									<dl className="project-facts">
										{selectedProject.details.map(([term, value]) => (
											<div key={term}><dt>{term}</dt><dd>{value}</dd></div>
										))}
									</dl>
									<div className="technology-list" aria-label="Technologies">
										{selectedProject.stack.map((technology) => <span key={technology}>{technology}</span>)}
									</div>
								</article>
							</div>
						</div>
					)}
				</XpWindow>

				<XpWindow
					id="demos"
					title="Project Demos"
					className="demo-window"
					windowState={windowStates.demos}
					isActive={activeWindow === 'demos'}
					onFocus={focusWindow}
					onMinimize={minimizeWindow}
					onMaximize={toggleMaximize}
					onClose={closeWindow}
					onMove={moveWindow}
				>
					<div className="demo-body">
						<div className="demo-header">
							<span>{selectedDemo.kind === 'video' ? 'Video walkthrough' : 'Interactive application'}</span>
							<strong>{selectedDemo.name}</strong>
							<button
								className="demo-project"
								type="button"
								onClick={() => openProject(selectedDemo.projectId)}
								title={`Open ${selectedDemo.projectName}`}
							>
								<small>Resume project</small>
								<span>{selectedDemo.projectName}</span>
							</button>
						</div>
						<p className="demo-description"><strong>What this demo shows:</strong> {selectedDemo.description}</p>
						<div className="demo-screen">
							{selectedDemo.kind === 'video' ? (
								videoStarted ? (
									<video key={selectedDemo.src} controls autoPlay loop muted playsInline preload="metadata" src={selectedDemo.src} />
								) : (
									<div className="interactive-demo-launcher">
										<span className="video-poster-mark" aria-hidden="true" />
										<strong>{selectedDemo.name}</strong>
										<small>7 MB video &middot; loads when you press play</small>
										<XpButton onClick={() => setVideoStarted(true)}>Play walkthrough</XpButton>
									</div>
								)
							) : (
								<div className="interactive-demo-launcher">
									<FileIcon type="app" />
									<strong>{selectedDemo.name}</strong>
									<small>Runs in its own window &middot; no setup required</small>
									<XpButton onClick={() => openWindow(selectedDemo.appId)}>Launch application</XpButton>
								</div>
							)}
						</div>
						<div className="demo-playlist" role="group" aria-label="Demo playlist">
							{demos.map((demo, index) => (
								<button
									className={demo.id === selectedDemo.id ? 'selected' : ''}
									type="button"
									key={demo.id}
									onClick={() => selectDemo(demo.id)}
								>
									<span className="playlist-icon">{index + 1}</span>
									<span><strong>{demo.name}</strong><small>{demo.fileName}</small></span>
								</button>
							))}
						</div>
					</div>
				</XpWindow>

				<XpWindow
					id="optimizer"
					title="Budget Optimizer - Product Discovery Engine"
					className="interactive-window"
					windowState={windowStates.optimizer}
					isActive={activeWindow === 'optimizer'}
					onFocus={focusWindow}
					onMinimize={minimizeWindow}
					onMaximize={toggleMaximize}
					onClose={closeWindow}
					onMove={moveWindow}
				>
					<BudgetOptimizer />
				</XpWindow>

				<XpWindow
					id="resume"
					title="Faizan Noor - Resume.pdf"
					iconType="pdf"
					className="resume-window"
					windowState={windowStates.resume}
					isActive={activeWindow === 'resume'}
					onFocus={focusWindow}
					onMinimize={minimizeWindow}
					onMaximize={toggleMaximize}
					onClose={closeWindow}
					onMove={moveWindow}
				>
					<ResumeViewer />
				</XpWindow>

				<XpWindow
					id="inventory-lifecycle"
					title="Inventory Lifecycle Simulator - Resale Operations Platform"
					className="interactive-window lifecycle-window"
					windowState={windowStates['inventory-lifecycle']}
					isActive={activeWindow === 'inventory-lifecycle'}
					onFocus={focusWindow}
					onMinimize={minimizeWindow}
					onMaximize={toggleMaximize}
					onClose={closeWindow}
					onMove={moveWindow}
				>
					<InventoryLifecycleSimulator />
				</XpWindow>
			</div>

			{startOpen && (
				<div className="start-menu" onClick={(event) => event.stopPropagation()}>
					<header><span className="user-avatar">FN</span><strong>Faizan Noor</strong></header>
					<div className="start-menu-content">
						<button type="button" onClick={() => openProfile('general')}><FileIcon type="app" /><span><strong>About Faizan</strong><small>Candidate profile and skills</small></span></button>
						<button type="button" onClick={() => openProject('resale-platform')}><FileIcon type="app" /><span><strong>Resale Operations Platform</strong><small>Identity layer, label intake, reconciliation</small></span></button>
						<button type="button" onClick={() => openProject('product-scraper')}><FileIcon type="app" /><span><strong>Product Discovery Engine</strong><small>Catalogue diffing and budget optimization</small></span></button>
						<button type="button" onClick={() => openWindow('demos')}><FileIcon type="app" /><span><strong>Project Demos</strong><small>Launch videos and apps</small></span></button>
						<button type="button" onClick={() => openWindow('resume')}><FileIcon type="pdf" /><span><strong>My Resume</strong><small>Open PDF document</small></span></button>
						<button type="button" onClick={() => openProfile('contact')}><FileIcon type="document" /><span><strong>Contact</strong><small>Email, GitHub, and LinkedIn</small></span></button>
					</div>
					<footer>portfolio.exe</footer>
				</div>
			)}

			<footer className="taskbar" onClick={(event) => event.stopPropagation()}>
				<button className={`start-button ${startOpen ? 'pressed' : ''}`} type="button" onClick={() => setStartOpen((value) => !value)}>
					<WindowsLogo />
					<strong>start</strong>
				</button>
				<div className="taskbar-apps">
					{taskbarItems.filter((item) => windowStates[item.id].open).map((item) => (
						<button
							className={activeWindow === item.id && !windowStates[item.id].minimized ? 'active' : ''}
							type="button"
							key={item.id}
							onClick={() => toggleTaskWindow(item.id)}
						>
							<FileIcon type={item.iconType} />
							<span>{item.title}</span>
						</button>
					))}
				</div>
				<div className="system-tray">
					<span className="volume-icon" aria-hidden="true" />
					<time dateTime={time.toISOString()}>{time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</time>
				</div>
			</footer>
		</main>
	);
}

export default Desktop;
