import React, { createRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfileImg from "../CommonComponents/Img/ProfileImg";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { BsCheck } from "react-icons/bs";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { notify } from "../../Redux/notify";

const listPrivacy = [
  {
    id: "public",
    name: "Public",
  },
  {
    id: "private",
    name: "Private",
  },
];

const CreateNewGroup = ({
  setIsOpenDialogCreateGroup,
  allFriends,
}) => {
  const { user, accessToken } = useSelector((state) => state.user);
  const [privacy, setPrivacy] = useState(null);
  const [isChoosePrivacy, setIsChoosePrivacy] = useState(false);
  const [inviteFriends, setInviteFriends] = useState([]);
  const [isInviteFriends, setIsInviteFriends] = useState(false);
  const [friends, setFriends] = useState(allFriends);
  const [heightDiv, setHeightDiv] = useState(0);
  const [idFriends, setIdFriends] = useState([]);
  const [groupName, setGroupName] = useState("");

  const divRef = createRef();
  useEffect(() => {
    if (divRef?.current && user) {
      const divHeight = divRef.current.clientHeight;
      setHeightDiv(divHeight);
    }
  }, [divRef, user]);
  // useEffect(() => {
  //   const getFriends = async () => {
  //     try {
  //       const res = await axios.get(
  //         `${process.env.REACT_APP_BACK_END_URL}/user/allFriend/${user._id}`,
  //         {
  //           headers: {
  //             token: accessToken,
  //           },
  //         }
  //       );
  //       setFriends(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getFriends();
  // }, []);
  const handleInviteFriends = (friend, e) => {
    e.stopPropagation();
    setFriends(friends.filter((item) => item._id !== friend._id));
    setInviteFriends([...inviteFriends, friend]);
    setIdFriends(
      idFriends.includes(friend._id)
        ? idFriends
        : [...idFriends, friend._id]
    );
  };

  const handleRemoveFriends = (friend, e) => {
    e.stopPropagation();
    setInviteFriends(
      inviteFriends.filter((item) => item._id !== friend._id)
    );
    setFriends([...friends, friend]);
    setIdFriends((prevIdFriends) =>
      prevIdFriends.filter((id) => id !== friend._id)
    );
  };
  const createGroup = () => {
    const data = {
      groupName,
      privacy,
      idFriends,
    };
    axios
      .post(
        `${process.env.REACT_APP_BACK_END_URL}/group/newGroup`,
        data,
        {
          headers: {
            token: accessToken,
          },
        }
      )
      .then((res) => {
        setIsOpenDialogCreateGroup(false);
        notify("success", "Create group successfully");
      })
      .catch((err) => {
        console.log(err);
        notify("error", "Create group failed");
      });
  };
  return (
    <>
      <div className="fixed flex flex-col gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-[400px] bg-white shadow-md rounded px-4 py-2 z-20">
        <span className="text-2xl font-bold">Create Group</span>
        <div className="flex flex-col gap-6">
          <div className="flex gap-2 items-center">
            <ProfileImg src={user.avatar} size="medium" />
            <div className="flex flex-col">
              <span className="font-semibold text-lg">
                {user.username}
              </span>
              <span className="text-sm text-[#aaa]">Admin</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {/* group name */}
            <input
              type="text"
              placeholder="Group Name"
              className="w-full border border-[#aaa] rounded p-2 outline-none"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            {/* privacy */}
            <div className="flex flex-col gap-2">
              <div
                className="relative flex items-center justify-between border border-[#aaa] outline-none rounded-sm p-2"
                onClick={() => setIsChoosePrivacy(!isChoosePrivacy)}
              >
                <span
                  className={`w-full cursor-pointer ${
                    privacy ? "" : "text-[#aaa]"
                  }`}
                >
                  {privacy ? privacy : "Choose privacy"}
                </span>
                {isChoosePrivacy ? (
                  <MdKeyboardArrowUp className="text-lg cursor-pointer" />
                ) : (
                  <MdKeyboardArrowDown className="text-lg cursor-pointer" />
                )}
                {isChoosePrivacy && (
                  <div className="absolute top-10 left-0 w-full h-60 bg-white shadow-md overflow-hidden overflow-y-scroll border-t border-t-[#aaa] z-10">
                    {listPrivacy.map((item) => (
                      <div
                        className="flex items-center justify-between cursor-pointer hover:bg-slate-200 transition-all px-2 py-1 rounded"
                        onClick={() => setPrivacy(item.id)}
                      >
                        <span>{item.name}</span>
                        <BsCheck
                          className={`text-xl text-[#0861F2] ${
                            privacy === item.name ? "block" : "hidden"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {privacy && (
                <p className="text-xs text-[#aaa]">
                  {privacy === "Public"
                    ? "Anyone can see who's in the group and what they post. You can change your group to private now or at a later time."
                    : "Only people you invite can see who's in the group and what they post. You can change your group to public now or at a later time."}
                </p>
              )}
            </div>
            {/* invite friends */}
            <div
              className="relative flex items-center justify-between border border-[#aaa] outline-none rounded-sm p-2 "
              ref={divRef}
              onClick={() => setIsInviteFriends(!isInviteFriends)}
            >
              <span
                className={`w-full cursor-pointer ${
                  inviteFriends.length > 0 ? "" : "text-[#aaa]"
                }`}
              >
                {inviteFriends.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {inviteFriends.map((friend, index) => (
                      <div className="relative">
                        <div
                          className="flex items-center gap-2 cursor-pointer hover:bg-slate-200 transition-all px-2 py-1 rounded text-black bg-slate-100"
                          key={index}
                        >
                          <ProfileImg src={friend.avatar} />
                          <span>{friend.username}</span>
                        </div>
                        <div
                          className="absolute -top-[10px] -right-1 bg-slate-300 opacity-50 p-1 rounded-full hover:opacity-95 cursor-pointer z-50"
                          onClick={(e) =>
                            handleRemoveFriends(friend, e)
                          }
                        >
                          <AiOutlineClose className=" w-3 h-3 " />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  "Invite friends (optional)"
                )}
              </span>
              {isInviteFriends ? (
                <MdKeyboardArrowUp className="text-lg cursor-pointer" />
              ) : (
                <MdKeyboardArrowDown className="text-lg cursor-pointer" />
              )}
              {isInviteFriends && (
                <div
                  className="absolute top-10 left-0 w-full h-60 max-h-60 bg-white shadow-md overflow-hidden overflow-y-scroll border-t border-t-[#aaa] flex flex-col gap-2"
                  style={{
                    top: heightDiv > 40 ? `${heightDiv}px` : "40px",
                    // Add any other styles or modifications here
                  }}
                >
                  {friends &&
                    friends?.slice(0, 10)?.map((friend, index) => (
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:bg-slate-200 transition-all px-2 py-1 rounded text-black"
                        onClick={(e) =>
                          handleInviteFriends(friend, e)
                        }
                        key={index}
                      >
                        <ProfileImg src={friend.avatar} />
                        <span>{friend.username}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 justify-end items-center">
            <button
              className="py-1 px-2 bg-slate-200 rounded hover:bg-opacity-80 transition-all"
              onClick={() => setIsOpenDialogCreateGroup(false)}
            >
              Cancel
            </button>
            <button
              className={`py-1 px-2 ${
                groupName && privacy
                  ? "bg-[#0861F2] cursor-pointer hover:bg-opacity-80"
                  : "bg-slate-200 cursor-not-allowed"
              }   text-white rounded  transition-all`}
              disabled={!groupName || !privacy}
              onClick={createGroup}
            >
              Create
            </button>
          </div>
        </div>
      </div>
      <div
        className="fixed w-screen h-screen top-0 left-0 z-10 "
        onClick={() => setIsOpenDialogCreateGroup(false)}
      ></div>
    </>
  );
};

export default CreateNewGroup;
