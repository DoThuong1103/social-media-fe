import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfileImg from "../CommonComponents/Img/ProfileImg";
import SearchIcon from "../../Images/search.png";
import Icon from "../CommonComponents/Img/Icon";
import Time from "../CommonComponents/Time";

const Contact = ({ setCurrentChatUser, users }) => {
  // const [users, setUsers] = useState(null);
  const [dataUsers, setDataUsers] = useState(null);
  const userDetails = useSelector((state) => state.user);
  // const [lastMess, setLastMess] = useState(userDetails)
  const user = userDetails.user;
  const id = user._id;
  const accessToken = userDetails.accessToken;
  // useEffect(() => {
  //   const getUsers = async () => {
  //     try {
  //       const res = await axios.get(
  //         `http://localhost:5000/api/user/allFriend`,
  //         {
  //           headers: {
  //             token: `${accessToken}`,
  //           },
  //         }
  //       );
  //       setUsers(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getUsers();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
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
        a?.comments?.comment?.createdAt -
        b?.comments?.comment?.createdAt
    );
    setDataUsers(sortedUsers);
  }, [users, userDetails.online]);
  return (
    <div className="flex flex-col gap-4 w-[300px] bg-slate-200 items-center">
      <div className="flex items-center bg-white mt-4 w-[90%] rounded-md px-2">
        <Icon src={SearchIcon} />
        <input
          type="text"
          className="w-[90%] py-1  outline-none px-2 bg-transparent"
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
            <div className="flex flex-col gap-1">
              <p className="font-semibold">{user.username}</p>
              <div className="flex gap-[2px] items-center text-xs text-[#aaa]">
                <p className="">
                  {user?.messages?.sender === id ? "You: " : ""}
                  {user?.messages?.message}
                </p>
                <p className="pb-[2px]">.</p>
                <Time times={user?.messages?.createdAt} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
