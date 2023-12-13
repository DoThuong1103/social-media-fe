import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfileImg from "../CommonComponents/Img/ProfileImg";
import SearchIcon from "../../Images/search.png";
import Icon from "../CommonComponents/Img/Icon";
import Time from "../CommonComponents/Time";
import { IoClose, IoReorderThree } from "react-icons/io5";

const Contact = ({ setCurrentChatUser, users }) => {
  const [dataUsers, setDataUsers] = useState(null);
  const userDetails = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const user = userDetails.user;
  const id = user._id;
  const handleShowMessage = (user) => {
    setCurrentChatUser(user);
  };

  useEffect(() => {
    const listUser = users?.map((item) => {
      item.isOnline = userDetails.online?.some(
        (element) => item._id === element
      );
      return item;
    });
    const sortedUsers = listUser?.sort(
      (a, b) =>
        Date.parse(b?.messages?.createdAt) -
        Date.parse(a?.messages?.createdAt)
    );
    setDataUsers(sortedUsers);
  }, [users, userDetails.online]);
  return (
    <div
      className={`flex flex-col gap-4 ${
        isOpen ? "w-[200px]" : "w-[50px]"
      } w-[300px] bg-slate-200 items-center pt-6 `}
    >
      <div className="flex flex-col gap-2 items-center">
        <div
          className={`flex md:hidden  w-full ${
            isOpen ? "justify-end" : "justify-center"
          }`}
          onClick={() => setIsOpen(!isOpen)}
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
        </div>
        <div className="flex items-center bg-white w-[90%] rounded-md py-1 px-2">
          <Icon src={SearchIcon} />
          <input
            type="text"
            className={`w-[90%]  outline-none px-2 bg-transparent ${
              isOpen ? "block" : "hidden"
            } md:block`}
            placeholder="Search"
            onChange={(e) => {
              setDataUsers(
                users?.filter((user) =>
                  user.username
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
                )
              );
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-[90%]">
        {dataUsers?.map((user, index) => (
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => handleShowMessage(user)}
            key={index}
          >
            <div className="relative">
              <ProfileImg src={user.avatar} size="medium" />
              <div
                className={`absolute bottom-1 right-0 h-3 w-3 rounded-full ${
                  user.isOnline ? "bg-green-600" : "bg-gray-500"
                }`}
              ></div>
            </div>
            <div
              className={` flex-col gap-1 ${
                isOpen ? "flex" : "hidden"
              } md:flex`}
            >
              <p className="font-semibold">{user.username}</p>
              <div className="flex gap-[2px] items-center text-xs text-[#aaa]">
                <p className="">
                  {user?.messages?.sender === id ? "You: " : ""}
                  {user?.messages?.message}
                </p>
                {user?.messages?.createdAt && (
                  <>
                    <p className="pb-[2px]">.</p>
                    <Time times={user?.messages?.createdAt} />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
