import { useEffect, useState } from 'react';

const resumeUrl = '/resume.pdf';

/*
 * The inline <object> embed is unreliable on mobile browsers, and the HEAD probe
 * can fail for reasons that have nothing to do with the file being reachable.
 * So the open/download links are always rendered: a recruiter must never lose
 * access to the PDF because a preview or a status check misbehaved.
 */
export default function ResumeViewer() {
	const [status, setStatus] = useState('checking');

	useEffect(() => {
		const controller = new AbortController();

		fetch(resumeUrl, { method: 'HEAD', signal: controller.signal })
			.then((response) => {
				const contentType = response.headers.get('content-type') || '';
				setStatus(response.ok && contentType.includes('application/pdf') ? 'ready' : 'missing');
			})
			.catch((error) => {
				if (error.name !== 'AbortError') setStatus('missing');
			});

		return () => controller.abort();
	}, []);

	return (
		<div className="resume-viewer">
			<div className="resume-toolbar">
				<div><span className={`resume-status ${status}`} aria-hidden="true" /><span>Faizan Noor - Resume.pdf</span></div>
				<div className="resume-actions">
					<a className="xp-button xp-button--secondary xp-button--compact" href={resumeUrl} target="_blank" rel="noreferrer">Open in new tab</a>
					<a className="xp-button xp-button--primary xp-button--compact" href={resumeUrl} download="Faizan-Noor-Resume.pdf">Download PDF</a>
				</div>
			</div>

			<object className="resume-document" data={`${resumeUrl}#view=FitH`} type="application/pdf" aria-label="Faizan Noor resume">
				<p>Your browser cannot display this PDF inline. <a href={resumeUrl} target="_blank" rel="noreferrer">Open the resume in a new tab.</a></p>
			</object>

			<div className="resume-handoff">
				<span className="large-pdf-mark" aria-hidden="true">PDF</span>
				<div>
					<strong>Faizan Noor - Resume</strong>
					<p>Inline PDF preview is unreliable on mobile browsers. Use the buttons above to open or download the file.</p>
				</div>
			</div>

			<footer className="app-status-bar">
				<span>{status === 'ready' ? 'PDF document ready' : 'Direct link: /resume.pdf'}</span>
			</footer>
		</div>
	);
}
