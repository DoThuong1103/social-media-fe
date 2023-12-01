import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BiSolidUserDetail } from "react-icons/bi";
import { Link } from "react-router-dom";
const LeftBar = ({ test }) => {
  const items = [
    {
      id: "",
      name: "All friends",
      icon: <BiSolidUserDetail className="w-6 h-6" />,
    },
    {
      id: "friendRequest",
      name: "Friend Requests",
      icon: <MdOutlineKeyboardArrowRight className="w-6 h-6" />,
    },
    {
      id: "suggestions",
      name: "Suggestions",
      icon: <MdOutlineKeyboardArrowRight className="w-6 h-6" />,
    },
    {
      id: "yourRequests",
      name: "Your Request",
      icon: <MdOutlineKeyboardArrowRight className="w-6 h-6" />,
    },
  ];
  return (
    <div className="flex flex-col bg-white w-[360px] h-screen py-4 px-2 ">
      <span className="font-bold text-3xl px-2">Friends</span>
      <div className="flex flex-col pt-4 gap-4">
        {items.map((item, index) => (
          <Link
            to={`${item.id}`}
            className={`flex justify-between items-center px-2 hover:bg-slate-300 py-2 rounded cursor-pointer transition-all`}
            onClick={() => test(item.id)}
            key={index}
          >
            <span className="font-semibold text-lg">{item.name}</span>
            <MdOutlineKeyboardArrowRight className="w-6 h-6" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LeftBar;
