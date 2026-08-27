import { useCallback, useEffect, useState } from 'react';
import BootScreen from './components/BootScreen';
import Desktop from './components/Desktop';

const BOOT_SESSION_KEY = 'faizan-portfolio-booted';
const BOOT_DURATION_MS = 1240;
const BOOT_FADE_MS = 160;

function shouldShowBootScreen() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

	try {
		return window.sessionStorage.getItem(BOOT_SESSION_KEY) !== 'true';
	} catch {
		return true;
	}
}

function App() {
	const [booting, setBooting] = useState(shouldShowBootScreen);

	const finishBoot = useCallback(() => {
		try {
			window.sessionStorage.setItem(BOOT_SESSION_KEY, 'true');
		} catch {
			// The animation can still complete when browser storage is unavailable.
		}
		setBooting(false);
	}, []);

	useEffect(() => {
		if (!booting) return undefined;

		const timer = window.setTimeout(finishBoot, BOOT_DURATION_MS);
		window.addEventListener('keydown', finishBoot, { once: true });

		return () => {
			window.clearTimeout(timer);
			window.removeEventListener('keydown', finishBoot);
		};
	}, [booting, finishBoot]);

	return booting
		? <BootScreen onSkip={finishBoot} durationMs={BOOT_DURATION_MS} fadeMs={BOOT_FADE_MS} />
		: <Desktop />;
}

export default App;
