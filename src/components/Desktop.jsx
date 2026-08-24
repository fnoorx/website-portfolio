import { useEffect, useState } from 'react';
import BudgetOptimizer from '../demos/BudgetOptimizer';
import MarketAlertSimulator from '../demos/MarketAlertSimulator';
import ResumeViewer from './ResumeViewer';
import XpButton from './XpButton';
import XpWindow, { FileIcon, WindowsLogo } from './XpWindow';
import './Desktop.css';
import '../demos/InteractiveDemos.css';

const projects = [
	{
		id: 'product-scraper',
		name: 'Product Discovery & Profitability Engine',
		status: 'Demo ready',
		stack: ['Python', 'Selenium', 'REST APIs', 'Regex', 'JSON', 'Concurrent Processing', 'Dynamic Programming'],
		description:
			'An authenticated catalogue-monitoring and purchasing engine that discovers products, evaluates resale profitability, and ranks buying opportunities against a fixed budget.',
		achievements: [
			'Built a snapshot-and-diff pipeline for a dynamic product catalogue, reducing a recurring 15-minute review to 2-3 minutes - 80% faster and approximately 50 hours saved annually.',
			'Engineered resilient extraction for lazy-loaded and paginated pages using load stabilization, fallback parsing, and partial-result recovery. Extracted missing style codes from image URLs and validated them against product identifiers.',
			'Built a size-aware purchasing engine using throttled concurrent StockX requests to estimate net profit after taxes and fees, rank opportunities by ROI, and apply 0/1 knapsack optimization for budget-constrained purchasing.',
		],
		details: [
			['Type', 'Discovery and purchasing engine'],
			['Impact', '80% faster; ~50 hours saved annually'],
			['Status', 'Working demo'],
		],
		appId: 'optimizer',
		videoId: 'scraper-video',
	},
	{
		id: 'market-data-bot',
		name: 'Market Data Bot',
		status: 'In progress',
		stack: ['Market data', 'Alerts', 'Bot logic'],
		description:
			'Tracks market data and turns raw movement into useful signals. The bot monitors changes, surfaces patterns, and reduces repetitive manual checking.',
		details: [
			['Type', 'Monitoring bot'],
			['Output', 'Market alerts'],
			['Status', 'In development'],
		],
		appId: 'market-simulator',
	},
];

const demos = [
	{
		id: 'scraper-video',
		name: 'Product Engine Walkthrough',
		fileName: 'product-scraper-demo.mp4',
		kind: 'video',
		src: '/videos/product-scraper-demo.mp4',
	},
	{
		id: 'optimizer-demo',
		name: 'Budget Optimizer',
		fileName: 'interactive 0/1 knapsack demo',
		kind: 'app',
		appId: 'optimizer',
		description: 'Choose the highest-profit purchasing plan for a fixed budget.',
	},
	{
		id: 'market-alert-demo',
		name: 'Market Alert Simulator',
		fileName: 'interactive signal replay',
		kind: 'app',
		appId: 'market-simulator',
		description: 'Replay price observations and inspect generated market alerts.',
	},
];

