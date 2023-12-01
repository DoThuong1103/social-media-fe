import React, { useEffect, useState } from "react";
import ProfileImg from "../CommonComponents/Img/ProfileImg";

import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { notify } from "../../Redux/notify";
import AddFriendContainer from "../CommonComponents/FollowingContainer";

const LeftBar = () => {
  const userDetails = useSelector((state) => state.user);
  const accessToken = userDetails.user.accessToken;
  const [userFollow, setUserFollow] = useState([]);
  const [friendRequest, setFriendRequest] = useState(null);

  const getSuggest = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/user/suggestions`,
        {
          headers: {
            token: accessToken,
          },
        }
      );
      setUserFollow(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getFriendRequest = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/user/friendRequest`,
        {
          headers: {
            token: accessToken,
          },
        }
      );
      setFriendRequest(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSuggest();
    getFriendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcceptReq = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/user/acceptFriend/${id}`,
        {},
        {
          headers: {
            token: accessToken,
          },
        }
      );
      getFriendRequest();
    } catch (error) {
      notify(
        "error",
        "Something went wrong. Please try again later."
      );
    }
  };

  const handleDeleteReq = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/user/deleteRequestFriend/${id}`,
        {},
        {
          headers: {
            token: accessToken,
          },
        }
      );
      getFriendRequest();
    } catch (error) {
      notify(
        "error",
        "Something went wrong. Please try again later."
      );
    }
  };

  const handleAddFriend = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/user/addFriend/${id}`,
        {},
        {
          headers: {
            token: accessToken,
          },
        }
      );
      getSuggest();
    } catch (error) {
      notify(
        "error",
        "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <div className="hidden lg:flex sticky top-[80px] flex-col h-screen">
      <div className="flex flex-col gap-4 w-[280px] h-2/5 bg-white rounded-2xl py-2 px-4 mx-auto">
        <div className="flex justify-between items-end">
          <p className="text-xl font-bold ">Suggested for you</p>
          <Link to={"/friends/suggestions"}>
            <p className="text-[#aaa] cursor-pointer">All</p>
          </Link>
        </div>
        <div className=" flex flex-col gap-2 h-full overflow-hidden overflow-y-scroll pr-4">
          {userFollow?.splice(0, 5)?.map((user) => (
            <div key={user._id}>
              <AddFriendContainer
                user={user}
                onClick={() => handleAddFriend(user._id)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[280px] h-2/5 bg-white mt-6 rounded-2xl py-2 px-4 mx-auto">
        <div className="flex justify-between items-end">
          <p className="text-xl font-bold ">Friend Requests</p>
          <Link to={"/friends/requests"}>
            <p className="text-[#aaa] cursor-pointer">All</p>
          </Link>
        </div>
        <div className=" flex flex-col gap-2 h-full overflow-hidden overflow-y-scroll pr-4">
          {friendRequest?.splice(0, 5)?.map((user) => (
            <div key={user._id}>
              <div className="flex gap-2 items-end">
                <Link to={`/profile/${user._id}`}>
                  <ProfileImg src={user.avatar} size="medium" />
                </Link>
                <div className="flex flex-col gap-[2px] w-full">
                  {" "}
                  <Link to={`/profile/${user._id}`}>
                    <span>{user.username}</span>
                  </Link>
                  <div className="flex gap-4 w-full ">
                    <button
                      className="flex-1 bg-[#0861F2] text-white rounded py-[2px] bg-opacity-80 hover:bg-opacity-100 transition-all"
                      onClick={() => handleAcceptReq(user._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="flex-1 bg-[#cfcfcf] rounded py-[2px] bg-opacity-80 hover:bg-opacity-100 transition-all"
                      onClick={() => handleDeleteReq(user._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
