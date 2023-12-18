import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import coverImage from "../../Images/groups-default.png";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
const JoinedGroups = () => {
  const { accessToken, user } = useSelector((state) => state.user);
  const id = user._id;
  const [groups, setGroups] = useState();

  const getGroups = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/group/joinedGroups`,
        {
          headers: {
            token: accessToken,
          },
        }
      );
      setGroups(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leaveGroup = async (groupId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACK_END_URL}/group/updateGroup/${groupId}`,
        {
          leaveGroup: id,
        },
        {
          headers: {
            token: accessToken,
          },
        }
      );
      // After successfully leaving the group, fetch the updated list of groups
      getGroups();
    } catch (error) {
      console.error("Error leaving group:", error.message);
    }
  };

  return (
    <div
      className="w-full flex-1 flex flex-col gap-4 py-6 md:py-4 px-4 md:px-10 overflow-hidden overflow-y-scroll max-h-screen "
      // style={{ maxHeight: "calc(100vh - 72px)" }}
    >
      {groups?.totalGroup > 0 && (
        <div className="flex flex-col gap-4">
          <span className="font-bold text-3xl">
            All groups you've joined{" "}
            <span>({groups?.totalGroup})</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
            {groups?.groups?.map((group) => (
              <div className="flex flex-col gap-4 bg-white min-h-[160px] px-5 py-3 w-4/5 sm:w-full mx-auto">
                <div className="flex gap-2 items-end">
                  <img
                    src={group?.coverImage || coverImage}
                    alt="CoverImage"
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md"
                  />
                  <div className="flex flex-col text-sm md:text-base">
                    <span>{group?.groupName}</span>
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
                  <Link
                    to={`detail/${group?._id}`}
                    className="w-full"
                  >
                    <button className="w-full py-1 text-[#0861F2] hover:bg-[#b6d2ff] bg-[#cadeff] rounded">
                      View group
                    </button>
                  </Link>
                  <button
                    className="w-full py-1 bg-slate-200  hover:bg-slate-300 rounded "
                    onClick={() => leaveGroup(group?._id)}
                  >
                    Leave group
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

export default JoinedGroups;
