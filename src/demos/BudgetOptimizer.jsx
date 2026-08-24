import { useState } from 'react';
import XpButton from '../components/XpButton';
import { optimizePurchases } from './algorithms';

const sampleProducts = [
	{ id: 'hoka-clifton-10', name: 'HOKA Clifton 10', cost: 180, netProfit: 42 },
	{ id: 'puma-speedcat-og', name: 'PUMA Speedcat OG', cost: 140, netProfit: 30 },
	{ id: 'adidas-samba-og', name: 'adidas Samba OG', cost: 150, netProfit: 55 },
	{ id: 'asics-gel-1130', name: 'ASICS GEL-1130', cost: 140, netProfit: 52 },
	{ id: 'new-balance-9060', name: 'New Balance 9060', cost: 200, netProfit: 70 },
	{ id: 'brooks-glycerin-23', name: 'Brooks Glycerin 23', cost: 200, netProfit: 58 },
];

const formatCurrency = (value) => new Intl.NumberFormat('en-CA', {
	style: 'currency',
	currency: 'CAD',
	maximumFractionDigits: 0,
}).format(value);

export default function BudgetOptimizer() {
	const [products, setProducts] = useState(sampleProducts);
	const [budget, setBudget] = useState(350);
	const [result, setResult] = useState(() => optimizePurchases(sampleProducts, 350));
	const [dirty, setDirty] = useState(false);

	const updateProduct = (id, field, value) => {
		setProducts((current) => current.map((product) => (
			product.id === id
				? { ...product, [field]: field === 'name' ? value : Number(value) }
				: product
		)));
		setDirty(true);
	};

	const removeProduct = (id) => {
		setProducts((current) => current.filter((product) => product.id !== id));
		setDirty(true);
	};

	const addProduct = () => {
		setProducts((current) => [
			...current,
			{ id: `custom-${Date.now()}`, name: 'New product', cost: 100, netProfit: 25 },
		]);
		setDirty(true);
	};

	const runOptimizer = () => {
		setResult(optimizePurchases(products, budget));
		setDirty(false);
	};

	const resetDemo = () => {
		setProducts(sampleProducts);
		setBudget(350);
		setResult(optimizePurchases(sampleProducts, 350));
		setDirty(false);
	};

	return (
		<div className="interactive-app">
			<header className="interactive-toolbar">
				<div>
					<strong>Budget-constrained purchasing</strong>
					<span>0/1 knapsack optimizer</span>
				</div>
				<XpButton variant="secondary" compact onClick={resetDemo}>Reset sample</XpButton>
			</header>

			<div className="optimizer-layout">
				<section className="input-pane" aria-labelledby="candidate-products-title">
					<div className="pane-heading">
						<div>
							<h2 id="candidate-products-title">Candidate products</h2>
							<p>Recognizable products with illustrative pricing; each can be purchased once.</p>
						</div>
						<XpButton variant="secondary" compact onClick={addProduct}>Add product</XpButton>
					</div>

					<div className="data-table-wrap">
						<table className="xp-data-table">
							<thead>
								<tr><th>Product</th><th>Cost</th><th>Net profit</th><th><span className="sr-only">Remove</span></th></tr>
							</thead>
							<tbody>
								{products.map((product) => (
									<tr key={product.id}>
										<td><input aria-label={`Name for ${product.name}`} value={product.name} onChange={(event) => updateProduct(product.id, 'name', event.target.value)} /></td>
										<td><label className="currency-input"><span>$</span><input aria-label={`Cost for ${product.name}`} type="number" min="1" max="10000" value={product.cost} onChange={(event) => updateProduct(product.id, 'cost', event.target.value)} /></label></td>
										<td><label className="currency-input"><span>$</span><input aria-label={`Net profit for ${product.name}`} type="number" min="0" max="10000" value={product.netProfit} onChange={(event) => updateProduct(product.id, 'netProfit', event.target.value)} /></label></td>
										<td><button className="remove-row-button" type="button" onClick={() => removeProduct(product.id)} disabled={products.length <= 2} aria-label={`Remove ${product.name}`} title="Remove product">x</button></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="optimizer-controls">
						<label>
							<span>Available budget</span>
							<span className="currency-input budget-input"><span>$</span><input type="number" min="1" max="10000" value={budget} onChange={(event) => { setBudget(Number(event.target.value)); setDirty(true); }} /></span>
						</label>
						<XpButton onClick={runOptimizer}>Find best purchase plan</XpButton>
					</div>
				</section>

				<section className="result-pane" aria-labelledby="optimizer-result-title">
					<div className="pane-heading result-heading">
						<div>
							<h2 id="optimizer-result-title">Optimal purchase plan</h2>
							<p className={dirty ? 'result-status stale' : 'result-status'}>{dirty ? 'Inputs changed - run again' : 'Optimization complete'}</p>
						</div>
					</div>

					<div className="result-metrics">
						<div><span>Total spend</span><strong>{formatCurrency(result.spent)}</strong></div>
						<div><span>Expected profit</span><strong className="profit-value">{formatCurrency(result.profit)}</strong></div>
						<div><span>Budget left</span><strong>{formatCurrency(result.remaining)}</strong></div>
						<div><span>Plan ROI</span><strong>{result.roi.toFixed(1)}%</strong></div>
					</div>

					<div className="selected-products">
						<h3>Selected products ({result.selected.length})</h3>
						{result.selected.length ? result.selected.map((product) => (
							<div className="selected-product-row" key={product.id}>
								<span>{product.name}</span>
								<span>{formatCurrency(product.cost)}</span>
								<strong>+{formatCurrency(product.netProfit)}</strong>
							</div>
						)) : <p className="empty-result">No products fit within this budget.</p>}
					</div>

					<details className="algorithm-details">
						<summary>How the optimizer chose this plan</summary>
						<p>The dynamic program compares every product against every whole-dollar budget up to {formatCurrency(result.capacity)}. For each product, it keeps the better result between skipping it and purchasing it once.</p>
						<p>Complexity: O(products x budget) time and O(products x budget) space for result reconstruction.</p>
					</details>
				</section>
			</div>
			<footer className="app-status-bar"><span>{products.length} candidates</span><span>Objective: maximize net profit</span></footer>
		</div>
	);
}
