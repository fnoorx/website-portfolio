import Navbar from '../components/Navbar';
import Introduction from '../components/Introduction';
import ProjectLinks from '../components/ProjectLinks';
import './Home.css';

const Home = () => {
  	return (
    	<>
			<Navbar />
			<main className="home-page">
				<Introduction />
				<ProjectLinks />
			</main>
    	</>
  	);
};

export default Home;
