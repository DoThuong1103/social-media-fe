import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProfileImg from "../CommonComponents/Img/ProfileImg";
import MoreOption from "../../Images/more.png";
import axios from "axios";
const MemberContainer = ({
  friend,
  groupId,
  getGroupDetail,
  isAdmin,
}) => {
  const { user, accessToken } = useSelector((state) => state.user);
  const [showMoreOption, setShowMoreOption] = useState(false);

  const handleElevateToAdmin = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACK_END_URL}/group/updateGroup/${groupId}`,
        {
          elevateAdmin: id,
        },
        {
          headers: {
            token: accessToken,
          },
        }
      );
      getGroupDetail();
    } catch (error) {}
  };

  const handleBanFromGroup = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACK_END_URL}/group/updateGroup/${groupId}`,
        {
          removeUser: id,
        },
        {
          headers: {
            token: accessToken,
          },
        }
      );
      getGroupDetail();
    } catch (error) {}
  };
  return (
    <div className="flex gap-2 justify-between items-center pr-2 w-full">
      <div className="flex gap-2 items-center">
        <ProfileImg src={friend?.user?.avatar} size="medium" />
        <span>
          {friend?.user?.username}{" "}
          <span className="text-xs text-[#aaa]">
            ({friend?.role}
            {friend?.user?._id === user?._id ? " - you" : ""})
          </span>
        </span>
      </div>
      {friend?.user?._id !== user?._id && (
        <div className="relative">
          <img
            src={MoreOption}
            className="w-5 ml-auto cursor-pointer"
            alt=""
            onClick={() => setShowMoreOption(!showMoreOption)}
          />
          {showMoreOption && (
            <div className="absolute top-4 right-0 w-[200px] max-h-[120px] bg-white shadow z-10 py-1 flex flex-col gap-2">
              <span className="cursor-pointer w-full hover:bg-slate-200 transition-all px-2 py-1 rounded">
                Add friend
              </span>
              {isAdmin &&
                (friend?.role !== "admin" ? (
                  <span
                    className="cursor-pointer w-full hover:bg-slate-200 transition-all px-2 py-1 rounded"
                    onClick={() => {
                      handleElevateToAdmin(friend?.user?._id);
                      setShowMoreOption(false);
                    }}
                  >
                    Elevate to admin
                  </span>
                ) : (
                  <span
                    className="cursor-pointer w-full hover:bg-slate-200 transition-all px-2 py-1 rounded"
                    onClick={() => {
                      handleElevateToAdmin(friend?.user?._id);
                      setShowMoreOption(false);
                    }}
                  >
                    Remote to admin
                  </span>
                ))}
              {isAdmin && (
                <span
                  className="cursor-pointer w-full hover:bg-slate-200 transition-all px-2 py-1 rounded"
                  onClick={() => {
                    handleBanFromGroup(friend?.user?._id);
                    setShowMoreOption(false);
                  }}
                >
                  Remove from group
                </span>
              )}
            </div>
          )}
          {showMoreOption && (
            <div
              className="fixed w-screen h-screen top-0 left-0 z-[2]"
              onClick={() => setShowMoreOption(false)}
            ></div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberContainer;
