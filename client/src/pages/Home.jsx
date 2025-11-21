import Banner from "../components/Banner";
import BestSeller from "../components/BestSeller";
import Category from "../components/Category";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Banner />
      <Category />
      <BestSeller />
      <NewsLetter />
    </div>
  );
};

export default Home;