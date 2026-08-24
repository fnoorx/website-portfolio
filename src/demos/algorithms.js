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
