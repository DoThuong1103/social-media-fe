import React, { useEffect, useState } from "react";
import ChatContainer from "../../Components/ChatContainer/ChatContainer";
import Contact from "../../Components/Contact/Contact";
import Navbar from "../../Components/Navbar/Navbar";
import { AiOutlineMessage } from "react-icons/ai";
import axios from "axios";
import { useSelector } from "react-redux";
const Chat = () => {
  const [currentChatUser, setCurrentChatUser] = useState("");
  const [users, setUsers] = useState(null);
  const userDetails = useSelector((state) => state.user);
  const user = userDetails.user;
  const id = user._id;
  const accessToken = userDetails.accessToken;
  const getUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/user/allFriend/${id}`,
        {
          headers: {
            token: `${accessToken}`,
          },
        }
      );
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  console.log(users);
  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="pt-14 flex h-screen w-full">
        <Contact
          setCurrentChatUser={setCurrentChatUser}
          users={users}
        />
        {currentChatUser ? (
          <ChatContainer
            currentChatUser={currentChatUser}
            getUsers={getUsers}
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center ">
            <AiOutlineMessage className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 -z-1 text-gray-200" />
            <span className="text-gray-400 z-10 font-bold text-xl">
              Open your chat with your friends
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
