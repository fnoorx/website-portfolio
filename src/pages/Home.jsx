import Navbar from '../components/Navbar';
import Introduction from '../components/Introduction';
import './Home.css';

const Home = () => {
  	return (
    	<>
			<Navbar />
			<main className="home-page">
				<Introduction />
			</main>
    	</>
  	);
};

export default Home;
