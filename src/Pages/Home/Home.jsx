import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import LeftBar from "../../Components/LeftSideContainer/LeftBar";
import MainPost from "../../Components/MainPostContainer/MainPost";
import RightBar from "../../Components/RightSideContainer/RightBar";

const Home = () => {
  return (
    <div className="bg-slate-200 min-h-screen scroll-smooth">
      <Navbar />
      <div className="flex md:justify-between mx-auto pt-14 w-[96%] lg:w-[92%] gap-8">
        <div className="sticky top-20">
          <LeftBar />
        </div>
        <MainPost />
        <div className="sticky top-20 w-1/5">
          <RightBar />
        </div>
      </div>
    </div>
  );
};

export default Home;