const desktopFiles = [
	{ id: 'product-scraper', label: 'Product Discovery & Profitability Engine.exe', icon: 'app' },
	{ id: 'market-data-bot', label: 'Market Data Bot.exe', icon: 'app' },
	{ id: 'about', label: 'About Faizan.txt', icon: 'document' },
	{ id: 'resume', label: 'Faizan Noor - Resume.pdf', icon: 'pdf', windowId: 'resume' },
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
	const [selectedProjectId, setSelectedProjectId] = useState('product-scraper');
	const [selectedDemoId, setSelectedDemoId] = useState('scraper-video');
	const [startOpen, setStartOpen] = useState(false);
	const [activeWindow, setActiveWindow] = useState('project');
	const [time, setTime] = useState(new Date());
	const [windowStates, setWindowStates] = useState({
		project: { open: true, minimized: false, maximized: false, position: { x: 0, y: 0 }, z: 3 },
		demos: { open: true, minimized: false, maximized: false, position: { x: 0, y: 0 }, z: 2 },
		optimizer: { open: false, minimized: false, maximized: false, position: { x: 0, y: 0 }, z: 1 },
		'market-simulator': { open: false, minimized: false, maximized: false, position: { x: 36, y: 24 }, z: 1 },
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
		openWindow('project');
	};

	const openDesktopFile = (file) => {
		if (file.windowId) {
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
		setSelectedDemoId(selectedProject.videoId);
		openWindow('demos');
	};

	const selectDemo = (demo) => {
		setSelectedDemoId(demo.id);
		if (demo.kind === 'app') openWindow(demo.appId);
	};

	const selectOtherProject = () => {
		const otherProject = projects.find((project) => project.id !== selectedProject.id);
		setSelectedProjectId(otherProject.id);
	};

	const taskbarItems = [
		{
			id: 'project',
			title: selectedProjectId === 'about' ? 'About Faizan.txt' : selectedProject.name,
			iconType: selectedProjectId === 'about' ? 'document' : 'app',
		},
		{ id: 'demos', title: 'Project Demos', iconType: 'app' },
		{ id: 'optimizer', title: 'Budget Optimizer', iconType: 'app' },
		{ id: 'market-simulator', title: 'Market Alert Simulator', iconType: 'app' },
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
					title={selectedProjectId === 'about' ? 'About Faizan.txt - Notepad' : `${selectedProject.name} - My Projects`}
					iconType={selectedProjectId === 'about' ? 'document' : 'app'}
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
						<div className="notepad-window">
							<div className="window-menu" aria-hidden="true">
								<span>File</span><span>Edit</span><span>Format</span><span>View</span><span>Help</span>
							</div>
							<div className="notepad-copy">
								<p>Hi, I&apos;m Faizan Noor.</p>
								<p>I&apos;m a computer science student building practical software that turns messy inputs into useful systems.</p>
								<p>I&apos;m especially interested in automation, data tools, and software people can maintain.</p>
								<p>Status: available for software engineering internships</p>
							</div>
						</div>
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
										<button type="button" onClick={selectOtherProject}>Open the other project</button>
									</div>
									<div className="sidebar-panel details-panel">
										<h2>Details</h2>
										<span>{selectedProject.status}</span>
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
									<p className="project-description">{selectedProject.description}</p>
									{selectedProject.achievements && (
										<section className="project-highlights">
											<h2>Project highlights</h2>
											<ul>
												{selectedProject.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}
											</ul>
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
									<div className="project-demo-actions">
										<XpButton onClick={playProjectDemo}>Launch interactive demo</XpButton>
										{selectedProject.videoId && (
											<XpButton variant="secondary" icon={<span className="video-action-icon" aria-hidden="true" />} onClick={playProjectVideo}>Watch video walkthrough</XpButton>
										)}
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
							<span>{selectedDemo.kind === 'video' ? 'Now playing' : 'Interactive application'}</span>
							<strong>{selectedDemo.name}</strong>
						</div>
						<div className="demo-screen">
							{selectedDemo.kind === 'video' ? (
								<video key={selectedDemo.src} controls autoPlay loop muted playsInline src={selectedDemo.src} />
							) : (
								<div className="interactive-demo-launcher">
									<FileIcon type="app" />
									<strong>{selectedDemo.name}</strong>
									<p>{selectedDemo.description}</p>
									<XpButton onClick={() => openWindow(selectedDemo.appId)}>Launch application</XpButton>
								</div>
							)}
						</div>
						<div className="demo-playlist" role="list" aria-label="Demo playlist">
							{demos.map((demo, index) => (
								<button
									className={demo.id === selectedDemo.id ? 'selected' : ''}
									type="button"
									key={demo.id}
									onClick={() => selectDemo(demo)}
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
					id="market-simulator"
					title="Market Alert Simulator - Market Data Bot"
					className="interactive-window market-simulator-window"
					windowState={windowStates['market-simulator']}
					isActive={activeWindow === 'market-simulator'}
					onFocus={focusWindow}
					onMinimize={minimizeWindow}
					onMaximize={toggleMaximize}
					onClose={closeWindow}
					onMove={moveWindow}
				>
					<MarketAlertSimulator />
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
			</div>

			{startOpen && (
				<div className="start-menu" onClick={(event) => event.stopPropagation()}>
					<header><span className="user-avatar">FN</span><strong>Faizan Noor</strong></header>
					<div className="start-menu-content">
						<button type="button" onClick={() => openProject('about')}><FileIcon type="document" /><span><strong>About Faizan</strong><small>Read introduction</small></span></button>
						<button type="button" onClick={() => openProject('product-scraper')}><FileIcon type="app" /><span><strong>My Projects</strong><small>Browse software</small></span></button>
						<button type="button" onClick={() => openWindow('demos')}><FileIcon type="app" /><span><strong>Project Demos</strong><small>Launch videos and apps</small></span></button>
						<button type="button" onClick={() => openWindow('resume')}><FileIcon type="pdf" /><span><strong>My Resume</strong><small>Open PDF document</small></span></button>
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
