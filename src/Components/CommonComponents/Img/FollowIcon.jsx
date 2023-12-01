import React, { useState } from "react";
import addFriends from "../../../Images/add-user.png";
import addFriendsSuccess from "../../../Images/afterFollowImg.png";
const FollowIcon = ({ props }) => {
  const [addFlw, setAddFlw] = useState(false);
  return (
    <div>
      <img
        src={addFlw ? addFriendsSuccess : addFriends}
        className="h-5 w-5 cursor-pointer"
        alt=""
        onClick={() => setAddFlw(!addFlw)}
      />
    </div>
  );
};

export default FollowIcon;
