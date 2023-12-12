import React, { useEffect, useState } from "react";
import ProfileImg from "../CommonComponents/Img/ProfileImg";

import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { notify } from "../../Redux/notify";
import AddFriendContainer from "../CommonComponents/FollowingContainer";

const LeftBar = () => {
  const userDetails = useSelector((state) => state.user);
  const accessToken = userDetails.accessToken;
  const [userSuggested, setUserSuggested] = useState();
  const [friendRequest, setFriendRequest] = useState(null);

  const getSuggest = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/user/suggestions`,
        {
          headers: {
            token: accessToken,
          },
        }
      );
      setUserSuggested(res.data.splice(0, 5));
    } catch (error) {
      console.log(error);
    }
  };
  const getFriendRequest = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/user/friendRequest`,
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
    if (accessToken) {
      getSuggest();
      getFriendRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleAcceptReq = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACK_END_URL}/user/acceptFriend/${id}`,
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
        `${process.env.REACT_APP_BACK_END_URL}/user/deleteRequestFriend/${id}`,
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
        `${process.env.REACT_APP_BACK_END_URL}/user/addFriend/${id}`,
        {},
        {
          headers: {
            token: accessToken,
          },
        }
      );
      getSuggest();
      notify("success", "Friend request has been sent successfully");
    } catch (error) {
      notify(
        "error",
        "Something went wrong. Please try again later."
      );
    }
  };
  return (
    <div className="hidden md:flex sticky top-[80px] flex-col h-screen">
      <div className="flex flex-col gap-4 w-[240px] lg:w-[280px] h-2/5 bg-white rounded-2xl py-2 pl-2 lg:px-4 mx-auto">
        <div className="flex justify-between items-end">
          <p className="text-xl font-bold ">Suggested for you</p>
          <Link to={"/friends/suggestions"}>
            <p className="text-[#aaa] cursor-pointer pr-2 lg:pr-0">
              All
            </p>
          </Link>
        </div>
        <div className=" flex flex-col gap-2 h-full overflow-hidden overflow-y-scroll pr-4">
          {userSuggested?.map((user) => (
            <div key={user._id}>
              <AddFriendContainer
                user={user}
                onClick={() => handleAddFriend(user._id)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[240px] lg:w-[280px] h-2/5 bg-white mt-6 rounded-2xl py-2 pl-2 lg:px-4 mx-auto">
        <div className="flex justify-between items-end">
          <p className="text-xl font-bold ">Friend Requests</p>
          <Link to={"/friends/friendRequest"}>
            <p className="text-[#aaa] cursor-pointer pr-2 lg:pr-0">
              All
            </p>
          </Link>
        </div>
        {friendRequest?.length === 0 && (
          <span>No Friend Requests</span>
        )}
        <div className=" flex flex-col gap-2 h-full overflow-hidden overflow-y-scroll ">
          {friendRequest?.map((user) => (
            <div key={user._id}>
              <div className="flex gap-2 items-end">
                <div className="flex items-center justify-center">
                  <Link to={`/profile/${user._id}`}>
                    <ProfileImg src={user.avatar} size="medium" />
                  </Link>
                </div>
                <div className="flex-1 flex flex-col gap-[2px] w-full">
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
