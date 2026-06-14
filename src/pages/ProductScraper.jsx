import Navbar from '../components/Navbar';
import './ProjectPage.css';

const ProductScraper = () => {
	return (
		<>
			<Navbar />
			<main className="project-page">
				<a className="project-page-back" href="/#projects">
					Back to projects
				</a>
				<h1>Product Scraper</h1>
				<p>
					Write the full project description here. Include the problem, stack,
					what you built, and what made it technically interesting.
				</p>
				<div className="project-page-video">Embedded video area</div>
			</main>
		</>
	);
};

export default ProductScraper;
