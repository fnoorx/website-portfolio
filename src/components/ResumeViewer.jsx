import { useEffect, useState } from 'react';

const resumeUrl = '/resume.pdf';

export default function ResumeViewer() {
	const [status, setStatus] = useState('checking');
	const [checkVersion, setCheckVersion] = useState(0);

	useEffect(() => {
		const controller = new AbortController();
		setStatus('checking');

		fetch(resumeUrl, { method: 'HEAD', signal: controller.signal })
			.then((response) => {
				const contentType = response.headers.get('content-type') || '';
				setStatus(response.ok && contentType.includes('application/pdf') ? 'ready' : 'missing');
			})
			.catch((error) => {
				if (error.name !== 'AbortError') setStatus('missing');
			});

		return () => controller.abort();
	}, [checkVersion]);

	return (
		<div className="resume-viewer">
			<div className="resume-toolbar">
				<div><FileStatus status={status} /><span>Faizan Noor - Resume.pdf</span></div>
				{status === 'ready' && (
					<div className="resume-actions">
						<a href={resumeUrl} target="_blank" rel="noreferrer">Open in new tab</a>
						<a href={resumeUrl} download="Faizan-Noor-Resume.pdf">Download</a>
					</div>
				)}
			</div>

			{status === 'ready' ? (
				<object className="resume-document" data={`${resumeUrl}#view=FitH`} type="application/pdf" aria-label="Faizan Noor resume">
					<p>Your browser cannot display this PDF. <a href={resumeUrl} target="_blank" rel="noreferrer">Open the resume in a new tab.</a></p>
				</object>
			) : (
				<div className="resume-placeholder">
					<span className="large-pdf-mark" aria-hidden="true">PDF</span>
					<strong>{status === 'checking' ? 'Looking for resume.pdf...' : 'Resume file not found'}</strong>
					<p>Place your PDF at <code>public/resume.pdf</code>, then check again.</p>
					{status === 'missing' && <button className="secondary-xp-button" type="button" onClick={() => setCheckVersion((version) => version + 1)}>Check again</button>}
				</div>
			)}
			<footer className="app-status-bar"><span>{status === 'ready' ? 'PDF document ready' : 'Expected URL: /resume.pdf'}</span></footer>
		</div>
	);
}

function FileStatus({ status }) {
	return <span className={`resume-status ${status}`} aria-hidden="true" />;
}
