import React, { useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

import {
  BiSolidUserDetail,
  BiSolidUserPlus,
  BiSolidUserVoice,
} from "react-icons/bi";
import { IoReorderThree, IoClose } from "react-icons/io5";
const LeftBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const items = [
    {
      id: "",
      name: "All friends",
      icon: <BiSolidUserDetail className="w-6 h-6" />,
    },
    {
      id: "friendRequest",
      name: "Friend Requests",
      icon: <BiSolidUserPlus className="w-6 h-6 scale-x-[-1]" />,
    },
    {
      id: "suggestions",
      name: "Suggestions",
      icon: <BiSolidUserVoice className="w-6 h-6" />,
    },
    {
      id: "yourRequests",
      name: "Your Request",
      icon: <BiSolidUserPlus className="w-6 h-6 " />,
    },
  ];
  return (
    <div
      className={`flex flex-col bg-white ${
        isOpen ? "w-[200px]" : "w-fit"
      }  md:w-[300px] lg:w-[320px] py-4 px-2 shadow-md transition-all`}
      style={{
        maxHeight: "calc(100vh - 48px)",
        height: "calc(100vh - 48px)",
      }}
    >
      <div
        className={`flex ${
          isOpen ? "justify-end" : "justify-center"
        } md:justify-start `}
      >
        {isOpen ? (
          <IoClose
            className="w-6 h-6 md:hidden "
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : (
          <IoReorderThree
            className="w-6 h-6 md:hidden "
            onClick={() => setIsOpen(!isOpen)}
          />
        )}

        <span className="font-bold text-3xl px-2 hidden md:block">
          Friends
        </span>
      </div>
      <div className="flex flex-col pt-4 gap-4">
        {items.map((item, index) => (
          <Link
            to={`${item.id}`}
            className={`flex justify-between items-center px-2 hover:bg-slate-300 py-2 rounded cursor-pointer transition-all`}
            // onClick={() => test(item.id)}
            key={index}
          >
            <div className="flex gap-2 items-center">
              <div>{item.icon}</div>
              <span
                className={`font-semibold text-lg ${
                  isOpen ? "block" : "hidden"
                } md:block`}
              >
                {item.name}
              </span>
            </div>
            <MdOutlineKeyboardArrowRight className="w-6 h-6 hidden md:block" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LeftBar;
