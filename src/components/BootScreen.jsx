import './BootScreen.css';

export default function BootScreen({ onSkip, durationMs, fadeMs }) {
	return (
		<div
			className="boot-screen"
			role="status"
			aria-label="Starting Faizan Noor portfolio"
			onPointerDown={onSkip}
			style={{ '--boot-duration': `${durationMs}ms`, '--boot-fade': `${fadeMs}ms` }}
		>
			<div className="boot-brand" aria-hidden="true">
				<span className="boot-mark">FN</span>
				<div className="boot-wordmark">
					<strong>Faizan Noor</strong>
					<small>portfolio</small>
				</div>
			</div>

			<div className="boot-progress" aria-hidden="true">
				<span />
				<span />
				<span />
			</div>

			<p>Starting portfolio...</p>
		</div>
	);
}
