import { useState } from 'react';
import XpButton from '../components/XpButton';

const samples = [
	{
		id: 'adidas-samba',
		brand: 'adidas',
		product: 'Samba OG',
		styleCode: 'B75806',
		size: '8',
		gtin: '2001234567893',
		pricePaid: 150,
		payout: 230,
		status: 'verified',
		evidence: [
			['Local barcode check', 'Passed'],
			['StockX product match', 'Exact match'],
			['Visible style and size', 'Matches barcode'],
		],
	},
	{
		id: 'hoka-clifton',
		brand: 'HOKA',
		product: 'Clifton 10',
		styleCode: '1162030-BBLC',
		size: '9.5',
		gtin: 'Not readable',
		pricePaid: 180,
		payout: 260,
		status: 'review',
		evidence: [
			['Local barcode check', 'Unreadable'],
			['Visible style and size', 'Clear'],
			['StockX variant search', 'One exact match'],
		],
	},
	{
		id: 'puma-speedcat',
		brand: 'PUMA',
		product: 'Speedcat OG',
		styleCode: '398846-02',
		size: '8',
		gtin: '2001122334453',
		pricePaid: 140,
		payout: 205,
		status: 'conflict',
		evidence: [
			['Local barcode check', 'Passed'],
			['Barcode variant size', '8'],
			['Visible label size', '9 - conflict'],
		],
	},
];

const stages = ['Process label', 'Review evidence', 'Create inventory', 'Reconcile sale'];

const formatCurrency = (value) => new Intl.NumberFormat('en-CA', {
	style: 'currency',
	currency: 'CAD',
}).format(value);

function LabelPreview({ sample }) {
	return (
		<div className="sample-label" aria-label={`Synthetic ${sample.brand} ${sample.product} shoe-box label`}>
			<div className="sample-label-brand">{sample.brand}</div>
			<strong>{sample.product}</strong>
			<dl>
				<div><dt>Style</dt><dd>{sample.styleCode}</dd></div>
				<div><dt>US size</dt><dd>{sample.status === 'conflict' ? '9' : sample.size}</dd></div>
				<div><dt>GTIN</dt><dd>{sample.gtin}</dd></div>
			</dl>
			<div className="sample-barcode" aria-hidden="true" />
			<small>SYNTHETIC DEMO LABEL</small>
		</div>
	);
}

function EvidenceStatus({ status }) {
	const labels = {
		verified: ['Verified', 'Product and exact size agree across all evidence.'],
		review: ['Review required', 'One exact variant is plausible, but a person must confirm it.'],
		conflict: ['Blocked', 'Conflicting evidence prevents inventory creation.'],
	};
	const [label, description] = labels[status];

	return (
		<div className={`lifecycle-status lifecycle-status--${status}`}>
			<strong>{label}</strong>
			<span>{description}</span>
		</div>
	);
}

export default function InventoryLifecycleSimulator() {
	const [sampleId, setSampleId] = useState(samples[0].id);
	const [stage, setStage] = useState(0);
	const sample = samples.find((item) => item.id === sampleId) ?? samples[0];
	const totalCost = sample.pricePaid * 1.13;
	const profit = sample.payout - totalCost;

	const reset = () => {
		setSampleId(samples[0].id);
		setStage(0);
	};

	return (
		<div className="interactive-app lifecycle-app">
			<header className="interactive-toolbar">
				<div>
					<strong>Inventory lifecycle</strong>
					<span>Synthetic data - no production services connected</span>
				</div>
				<XpButton variant="secondary" compact onClick={reset}>Reset demo</XpButton>
			</header>

			<ol className="lifecycle-steps" aria-label="Inventory workflow progress">
				{stages.map((label, index) => (
					<li className={index < stage ? 'complete' : index === stage ? 'active' : ''} key={label}>
						<span>{index + 1}</span><strong>{label}</strong>
					</li>
				))}
			</ol>

			<div className="lifecycle-layout">
				<section className="lifecycle-source" aria-labelledby="sample-label-title">
					<div className="pane-heading">
						<div><h2 id="sample-label-title">Sample shoe-box label</h2><p>Choose a safe, synthetic test case.</p></div>
					</div>
					<label className="sample-select">
						<span>Label scenario</span>
						<select value={sampleId} disabled={stage > 0} onChange={(event) => setSampleId(event.target.value)}>
							<option value="adidas-samba">adidas Samba OG - verified</option>
							<option value="hoka-clifton">HOKA Clifton 10 - review required</option>
							<option value="puma-speedcat">PUMA Speedcat OG - conflicting evidence</option>
						</select>
					</label>
					<LabelPreview sample={sample} />
					{stage === 0 && <XpButton onClick={() => setStage(1)}>Process sample label</XpButton>}
				</section>

				<section className="lifecycle-output" aria-live="polite">
					{stage === 0 && (
						<div className="lifecycle-empty">
							<strong>Ready to process</strong>
							<p>The simulator will decode the label, validate its evidence, and resolve an exact product variant.</p>
						</div>
					)}

					{stage === 1 && (
						<>
							<div className="pane-heading"><div><h2>Evidence review</h2><p>Independent signals are checked before inventory can be created.</p></div></div>
						<div className="evidence-list">
							{sample.evidence.map(([label, value]) => (
								<div key={label}><span>{label}</span><strong>{value}</strong></div>
							))}
						</div>
						<EvidenceStatus status={sample.status} />
						{sample.status === 'conflict' ? (
							<XpButton variant="secondary" onClick={() => setStage(0)}>Choose another label</XpButton>
						) : (
							<XpButton onClick={() => setStage(2)}>{sample.status === 'review' ? 'Confirm reviewed draft' : 'Add to inventory'}</XpButton>
						)}
					</>
					)}

					{stage === 2 && (
						<>
							<div className="pane-heading"><div><h2>Inventory created</h2><p>The permanent record is committed before external synchronization.</p></div></div>
						<div className="inventory-record">
							<div><span>Inventory ID</span><strong>INV-001327</strong></div>
							<div><span>Product</span><strong>{sample.brand} {sample.product}</strong></div>
							<div><span>Exact variant</span><strong>{sample.styleCode} / US {sample.size}</strong></div>
							<div><span>SQLite</span><strong className="success-text">Committed</strong></div>
							<div><span>Google Sheets</span><strong className="success-text">Synchronized</strong></div>
						</div>
						<XpButton onClick={() => setStage(3)}>Simulate StockX sale</XpButton>
					</>
					)}

					{stage === 3 && (
						<>
							<div className="pane-heading"><div><h2>Sale reconciled</h2><p>The order matched the first unsold unit with the same style and size.</p></div></div>
						<div className="sale-result">
							<div><span>Match</span><strong>{sample.styleCode} / US {sample.size}</strong></div>
							<div><span>Inventory status</span><strong className="success-text">Sold</strong></div>
						</div>
						<div className="result-metrics lifecycle-metrics">
							<div><span>Cost</span><strong>{formatCurrency(totalCost)}</strong></div>
							<div><span>StockX payout</span><strong>{formatCurrency(sample.payout)}</strong></div>
							<div><span>Net profit</span><strong className="profit-value">{formatCurrency(profit)}</strong></div>
							<div><span>Inventory ID</span><strong>INV-001327</strong></div>
						</div>
						<XpButton variant="secondary" onClick={reset}>Run another scenario</XpButton>
					</>
					)}
				</section>
			</div>

			<footer className="app-status-bar"><span>Production logic represented with synthetic data</span><span>{stage + 1} of {stages.length}</span></footer>
		</div>
	);
}
