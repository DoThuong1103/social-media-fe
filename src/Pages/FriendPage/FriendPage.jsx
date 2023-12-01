import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import LeftBar from "../../Components/FriendPageLeftSideContainer/LeftBar";
import MainPost from "../../Components/FriendMainPostContainer/MainPost";

const FriendPage = () => {
  const test = (data) => {
    console.log(data);
  };
  return (
    <div className="bg-slate-200 min-h-screen scroll-smooth">
      {/* <Navbar /> */}
      <div className="flex md:justify-between mx-auto pt-14 w-full gap-8">
        <div className="sticky top-20">
          <LeftBar test={test} />
        </div>
        <MainPost />
      </div>
    </div>
  );
};

export default FriendPage;
