import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Navbar from "../components/navbar/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-130px)] dark:bg-black">
        <Outlet />
      </div>

      <Footer />
    </>
  );
};

export default MainLayout;
