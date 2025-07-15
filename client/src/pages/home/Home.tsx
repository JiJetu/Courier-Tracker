import { Helmet } from "react-helmet-async";
import Hero from "../../components/home/Hero";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>CourierTracker | Home</title>
      </Helmet>

      <Hero />
    </>
  );
};

export default Home;
