import { useMemo, useState } from 'react';
import { simulateMarketAlerts } from './algorithms';

const samplePriceText = '100, 101, 102, 108, 109, 104, 98, 97, 103, 110';

function parsePrices(value) {
	return value
		.split(/[\s,]+/)
		.map(Number)
		.filter((price) => Number.isFinite(price) && price > 0);
}

function PriceChart({ prices, signals }) {
	const points = useMemo(() => {
		if (prices.length < 2) return '';
		const min = Math.min(...prices);
		const max = Math.max(...prices);
		const range = Math.max(1, max - min);
		return prices.map((price, index) => {
			const x = (index / (prices.length - 1)) * 100;
			const y = 40 - ((price - min) / range) * 34;
			return `${x},${y}`;
		}).join(' ');
	}, [prices]);

	if (prices.length < 2) return <div className="chart-empty">Enter at least two prices.</div>;

	const min = Math.min(...prices);
	const max = Math.max(...prices);
	const range = Math.max(1, max - min);

	return (
		<svg className="price-chart" viewBox="0 0 100 44" preserveAspectRatio="none" role="img" aria-label="Simulated market price series">
			<line x1="0" y1="40" x2="100" y2="40" />
			<polyline points={points} />
			{signals.map((signal) => {
				const x = (signal.index / (prices.length - 1)) * 100;
				const y = 40 - ((signal.price - min) / range) * 34;
				return <circle className={signal.change > 0 ? 'positive-signal' : 'negative-signal'} key={`${signal.index}-${signal.type}`} cx={x} cy={y} r="1.7" />;
			})}
		</svg>
	);
}

export default function MarketAlertSimulator() {
	const [priceText, setPriceText] = useState(samplePriceText);
	const [windowSize, setWindowSize] = useState(3);
	const [threshold, setThreshold] = useState(4);
	const [result, setResult] = useState(() => simulateMarketAlerts(parsePrices(samplePriceText), 3, 4));
	const [dirty, setDirty] = useState(false);
	const chartMaximum = result.prices.length ? Math.max(...result.prices) : 0;
	const chartMinimum = result.prices.length ? Math.min(...result.prices) : 0;

	const runSimulation = () => {
		setResult(simulateMarketAlerts(parsePrices(priceText), windowSize, threshold));
		setDirty(false);
	};

	const resetDemo = () => {
		setPriceText(samplePriceText);
		setWindowSize(3);
		setThreshold(4);
		setResult(simulateMarketAlerts(parsePrices(samplePriceText), 3, 4));
		setDirty(false);
	};

	return (
		<div className="interactive-app">
			<header className="interactive-toolbar">
				<div><strong>Market alert replay</strong><span>Rolling-baseline signal simulator</span></div>
				<button className="secondary-xp-button" type="button" onClick={resetDemo}>Reset sample</button>
			</header>

			<div className="market-layout">
				<section className="market-controls" aria-labelledby="market-input-title">
					<div className="pane-heading"><div><h2 id="market-input-title">Price stream</h2><p>Replay a sequence of market observations.</p></div></div>
					<label className="price-sequence-label">
						<span>Prices, separated by commas</span>
						<textarea value={priceText} rows="5" onChange={(event) => { setPriceText(event.target.value); setDirty(true); }} />
					</label>
					<div className="market-number-controls">
						<label><span>Rolling window</span><input type="number" min="2" max="10" value={windowSize} onChange={(event) => { setWindowSize(Number(event.target.value)); setDirty(true); }} /></label>
						<label><span>Alert threshold</span><span className="percent-input"><input type="number" min="0.1" max="50" step="0.1" value={threshold} onChange={(event) => { setThreshold(Number(event.target.value)); setDirty(true); }} /><span>%</span></span></label>
					</div>
					<button className="run-demo-button" type="button" onClick={runSimulation}><span aria-hidden="true" />Run market replay</button>
				</section>

				<section className="market-results" aria-labelledby="market-results-title">
					<div className="pane-heading result-heading">
						<div><h2 id="market-results-title">Signal timeline</h2><p className={dirty ? 'result-status stale' : 'result-status'}>{dirty ? 'Inputs changed - run again' : `${result.signals.length} alerts generated`}</p></div>
					</div>
					<div className="chart-panel">
						<div className="chart-labels"><span>${chartMaximum.toFixed(0)}</span><span>${chartMinimum.toFixed(0)}</span></div>
						<PriceChart prices={result.prices} signals={result.signals} />
						<div className="chart-legend"><span><i className="positive-dot" /> Momentum breakout</span><span><i className="negative-dot" /> Downside alert</span></div>
					</div>

					<div className="signal-list">
						{result.signals.length ? result.signals.map((signal) => (
							<div className="signal-row" key={`${signal.index}-${signal.type}`}>
								<span className={signal.change > 0 ? 'signal-badge positive' : 'signal-badge negative'}>{signal.change > 0 ? 'UP' : 'DOWN'}</span>
								<div><strong>{signal.type}</strong><small>Observation {signal.index + 1} compared with the previous {result.period}-price average</small></div>
								<div className="signal-values"><strong>${signal.price.toFixed(2)}</strong><span>{signal.change > 0 ? '+' : ''}{signal.change.toFixed(1)}%</span></div>
							</div>
						)) : <p className="empty-result">No movement crossed the configured threshold.</p>}
					</div>
				</section>
			</div>
			<footer className="app-status-bar"><span>{result.prices.length} observations</span><span>Baseline: previous {result.period} prices</span></footer>
		</div>
	);
}
