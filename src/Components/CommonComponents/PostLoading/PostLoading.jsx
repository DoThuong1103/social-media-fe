import React from "react";
// import { ping } from "ldrs";
import "./PostLoading.css";
// ping.register();

// Default values shown

const PostLoading = () => {
  return (
    <div className="flex flex-1 flex-col w-full gap-5 my-2">
      <div className="flex flex-col justify-between w-full h-[500px] bg-white rounded-lg p-3 gap-4">
        <div className="flex gap-2 items-center">
          <div className="relative h-10 w-10 bg-[#ededed] rounded-full overflow-hidden ">
            <div className="absolute gradient-div w-2 h-full"></div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="relative h-3 w-16 bg-[#ededed] overflow-hidden ">
              <div className="absolute gradient-div-1 w-full h-2 rotate-[-45deg]"></div>
            </div>
            <div className="relative h-3 w-12 bg-[#ededed] overflow-hidden ">
              <div className="absolute gradient-div-1 w-full h-2"></div>
            </div>
          </div>
        </div>
        <div className="relative flex-1 bg-[#ededed] rounded-md overflow-hidden ">
          <div className="absolute gradient-div-2 w-[120%] h-4 rotate-[-45deg]"></div>
        </div>
        {/* <l-ping size="45" speed="2" color="black"></l-ping> */}
        <div className="flex justify-around gap-16 px-4">
          <div className="relative flex-1 bg-[#ededed] h-8 rounded-md overflow-hidden">
            <div className="absolute gradient-div-1 w-full h-2 rotate-[-45deg]"></div>
          </div>
          <div className="relative flex-1 bg-[#ededed] h-8 rounded-md overflow-hidden">
            <div className="absolute gradient-div-1 w-full h-2 rotate-[-45deg]"></div>
          </div>
          <div className="relative flex-1 bg-[#ededed] h-8 rounded-md overflow-hidden">
            <div className="absolute gradient-div-1 w-full h-2 rotate-[-45deg]"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between w-full h-[500px] bg-white rounded-lg p-3 gap-4">
        <div className="flex gap-2 items-center">
          <div className="relative h-10 w-10 bg-[#ededed] rounded-full overflow-hidden ">
            <div className="absolute gradient-div w-2 h-full"></div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="relative h-3 w-16 bg-[#ededed] overflow-hidden ">
              <div className="absolute gradient-div-1 w-full h-2 rotate-[-45deg]"></div>
            </div>
            <div className="relative h-3 w-12 bg-[#ededed] overflow-hidden ">
              <div className="absolute gradient-div-1 w-full h-2"></div>
            </div>
          </div>
        </div>
        <div className="relative flex-1 bg-[#ededed] rounded-md overflow-hidden ">
          <div className="absolute gradient-div-2 w-[120%] h-4 rotate-[-45deg]"></div>
        </div>
        {/* <l-ping size="45" speed="2" color="black"></l-ping> */}
        <div className="flex justify-around gap-16 px-4">
          <div className="relative flex-1 bg-[#ededed] h-8 rounded-md overflow-hidden">
            <div className="absolute gradient-div-1 w-full h-2 rotate-[-45deg]"></div>
          </div>
          <div className="relative flex-1 bg-[#ededed] h-8 rounded-md overflow-hidden">
            <div className="absolute gradient-div-1 w-full h-2 rotate-[-45deg]"></div>
          </div>
          <div className="relative flex-1 bg-[#ededed] h-8 rounded-md overflow-hidden">
            <div className="absolute gradient-div-1 w-full h-2 rotate-[-45deg]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostLoading;
