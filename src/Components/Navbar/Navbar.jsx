import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import SearchIcon from "../../Images/search.png";
import Notifications from "../../Images/bell.png";
import Message from "../../Images/message.png";
import Icon from "../CommonComponents/Img/Icon";
import ProfileImg from "../CommonComponents/Img/ProfileImg";
import { logout } from "../../Redux/userReducer";
import { IoMdCloseCircle } from "react-icons/io";
import { HiHome, HiUsers } from "react-icons/hi";
import { PiVideoBold } from "react-icons/pi";
import { FaUsersLine } from "react-icons/fa6";
import { AiOutlineLogout } from "react-icons/ai";
const Navbar = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const userDetails = useSelector((state) => state.user);
  const accessToken = userDetails?.accessToken;
  const allUserData = userDetails?.allUser;
  const allGroupData = userDetails?.allGroup;
  const data = allUserData?.concat(allGroupData);
  const searchData = data;
  console.log(searchData);

  const countNotification = [];

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState();
  const [isShowNotification, setIsShowNotification] = useState(false);
  const [isShowSearchInput, setIsShowSearchInput] = useState(false);
  console.log(searchResults);
  useEffect(() => {
    if (!searchData) return;

    const clonedData = searchData?.map((item) => ({ ...item }));

    const sortedData = clonedData?.sort((a, b) =>
      (a?.username || a?.groupName)?.localeCompare(
        b?.username || b?.groupName,
        undefined,
        {
          sensitivity: "base",
        }
      )
    );

    const results = sortedData?.filter((user) =>
      (user?.username || user?.groupName)
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);
  const handleLogout = () => {
    dispatch(logout());
  };
  const getNotifications = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/user/notification`,
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

  notifications?.map(
    (item) => item?.active === false && countNotification?.push(item)
  );
  const handleUpdateNotification = async (noteId, postId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACK_END_URL}/user/notification/${noteId}`,
        {
          active: true,
        },
        {
          headers: {
            token: `${userDetails.accessToken}`,
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
        `${process.env.REACT_APP_BACK_END_URL}/user/checkNotification`,
        {},
        {
          headers: {
            token: `${userDetails.accessToken}`,
          },
        }
      );
      getNotifications();
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const reloadPage = () => {
    if (window.location.pathname === "/") {
      window.location.reload();
    }
  };

  return (
    <div className="fixed top-0 h-18 md:h-16 flex flex-col w-full bg-white rounded-b-xl z-50 p-2 md:px-4 lg:px-8 ">
      <div className="flex justify-between items-center text-left w-full md:hidden">
        <Link to="/">
          <p
            className="text-lg md:text-xl  lg:text-3xl text-center font-bold"
            onClick={reloadPage}
          >
            Soc<span className="text-blue-500">ial</span>
          </p>
        </Link>
        <div className="ml-auto relative flex justify-end items-center gap-2 md:gap-5 col-span-2 md:col-span-1 w-full">
          <div
            className={`relative cursor-pointer p-1 md:p-2 rounded-full transition-all bg-slate-200 hover:bg-slate-300 ${
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
                <p
                  className="cursor-pointer"
                  onClick={handleCheckAll}
                >
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
                          notification?.active ? "" : "bg-slate-200"
                        } `}
                        onClick={() =>
                          handleUpdateNotification(
                            notification?._id,
                            notification?.postId
                          )
                        }
                      >
                        <ProfileImg
                          src={notification?.userPost?.avatar}
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
            title="Chat"
            className="p-1 md:p-2 rounded-full transition-all bg-slate-200 hover:bg-slate-300 cursor-pointer"
          >
            <Icon src={Message} alt="" pointer />
          </Link>
          <Link
            to={`/profile/${userDetails?.user?._id}`}
            onClick={() =>
              window.location.pathname.includes("profile") &&
              window.location.reload()
            }
          >
            <div className="flex items-center gap-2">
              <ProfileImg
                src={userDetails?.user?.avatar}
                size="medium"
                alt="  "
              />
              <p className="hidden md:block">
                {userDetails?.user?.username}
              </p>
            </div>
          </Link>
          <div
            title="Logout"
            className="p-2 rounded-full bg-slate-200 hover:bg-red-500 cursor-pointer transition-all group"
            onClick={handleLogout}
          >
            <AiOutlineLogout className="w-4 h-4 md:w-5 md:h-5 group-hover:text-white transition-all" />
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-6 md:grid-cols-3 content-center items-center w-full m-auto justify-around md:justify-between ">
        {/* LeftNav */}
        <div className="flex gap-2 md:gap-4 items-center">
          {/* Logo */}
          <div className="hidden md:block">
            <Link to="/">
              <p
                className="text-lg md:text-xl  lg:text-3xl text-center font-bold"
                onClick={reloadPage}
              >
                Soc<span className="text-blue-500">ial</span>
              </p>
            </Link>
          </div>
          {/* Search input */}
          <div className="relative">
            <div className="relative flex items-center bg-slate-200 p-1 md:px-2 rounded-full md:rounded-lg gap-1">
              <Icon
                src={SearchIcon}
                alt=""
                pointer={true}
                size=""
                onClick={() =>
                  setIsShowSearchInput(!isShowSearchInput)
                }
              />
              <input
                className="bg-transparent hidden md:block md:w-[160px] lg:w-[240px] rounded-md p-[2px] outline-none"
                type="text"
                placeholder="Search your friends"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.trim())}
              />
              <IoMdCloseCircle
                className={`text-lg hidden md:block ${
                  searchTerm ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => setSearchTerm("")}
              />
            </div>
            {searchTerm?.length > 0 && (
              <div className="absolute hidden md:flex flex-col gap-2 top-10 w-[200px] md:w-full h-[300px] rounded-md p-2 bg-white shadow-md overflow-hidden overflow-y-scroll">
                {searchResults?.map((item) =>
                  item?.username ? (
                    <Link
                      to={`/profile/${item?._id}`}
                      className="flex flex-col gap-1"
                    >
                      <div
                        className="flex gap-2 items-center w-full cursor-pointer"
                        // onClick={() => console.log("1", item)}
                      >
                        <ProfileImg src={item?.avatar} />
                        <p className="">{item?.username}</p>
                      </div>
                      <hr className="last:hidden" />
                    </Link>
                  ) : (
                    <Link
                      to={`/groups/detail/${item?._id}`}
                      className="flex flex-col gap-1"
                    >
                      <div
                        className="flex gap-2 items-center w-full cursor-pointer"
                        // onClick={() => console.log("1", item)}
                      >
                        <ProfileImg src={item?.coverImage} />
                        <p className="">
                          {item?.groupName}
                          <span className="text-sm text-[#aaa]">
                            (group)
                          </span>
                        </p>
                      </div>
                      <hr className="last:hidden" />
                    </Link>
                  )
                )}
                {searchResults?.length === 0 && (
                  <p className="text-center">No results search</p>
                )}
              </div>
            )}
          </div>
          {/* Search input mobile */}
          {isShowSearchInput && (
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex md:hidden items-center bg-slate-300 p-1 px-2 rounded-xl gap-1">
              <input
                className="bg-transparent w-[300px] lg:w-[400px] rounded-md p-[2px] outline-none"
                type="text"
                placeholder="Search your friends"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.trim())}
              />

              <IoMdCloseCircle
                className={`text-lg ${
                  searchTerm ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => setSearchTerm("")}
              />

              {searchTerm?.length > 0 && (
                <div className="absolute flex md:hidden flex-col gap-2 top-10 left-0 w-full h-[300px] rounded-md p-2 bg-white shadow-md overflow-hidden overflow-y-scroll">
                  {searchResults?.map((item) => (
                    <Link
                      to={`profile/${item?._id}`}
                      className="flex flex-col gap-1"
                    >
                      <div
                        className="flex gap-2 items-center w-full cursor-pointer"
                        // onClick={() => console.log("1", item)}
                      >
                        <ProfileImg src={item?.avatar} />
                        <p className="">{item?.username}</p>
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
        </div>

        {/* CenterNav */}
        <div className="mx-auto flex justify-between w-full xxs:gap-2 xs:gap-4 col-span-5 md:col-span-1">
          <Link
            to="/"
            className="px-2 py-1 md:px-6 md:py-2 lg:px-8 rounded group hover:bg-slate-200 transition-all"
            onClick={() =>
              window.location.pathname === "/" &&
              window.location.reload()
            }
          >
            <HiHome className="w-5 h-5 md:w-6 md:h-6 cursor-pointer group-hover:text-[#0861F2] transition-all" />
          </Link>
          <Link
            to="/friends"
            className="px-2 py-1 md:px-6 md:py-2 lg:px-8 rounded group hover:bg-slate-200 transition-all"
            onClick={() =>
              window.location.pathname.includes("friends") &&
              window.location.reload()
            }
          >
            <HiUsers className="w-5 h-5 md:w-6 md:h-6 cursor-pointer group-hover:text-[#0861F2] transition-all" />
          </Link>
          <Link
            to="/videos"
            className="px-2 py-1 md:px-6 md:py-2 lg:px-8 rounded group hover:bg-slate-200 transition-all"
            onClick={() =>
              window.location.pathname.includes("videos") &&
              window.location.reload()
            }
          >
            <PiVideoBold className="w-5 h-5 md:w-6 md:h-6 cursor-pointer group-hover:text-[#0861F2] transition-all" />
          </Link>
          <Link
            to="/groups"
            className="px-2 py-1 md:px-6 md:py-2 lg:px-8 rounded group hover:bg-slate-200 transition-all"
            onClick={() =>
              window.location.pathname.includes("groups") &&
              window.location.reload()
            }
          >
            <FaUsersLine className="w-5 h-5 md:w-6 md:h-6 cursor-pointer group-hover:text-[#0861F2] transition-all" />
          </Link>
        </div>
        {/* RightNav */}
        <div className="hidden md:flex ml-auto relative justify-end items-center gap-2 md:gap-5 col-span-2 md:col-span-1 w-full">
          <div
            className={`relative cursor-pointer p-1 md:p-2 rounded-full transition-all bg-slate-200 hover:bg-slate-300 ${
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
                <p
                  className="cursor-pointer"
                  onClick={handleCheckAll}
                >
                  Check All
                </p>
              </div>
              {notifications && (
                <div className="flex flex-col gap-2 max-h-80 overflow-hidden overflow-y-scroll ">
                  {notifications?.map((notification, index) => (
                    <Link
                      to={`/post/${notification?.postId}`}
                      key={index}
                    >
                      <div
                        className={`flex gap-2 items-center cursor-pointer pl-4 py-2 ${
                          notification.active ? "" : "bg-slate-200"
                        } `}
                        onClick={() =>
                          handleUpdateNotification(
                            notification?._id,
                            notification?.postId
                          )
                        }
                      >
                        <ProfileImg
                          src={notification?.userPost?.avatar}
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
            title="Chat"
            className="p-1 md:p-2 rounded-full transition-all bg-slate-200 hover:bg-slate-300 cursor-pointer"
          >
            <Icon src={Message} alt="" pointer />
          </Link>
          <Link
            to={`/profile/${userDetails?.user?._id}`}
            onClick={() =>
              window.location.pathname.includes("profile") &&
              window.location.reload()
            }
          >
            <div className="flex items-center gap-2">
              <ProfileImg
                src={userDetails?.user?.avatar}
                size="medium"
                alt="  "
              />
              <p className="hidden md:block">
                {userDetails?.user?.username}
              </p>
            </div>
          </Link>
          <div
            title="Logout"
            className="p-2 rounded-full bg-slate-200 hover:bg-red-500 cursor-pointer transition-all group"
            onClick={handleLogout}
          >
            <AiOutlineLogout className="w-4 h-4 md:w-5 md:h-5 group-hover:text-white transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
