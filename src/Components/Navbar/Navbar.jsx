import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import SearchIcon from "../../Images/search.png";
import Notifications from "../../Images/bell.png";
import Message from "../../Images/message.png";
import Icon from "../CommonComponents/Img/Icon";
import ProfileImg from "../CommonComponents/Img/ProfileImg";
import { logout } from "../../Redux/userReducer";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "axios";
const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchData, setSearchData] = useState();
  const [notifications, setNotifications] = useState();
  const [isShowNotification, setIsShowNotification] = useState(false);
  const [isShowSearchInput, setIsShowSearchInput] = useState(false);

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user);
  const accessToken = userDetails.user.accessToken;
  const { id } = useParams();
  const countNotification = [];

  useEffect(() => {
    const sortedData = searchData?.sort((a, b) =>
      a.username.localeCompare(b.username, undefined, {
        sensitivity: "base",
      })
    );
    const results = sortedData?.filter((user) =>
      user?.username
        ?.toLowerCase()
        .includes(searchTerm?.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, searchData]);
  const handleLogout = () => {
    dispatch(logout());
  };
  const getNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/user/notification`,
        {
          headers: {
            token: accessToken,
          },
        }
      );
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/allUser`,
          {
            headers: {
              token: accessToken,
            },
          }
        );
        setSearchData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [accessToken]);

  notifications?.map(
    (item) => item.active === false && countNotification.push(item)
  );
  const handleUpdateNotification = async (noteId, postId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/user/notification/${noteId}`,
        {
          active: true,
        },
        {
          headers: {
            token: `${userDetails.user.accessToken}`,
          },
        }
      );
      getNotifications();
      if (postId === id) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const handleCheckAll = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/user/checkNotification`,
        {},
        {
          headers: {
            token: `${userDetails.user.accessToken}`,
          },
        }
      );
      getNotifications();
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <div className="fixed top-0 h-14 flex items-center  w-full m-auto justify-between p-2  md:px-4 lg:px-16 bg-white rounded-b-xl z-10">
      {isShowSearchInput && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex md:hidden items-center bg-slate-200 p-1 px-2 rounded-xl gap-1">
          <input
            className="bg-transparent w-[300px] lg:w-[400px] rounded-md p-[2px] outline-none"
            type="text"
            placeholder="Search your friends"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.trim())}
          />
          {searchTerm && (
            <IoMdCloseCircle
              className="text-lg"
              onClick={() => setSearchTerm("")}
            />
          )}
          {searchTerm?.length > 0 && (
            <div className="absolute flex md:hidden flex-col gap-2 top-10 left-0 w-full h-[300px] rounded-md p-2 bg-white shadow-md overflow-hidden overflow-y-scroll">
              {searchResults?.map((item) => (
                <Link
                  to={`profile/${item._id}`}
                  className="flex flex-col gap-1"
                >
                  <div
                    className="flex gap-2 items-center w-full cursor-pointer"
                    onClick={() => console.log("1", item)}
                  >
                    <ProfileImg src={item.avatar} />
                    <p className="">{item.username}</p>
                  </div>
                  <hr className="last:hidden" />
                </Link>
              ))}
              {searchResults?.length === 0 && (
                <p className="text-center">No results search</p>
              )}
            </div>
          )}
        </div>
      )}
      <div>
        <Link to="/">
          <p className="text-xl md:text-2xl  lg:text-3xl text-center font-bold">
            Soc<span className="text-blue-500">ial</span>
          </p>
        </Link>
      </div>
      <div className="relative">
        <div className="relative flex items-center bg-slate-200 p-1 md:px-2 rounded-full md:rounded-lg gap-1">
          <Icon
            src={SearchIcon}
            alt=""
            pointer={true}
            size="large"
            onClick={() => setIsShowSearchInput(!isShowSearchInput)}
          />
          <input
            className="bg-transparent hidden md:block md:w-[300px] lg:w-[400px] rounded-md p-[2px] outline-none"
            type="text"
            placeholder="Search your friends"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.trim())}
          />
        </div>
        {/* {searchTerm?.length > 0 && (
          <div className="absolute flex flex-col gap-2 top-10 w-[200px] md:w-full h-[300px] rounded-md p-2 bg-white shadow-md overflow-hidden overflow-y-scroll">
            {searchResults?.map((item) => (
              <Link
                to={`profile/${item._id}`}
                className="flex flex-col gap-1"
              >
                <div
                  className="flex gap-2 items-center w-full cursor-pointer"
                  onClick={() => console.log("1", item)}
                >
                  <ProfileImg src={item.avatar} />
                  <p className="">{item.username}</p>
                </div>
                <hr className="last:hidden" />
              </Link>
            ))}
            {searchResults?.length === 0 && (
              <p className="text-center">No results search</p>
            )}
          </div>
        )} */}
      </div>
      <div className="relative flex items-center gap-5 ">
        <div
          className={`relative cursor-pointer p-2 rounded-full transition-all bg-slate-200 hover:bg-slate-300 ${
            isShowNotification ? "bg-slate-300" : ""
          }`}
          onClick={() => {
            setIsShowNotification(!isShowNotification);
          }}
        >
          <Icon src={Notifications} alt="Notifications" pointer />
          {countNotification?.length > 0 && (
            <div className="absolute top-[-4px] right-[0px] bg-red-500 rounded-full h-5 w-5 flex items-center justify-center">
              <span className="text-sm text-white font-semibold">
                {countNotification?.length}
              </span>
            </div>
          )}
        </div>
        <div
          className={`${
            isShowNotification ? "w-80 h-96 scale-100" : " scale-0"
          } absolute top-10 left-[60%] translate-x-[-50%] w-80 h-96 bg-white shadow-lg rounded-md border-gray-200 transition-all duration-[400ms] origin-top-left py-2 `}
        >
          <div className="flex flex-col gap-4 ">
            <div className="flex justify-between items-end px-4">
              <p className="text-xl font-bold">Notifications</p>
              <p className="cursor-pointer" onClick={handleCheckAll}>
                Check All
              </p>
            </div>
            {notifications && (
              <div className="flex flex-col gap-2 max-h-80 overflow-hidden overflow-y-scroll ">
                {notifications?.map((notification, index) => (
                  <Link
                    to={`/post/${notification.postId}`}
                    key={index}
                  >
                    <div
                      className={`flex gap-2 items-center cursor-pointer pl-4 py-2 ${
                        notification.active ? "" : "bg-slate-200"
                      } `}
                      onClick={() =>
                        handleUpdateNotification(
                          notification._id,
                          notification.postId
                        )
                      }
                    >
                      <ProfileImg
                        src={notification.userPost.avatar}
                      />
                      <p>{notification?.content}</p>
                    </div>
                    <hr className="w-full  mx-auto last:hidden" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <Link
          to={"/chat"}
          className="p-2 rounded-full transition-all bg-slate-200 hover:bg-slate-300 cursor-pointer"
        >
          <Icon src={Message} alt="" pointer />
        </Link>
        <Link to={`/profile/${userDetails?.user?.other?._id}`}>
          <div className="flex items-center gap-2">
            <ProfileImg
              src={userDetails.user.other.avatar}
              alt="  "
            />
            <p>{userDetails.user.other.username}</p>
          </div>
        </Link>
        <div className="cursor-pointer" onClick={handleLogout}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Navbar;
