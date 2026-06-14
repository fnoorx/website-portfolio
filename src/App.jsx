import Home from './pages/Home';
import MarketData from './pages/MarketData';
import ProductScraper from './pages/ProductScraper';

const App = () => {
	const path = window.location.pathname;

	if (path === '/product-scraper') {
		return <ProductScraper />;
	}

	if (path === '/market-data-bot') {
		return <MarketData />;
	}

	return <Home />;
};

export default App;
