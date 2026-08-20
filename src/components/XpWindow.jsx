import { useRef } from 'react';

export function WindowsLogo() {
	return (
		<span className="windows-logo" aria-hidden="true">
			<i />
			<i />
			<i />
			<i />
		</span>
	);
}

export function FileIcon({ type }) {
	if (type === 'pdf') {
		return (
			<span className="file-icon pdf-file-icon" aria-hidden="true">
				<strong>PDF</strong>
			</span>
		);
	}

	if (type === 'document') {
		return (
			<span className="file-icon document-icon" aria-hidden="true">
				<i />
			</span>
		);
	}

	return (
		<span className="file-icon app-icon" aria-hidden="true">
			<span className="app-window-mini">
				<i />
				<i />
				<i />
			</span>
		</span>
	);
}

function WindowControls({ onMinimize, onMaximize, onClose, maximized }) {
	return (
		<div className="window-controls">
			<button type="button" onClick={onMinimize} aria-label="Minimize window" title="Minimize">
				<span className="minimize-symbol" />
			</button>
			<button type="button" onClick={onMaximize} aria-label={maximized ? 'Restore window' : 'Maximize window'} title={maximized ? 'Restore' : 'Maximize'}>
				<span className={maximized ? 'restore-symbol' : 'maximize-symbol'} />
			</button>
			<button className="close-button" type="button" onClick={onClose} aria-label="Close window" title="Close">
				<span className="close-symbol" />
			</button>
		</div>
	);
}

export default function XpWindow({
	id,
	title,
	iconType = 'app',
	className = '',
	windowState,
	isActive,
	onFocus,
	onMinimize,
	onMaximize,
	onClose,
	onMove,
	children,
}) {
	const dragState = useRef(null);

	if (!windowState.open) return null;

	const beginDrag = (event) => {
		if (
			windowState.maximized
			|| event.button !== 0
			|| event.target.closest('button')
			|| window.matchMedia('(max-width: 940px)').matches
		) {
			return;
		}

		const windowElement = event.currentTarget.closest('.xp-window');
		const workspace = windowElement.parentElement;
		const rect = windowElement.getBoundingClientRect();
		const bounds = workspace.getBoundingClientRect();
		const position = windowState.position;

		dragState.current = {
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			originX: position.x,
			originY: position.y,
			baseLeft: rect.left - position.x,
			baseTop: rect.top - position.y,
			width: rect.width,
			height: rect.height,
			bounds,
		};

		event.currentTarget.setPointerCapture(event.pointerId);
		onFocus(id);
		event.preventDefault();
	};

	const moveWindow = (event) => {
		const drag = dragState.current;
		if (!drag || drag.pointerId !== event.pointerId) return;

		const desiredX = drag.originX + event.clientX - drag.startX;
		const desiredY = drag.originY + event.clientY - drag.startY;
		const minX = drag.bounds.left - drag.baseLeft;
		const maxX = Math.max(minX, drag.bounds.right - drag.baseLeft - drag.width);
		const minY = drag.bounds.top - drag.baseTop;
		const maxY = Math.max(minY, drag.bounds.bottom - drag.baseTop - drag.height);

		onMove(id, {
			x: Math.min(Math.max(desiredX, minX), maxX),
			y: Math.min(Math.max(desiredY, minY), maxY),
		});
	};

	const endDrag = (event) => {
		if (!dragState.current || dragState.current.pointerId !== event.pointerId) return;

		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
		dragState.current = null;
	};

	const toggleFromTitleBar = (event) => {
		if (!event.target.closest('button')) onMaximize(id);
	};

	return (
		<section
			className={`xp-window ${className} ${windowState.minimized ? 'minimized' : ''} ${windowState.maximized ? 'maximized' : ''} ${isActive ? 'active' : ''}`}
			style={{
				'--window-x': `${windowState.position.x}px`,
				'--window-y': `${windowState.position.y}px`,
				zIndex: windowState.z,
			}}
			onPointerDown={() => { if (!isActive) onFocus(id); }}
			aria-label={`${title} window`}
		>
			<header
				className="title-bar"
				onPointerDown={beginDrag}
				onPointerMove={moveWindow}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
				onDoubleClick={toggleFromTitleBar}
			>
				<div className="title-bar-name">
					<FileIcon type={iconType} />
					<strong>{title}</strong>
				</div>
				<WindowControls
					onMinimize={() => onMinimize(id)}
					onMaximize={() => onMaximize(id)}
					onClose={() => onClose(id)}
					maximized={windowState.maximized}
				/>
			</header>
			{children}
		</section>
	);
}
