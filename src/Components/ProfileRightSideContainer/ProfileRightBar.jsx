import React, { useEffect, useState } from "react";
import addFriends from "../../Images/add-user.png";
import image1 from "../../Images/image1.jpg";
import axios from "axios";
import ProfileImg from "../CommonComponents/Img/ProfileImg";
const ProfileRightBar = () => {
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NTQ4M2ZkOGU2NGYwNTUzOTQyMjc1YiIsInVzZXJuYW1lIjoiYWRtaW4xIiwiaWF0IjoxNzAwMDM4NzYwfQ.8fGgRVuQtnSidggH8Tk9x_2jzv9mCyFC9lei0huxMOc";
  const [followers, setFollowers] = useState([]);
  const [userFollow, setUserFollow] = useState([]);
  const [isFollow, setIsFollow] = useState(false);
  useEffect(() => {
    const getFollowers = async () => {
      try {
        const res = await axios.get(
          "${process.env.REACT_APP_BASE_URL}/user/followers",
          {
            headers: {
              token: `${accessToken}`,
            },
          }
        );
        setFollowers(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    getFollowers();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user/allUser`,
          {
            headers: {
              token: accessToken,
            },
          }
        );
        setUserFollow(res.data);
        setIsFollow(false);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [isFollow]);
  const handleFollowing = (id) => {
    const follow = async () => {
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/user/following/${id}`,
          {},
          {
            headers: {
              token: accessToken,
            },
          }
        );
        console.log(res);
        setIsFollow(true);
      } catch (error) {
        console.log(error);
      }
    };
    follow();
  };
  return (
    <div className="flex-1">
      <div className="flex flex-col gap-2 w-[22pc] h-[40vh] bg-white mt-6 rounded-2xl py-2  ">
        <p className="text-lg font-bold text-center">Followers</p>
        <div className="flex flex-col gap-4 overflow-hidden overflow-y-scroll h-full">
          {followers.length > 0
            ? followers.map((follower, index) => (
                <div key={index}>
                  <div className="flex flex-col gap-2 pl-4 cursor-pointer">
                    <div className="flex gap-4 items-center">
                      <ProfileImg
                        src={
                          follower.profile ? follower.profile : image1
                        }
                        size="medium"
                      />
                      <p className="text-start">
                        {follower.username}
                      </p>
                    </div>
                  </div>
                  <hr className="last:hidden" />
                </div>
              ))
            : "No follower!!!"}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[22pc] h-[60vh] bg-white mt-6 rounded-2xl py-2 pl-4 ">
        <p className="text-xl font-bold ">Suggested for you</p>
        <div className=" flex flex-col gap-2 h-full overflow-hidden overflow-y-scroll">
          {userFollow?.map((user, index) => (
            <div
              className="flex items-center justify-between"
              key={index}
            >
              <div className="flex items-center gap-3">
                <ProfileImg src={user.profile} size="medium" />
                <div>
                  <p>{user.username}</p>
                  <p className="text-xs text-[#aaa]">
                    Suggested for you
                  </p>
                </div>
              </div>
              <div
                className="bg-[#aaa] p-2 rounded-full hover:opacity-80 transition-all"
                onClick={() => handleFollowing(user._id)}
              >
                <img
                  src={addFriends}
                  className="h-5 w-5 cursor-pointer"
                  alt=""
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileRightBar;
