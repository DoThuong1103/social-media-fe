import React, { useEffect, useState } from "react";
import ProfileImg from "../CommonComponents/Img/ProfileImg";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { useSelector } from "react-redux";
import { notify } from "../../Redux/notify";

const InviteFriend = ({
  allFriends,
  setIsOpenInviteFriendDiaLog,
  groupId,
  getFriends,
}) => {
  const [inviteFriends, setInviteFriends] = useState([]);
  const [idFriends, setIdFriends] = useState([]);
  const { accessToken } = useSelector((state) => state.user);

  const filterFriends = allFriends?.filter(
    (friend) =>
      !(friend?.invitationGroup?.includes(groupId) ?? true) &&
      !(friend?.groupRequest?.includes(groupId) ?? true) &&
      !(friend?.group?.includes(groupId) ?? true)
  );
  const handleAddInviteFriends = (friend) => {
    if (inviteFriends.length === 0) {
      setInviteFriends([friend]);
    }
    inviteFriends.some((item) => item._id === friend._id)
      ? setInviteFriends(
          inviteFriends.filter((item) => item._id !== friend._id)
        )
      : setInviteFriends([...inviteFriends, friend]);
    // setIdFriends([...idFriends, friend._id]);
  };
  useEffect(() => {
    setIdFriends(inviteFriends.map((item) => item._id));
  }, [inviteFriends]);
  const handleRemoveFriends = (friend, e) => {
    e.stopPropagation();
    setInviteFriends(
      inviteFriends.filter((item) => item._id !== friend._id)
    );
  };
  const handleInviteFriends = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/group/sendInvitations`,
        {
          userIds: idFriends,
          groupId: groupId,
        },
        {
          headers: {
            token: `${accessToken}`,
          },
        }
      );
      getFriends();
      notify("success", "Invitation has been sent successfully!");
      setInviteFriends([]);
      setIdFriends([]);
    } catch (error) {
      notify(
        "error",
        "Something went wrong. Please try again later!"
      );
    }
  };

  return (
    <div className="fixed flex flex-col gap-4 w-1/2 min-h-80 top-1/2 l-1/2 translate-x-1/2 -translate-y-1/2 z-30 bg-white shadow-lg px-4 py-2 rounded">
      <span className="text-lg md:text-xl lg:text-xl font-semibold">
        Invite friends to the group
      </span>
      <div className="grid grid-cols-2 gap-6 min-h-60 ">
        <div className="flex flex-col gap-2 h-60 max-h-60 overflow-hidden overflow-y-scroll">
          {filterFriends?.map((friend, index) => (
            <label
              htmlFor={index}
              className="flex items-center justify-between pr-2"
              onClick={() => handleAddInviteFriends(friend)}
              key={index}
            >
              <div className="flex items-center gap-2">
                <ProfileImg src={friend?.avatar} />
                <span>{friend?.username}</span>
              </div>
              <input
                type="checkbox"
                name=""
                id={index}
                checked={inviteFriends.some(
                  (item) => item._id === friend._id
                )}
                className="accent-blue-500 w-4 h-4"
              />
            </label>
          ))}
        </div>
        <div className="flex flex-wrap  justify-start items-start px-2 py-1 bg-slate-50 max-h-60">
          <div className="flex flex-wrap gap-2 pt-2 ">
            {inviteFriends?.map((friend, index) => (
              <div className="relative flex gap-1 items-center px-2 py-1 bg-slate-200 rounded h-fit">
                <ProfileImg src={friend?.avatar} />
                <span>{friend.username}</span>
                <div
                  className="absolute -top-[10px] -right-1 bg-slate-300 opacity-50 p-1 rounded-full hover:opacity-95 cursor-pointer z-50"
                  onClick={(e) => handleRemoveFriends(friend, e)}
                >
                  <AiOutlineClose className=" w-3 h-3 " />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end items-end gap-4">
        <button
          className="py-1 px-2 bg-slate-200 rounded hover:bg-opacity-80 transition-all"
          onClick={() => setIsOpenInviteFriendDiaLog(false)}
        >
          Cancel
        </button>
        <button
          className={`py-1 px-2 ${
            inviteFriends.length > 0
              ? "bg-[#0861F2] cursor-pointer hover:bg-opacity-80"
              : "bg-slate-200 cursor-not-allowed"
          }   text-white rounded  transition-all`}
          onClick={handleInviteFriends}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default InviteFriend;
