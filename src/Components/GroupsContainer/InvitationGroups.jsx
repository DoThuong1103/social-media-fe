import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import coverImage from "../../Images/groups-default.png";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
const InvitationGroup = () => {
  const { accessToken, user } = useSelector((state) => state.user);
  const id = user._id;
  const [groupInvitation, setGroupInvitation] = useState();

  useEffect(() => {
    getGroupInvitation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getGroupInvitation = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/group/groupInvitation`,
        {
          headers: {
            token: accessToken,
          },
        }
      );
      setGroupInvitation(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteGroupInvitation = async (groupId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACK_END_URL}/group/deleteGroupInvitation/${groupId}`,
        {},
        {
          headers: {
            token: accessToken,
          },
        }
      );
      // After successfully leaving the group, fetch the updated list of groups
      getGroupInvitation();
    } catch (error) {
      console.error("Error leaving group:", error.message);
    }
  };
  const joinGroup = async (groupId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACK_END_URL}/group/updateGroup/${groupId}`,
        {
          addUser: id,
        },
        {
          headers: {
            token: accessToken,
          },
        }
      );
      // After successfully leaving the group, fetch the updated list of groups
      getGroupInvitation();
    } catch (error) {
      console.error("Error leaving group:", error.message);
    }
  };
  return (
    <div
      className="w-full flex-1 flex flex-col gap-4 py-6 md:py-4 px-4 md:px-10 overflow-hidden overflow-y-scroll max-h-screen "
      // style={{ maxHeight: "calc(100vh - 72px)" }}
    >
      {groupInvitation?.length > 0 && (
        <div className="flex flex-col gap-4">
          <span className="font-bold text-3xl">
            Invitation to join the group{" "}
            <span>({groupInvitation?.length})</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
            {groupInvitation?.map((group) => (
              <div className="flex flex-col gap-4 bg-white min-h-[160px] px-5 py-3 w-4/5 sm:w-full mx-auto">
                <div className="flex gap-2 items-end">
                  <Link to={`/groups/detail/${group?._id}`}>
                    <img
                      src={group?.coverImage || coverImage}
                      alt="CoverImage"
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md"
                    />
                  </Link>
                  <div className="flex flex-col text-sm md:text-base">
                    <Link to={`/groups/detail/${group?._id}`}>
                      <span>{group?.groupName}</span>
                    </Link>
                    {group?.privacy === "Public" ? (
                      <div className="flex gap-1 items-center">
                        <AiOutlineGlobal />
                        <span>public</span>
                      </div>
                    ) : (
                      <div className="flex gap-1 items-center">
                        <FaLock />
                        <span>Private</span>
                      </div>
                    )}
                    <span>{group?.users?.length} member </span>
                  </div>
                </div>
                <div className="flex gap-4 w-full">
                  <div className="w-full">
                    <button
                      className="w-full py-1 text-[#0861F2] hover:bg-opacity-80 bg-[#cadeff] rounded"
                      onClick={() => joinGroup(group?._id)}
                    >
                      Join group
                    </button>
                  </div>
                  <button
                    className="w-full py-1 bg-slate-200  hover:bg-slate-300 rounded "
                    onClick={() => deleteGroupInvitation(group?._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitationGroup;
