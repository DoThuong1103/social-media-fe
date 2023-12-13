import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import UserImg from "../../Images/icons8-user-100.png";

const MainPost = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [friends, setFriends] = useState(null);

  let params = useParams();
  // eslint-disable-next-line no-unused-vars
  const { org, "*": splat } = params;
  const userDetails = useSelector((state) => state.user);
  const accessToken = userDetails.accessToken;
  const getFriend = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/user/${
          splat === "" ? `allFriend/${userDetails?.user?._id}` : splat
        }`,
        {
          headers: {
            token: accessToken,
          },
        }
      );
      setFriends(res.data);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFriend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splat]);

  const handleRequest = async (params) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACK_END_URL}/user/${params}`,
        {},
        {
          headers: {
            token: accessToken,
          },
        }
      );
      getFriend();
      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  };
  const title =
    splat === ""
      ? "All Friends"
      : splat === "friendRequest"
      ? "Friend Requests"
      : splat === "friendRequest"
      ? "People you may know"
      : "Your Request";
  return (
    <div
      className="flex-1 overflow-hidden overflow-y-scroll"
      style={{
        maxHeight: "calc(100vh - 48px)",
        height: "calc(100vh - 48px)",
      }}
    >
      {isFetching && (
        <div className="w-full h-full flex items-center justify-center">
          <l-tailspin
            size="28"
            stroke="4"
            speed="1"
            color="black"
          ></l-tailspin>
        </div>
      )}
      {!isFetching && friends?.length > 0 && (
        <div className="w-full h-full flex flex-col p-4 gap-10">
          <span className="font-bold text-3xl">
            {title}({friends?.length || 0})
          </span>
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8">
            {friends?.map((friend, index) => (
              <div
                className="flex flex-col first-letter:w-full h-[300px] sm:h-[360px] bg-white rounded-t-md overflow-hidden"
                key={index}
              >
                <img
                  className="w-full h-48 sm:h-60 object-cover border-b-2"
                  src={friend.avatar || UserImg}
                  alt=""
                />
                <div className="flex flex-col flex-1 p-2">
                  <div>
                    <span className="font-semibold text-lg">
                      {friend.username}
                    </span>
                    {friend?.mutualFriends?.length > 0 && (
                      <span>
                        ({friend?.mutualFriends?.length} mutual)
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 w-full justify-center flex-1">
                    <div
                      className={`${
                        splat === "yourRequests" || splat === ""
                          ? "hidden"
                          : "block"
                      } w-full text-center bg-[#0861F2] py-[3px] hover:bg-opacity-80 text-white transition-all cursor-pointer rounded`}
                      onClick={() =>
                        handleRequest(
                          splat === "friendRequest"
                            ? `acceptFriend/${friend._id}`
                            : splat === "suggestions"
                            ? `addFriend/${friend._id}`
                            : ``
                        )
                      }
                    >
                      {splat === "friendRequest"
                        ? "Confirm"
                        : splat === "suggestions"
                        ? "Add friend"
                        : ""}
                    </div>
                    <div
                      className={`${
                        splat === "friendRequest" ||
                        splat === "yourRequests" ||
                        splat === ""
                          ? "block"
                          : "hidden"
                      } w-full text-center bg-slate-200 py-[2px] hover:bg-slate-300 transition-all cursor-pointer`}
                      onClick={() =>
                        handleRequest(
                          splat === ""
                            ? `unFriend/${friend._id}`
                            : splat === "friendRequest"
                            ? `deleteRequestFriend/${friend._id}`
                            : splat === "yourRequests"
                            ? `cancelAddFriend/${friend._id}`
                            : ""
                        )
                      }
                    >
                      {splat === "friendRequest"
                        ? "Delete"
                        : splat === "yourRequests"
                        ? "Cancel"
                        : "Unfriend"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {friends?.length === 0 && (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-2xl text-[#aaa] font-semibold">
            No {title === "All Friends" ? "friends" : title}
          </span>
        </div>
      )}
    </div>
  );
};

export default MainPost;
