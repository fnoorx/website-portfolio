export function optimizePurchases(products, budget) {
	const capacity = Math.min(10000, Math.max(0, Math.floor(Number(budget) || 0)));
	const candidates = products
		.map((product) => ({
			...product,
			cost: Math.max(0, Math.round(Number(product.cost) || 0)),
			netProfit: Math.max(0, Number(product.netProfit) || 0),
		}))
		.filter((product) => product.name.trim() && product.cost > 0 && product.cost <= capacity);

	const table = Array.from(
		{ length: candidates.length + 1 },
		() => new Float64Array(capacity + 1),
	);

	for (let itemIndex = 1; itemIndex <= candidates.length; itemIndex += 1) {
		const product = candidates[itemIndex - 1];

		for (let currentBudget = 0; currentBudget <= capacity; currentBudget += 1) {
			const withoutProduct = table[itemIndex - 1][currentBudget];
			const withProduct = product.cost <= currentBudget
				? table[itemIndex - 1][currentBudget - product.cost] + product.netProfit
				: -1;
			table[itemIndex][currentBudget] = Math.max(withoutProduct, withProduct);
		}
	}

	const selected = [];
	let remainingBudget = capacity;

	for (let itemIndex = candidates.length; itemIndex > 0; itemIndex -= 1) {
		if (table[itemIndex][remainingBudget] > table[itemIndex - 1][remainingBudget] + 0.0001) {
			const product = candidates[itemIndex - 1];
			selected.unshift(product);
			remainingBudget -= product.cost;
		}
	}

	const spent = selected.reduce((total, product) => total + product.cost, 0);
	const profit = selected.reduce((total, product) => total + product.netProfit, 0);

	return {
		selected,
		spent,
		profit,
		remaining: capacity - spent,
		roi: spent > 0 ? (profit / spent) * 100 : 0,
		capacity,
	};
}

export function simulateMarketAlerts(prices, windowSize, thresholdPercent) {
	const normalizedPrices = prices.filter((price) => Number.isFinite(price) && price > 0);
	const period = Math.max(2, Math.min(10, Math.floor(Number(windowSize) || 3)));
	const threshold = Math.max(0.1, Number(thresholdPercent) || 4);
	const signals = [];

	for (let index = period; index < normalizedPrices.length; index += 1) {
		const history = normalizedPrices.slice(index - period, index);
		const baseline = history.reduce((total, price) => total + price, 0) / history.length;
		const price = normalizedPrices[index];
		const change = ((price - baseline) / baseline) * 100;

		if (Math.abs(change) >= threshold) {
			signals.push({
				index,
				price,
				change,
				type: change > 0 ? 'Momentum breakout' : 'Downside alert',
			});
		}
	}

	return { prices: normalizedPrices, period, signals };
}
