import React, { useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

import { GoPlus } from "react-icons/go";
import { IoReorderThree, IoClose } from "react-icons/io5";
import { MdOutlineFeed } from "react-icons/md";
import { RiMailAddLine } from "react-icons/ri";
import { FaUsersViewfinder } from "react-icons/fa6";
const LeftBar = ({ setIsOpenDialogCreateGroup, splat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const items = [
    {
      id: "",
      name: "Your feed",
      icon: <MdOutlineFeed className="w-6 h-6" />,
    },
    {
      id: "invitationGroup",
      name: "Invitation to join the group",
      icon: <RiMailAddLine className="w-6 h-6" />,
    },
    {
      id: "joinedGroup",
      name: "Groups you've joined",
      icon: <FaUsersViewfinder className="w-6 h-6" />,
    },
  ];
  return (
    <div
      className={`flex flex-col bg-white ${
        isOpen ? "w-[200px]" : "w-fit"
      }  md:w-[240px] lg:w-[320px] 3xl:w-[400px]  pt-8 md:pt-6 py-4 px-2 shadow-md transition-all`}
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
          Groups
        </span>
      </div>
      <div className="flex flex-col pt-4 gap-4">
        {items.map((item, index) => (
          <Link
            to={`${item.id}`}
            className={`${
              splat === item.id ? "bg-slate-300" : ""
            }  flex justify-between items-center px-2 hover:bg-slate-300 py-2 rounded cursor-pointer transition-all`}
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
        <div
          className="flex items-center py-2 gap-2 w-full text-center justify-center text-[#0861F2] bg-[#cadeff] font-semibold group rounded-md cursor-pointer hover:bg-opacity-80 transition-all"
          onClick={() => setIsOpenDialogCreateGroup(true)}
        >
          <GoPlus className="group-hover:rotate-90 transition-all duration-500 w-5 h-5" />
          <span
            className={`font-semibold text-lg ${
              isOpen ? "block" : "hidden"
            } md:block`}
          >
            Create new group
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
