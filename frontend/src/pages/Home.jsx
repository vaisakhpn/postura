import React from "react";
import Header from "../components/ui/Header";
import Features from "../components/ui/Features";
import Footer from "../components/ui/Footer";

const Home = () => {
  return (
    <div className="w-full ">
      <div>
        <Header />
        <Features />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
