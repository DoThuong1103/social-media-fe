import React, { useState } from "react";
import ProfileImg from "./Img/ProfileImg";
import addFriends from "../../Images/add-user.png";
import addFriendsSuccess from "../../Images/afterFollowImg.png";
import { Link } from "react-router-dom";
const AddFriendContainer = ({ user, onClick }) => {
  const [addFr, setAddFr] = useState(false);
  return (
    <div className="flex items-center justify-between">
      <Link
        to={`/profile/${user._id}`}
        className="flex items-center gap-3"
      >
        <ProfileImg src={user.avatar} size="medium" />
        <div>
          <p>{user.username}</p>
          <p className="text-xs text-[#aaa]">Suggested for you</p>
        </div>
      </Link>
      <div
        className="bg-[#aaa] p-2 rounded-full hover:opacity-80 transition-all"
        onClick={onClick}
        title="add friend"
      >
        <img
          src={addFr ? addFriendsSuccess : addFriends}
          className="h-5 w-5 cursor-pointer"
          alt="add friend"
          onClick={() => setAddFr(!addFr)}
        />
      </div>
    </div>
  );
};

export default AddFriendContainer;
