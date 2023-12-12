import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import dayjs from "dayjs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { BsCheck } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { AiOutlineClose } from "react-icons/ai";

const dataRelationship = [
  {
    id: 1,
    name: "Single",
  },
  {
    id: 2,
    name: "In a relationship",
  },
  {
    id: 3,
    name: "Engaged",
  },
  {
    id: 4,
    name: "Married",
  },
  {
    id: 5,
    name: "In a civil union",
  },
  {
    id: 6,
    name: "In a domestic partnership",
  },
  {
    id: 7,
    name: "In an open relationship",
  },
  {
    id: 8,
    name: "It's complicated",
  },
  {
    id: 9,
    name: "Separated",
  },
  {
    id: 10,
    name: "Divorced",
  },
  {
    id: 11,
    name: "Widowed",
  },
];

const ProfileLeftBar = () => {
  const userDetails = useSelector((state) => state.user);
  let { id } = useParams();

  // const [followings, setFollowings] = useState([]);
  const [profileUser, setProfileUser] = useState("");
  const [friends, setFriends] = useState(null);
  const [isOpenEditBio, setIsOpenEditBio] = useState(false);
  const [isOpenShowRelationship, setIsOpenShowRelationship] =
    useState(false);
  const [isOpenSetBirthDay, setIsOpenSetBirthDay] = useState(false);
  const [isSetRelationship, setIsSetRelationship] = useState(false);
  const [relationship, setRelationship] = useState(
    profileUser.relationship
  );
  const [bio, setBio] = useState("");
  const [day, setDay] = useState(profileUser?.birthDay);
  const [tabActive, setTabActive] = useState(true);
  const [images, setImages] = useState([]);
  const [openImg, setOpenImg] = useState(false);

  const accessToken = userDetails.accessToken;
  const isUser = userDetails.user._id === id;

  const getProfileUser = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/user/profile/${id}`
      );
      setProfileUser(res.data);
      setRelationship(res.data.relationship);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const getAllFriend = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/user/allFriend/${id}`,
        {
          headers: {
            token: `${accessToken}`,
          },
        }
      );
      setFriends(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const getImages = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/post/images/${id}`,
        {
          headers: {
            token: `${accessToken}`,
          },
        }
      );
      setImages(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    getProfileUser();
    getAllFriend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const handleUpdateBio = () => {
    const updateBio = async () => {
      try {
        await axios.put(
          `${process.env.REACT_APP_BACK_END_URL}/user/updateProfile`,
          {
            profile: bio ? bio : profileUser?.profile,
            birthDay: day ? day : profileUser?.birthDay,
            relationship: relationship
              ? relationship
              : profileUser?.relationship,
          },
          {
            headers: {
              token: `${userDetails.accessToken}`,
            },
          }
        );
        getProfileUser();
        setIsOpenEditBio(false);
        setIsOpenShowRelationship(false);
        setIsOpenSetBirthDay(false);
        setBio("");
        setDay("");
        setRelationship("");
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    updateBio();
  };
  const openEditBio = () => {
    setIsOpenEditBio(true);
  };
  const setValueDate = (e) => {
    e.preventDefault();
    setDay(e.target.value);
  };

  useEffect(() => {
    getImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken]);
  return (
    <div className="flex flex-col gap-4 w-full md:w-[280px] xl:w-[360px] pb-10">
      <div className="flex flex-col gap-2 h-[320px] lg:h-[400px] bg-white rounded-lg p-4 overflow-hidden text-black">
        <p className="text-lg md:text-xl lg:text-3xl font-semibold">
          Intro
        </p>
        {/* Bio */}
        <div className="flex flex-col gap-2 ">
          <div className="flex flex-col">
            {/* <p className="font-bold text-md">Bio</p> */}
            {isOpenEditBio ? (
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="border border-gray-600 outline-none rounded-md px-2"
              />
            ) : (
              <>
                <p className="pb-1 text-center">
                  {profileUser?.profile}
                </p>
                <hr />
              </>
            )}
          </div>
          {isUser &&
            (isOpenEditBio ? (
              <div className="flex justify-end gap-4">
                <button
                  className="bg-slate-200 text-black font-semibold py-[2px] px-2 rounded-lg hover:opacity-80 transition-all"
                  onClick={() => {
                    setBio(profileUser?.profile);
                    setIsOpenEditBio(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-slate-200 text-black font-semibold py-[2px] px-2 rounded-lg hover:opacity-80 transition-all"
                  onClick={handleUpdateBio}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                className="bg-slate-200 text-black font-semibold py-[2px] rounded-sm hover:opacity-80 transition-all"
                onClick={openEditBio}
              >
                Edit Bio
              </button>
            ))}
        </div>
        {/* Relationship */}
        <div className="flex flex-col gap-2 ">
          <div className="flex flex-col mt-2">
            {/* <p className="font-bold text-md">Bio</p> */}
            <div>
              {isOpenShowRelationship ? (
                <div
                  className="relative flex items-center justify-between border border-gray-400 outline-none rounded-sm px-2 py-[1px]"
                  onClick={() =>
                    setIsSetRelationship(!isSetRelationship)
                  }
                >
                  <span>
                    {relationship
                      ? relationship
                      : "Select Relationship"}
                  </span>
                  {isSetRelationship ? (
                    <MdKeyboardArrowUp className="text-lg" />
                  ) : (
                    <MdKeyboardArrowDown className="text-lg" />
                  )}
                  {isSetRelationship && (
                    <div className="absolute top-8 left-0 w-full h-60 bg-white shadow-md overflow-hidden overflow-y-scroll">
                      {dataRelationship.map((item) => (
                        <div
                          className="flex items-center justify-between cursor-pointer hover:bg-slate-200 transition-all px-2 py-1 rounded"
                          onClick={() => setRelationship(item.name)}
                        >
                          <span>{item.name}</span>
                          <BsCheck
                            className={`text-xl text-[#0861F2] ${
                              relationship === item.name
                                ? "block"
                                : "hidden"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                profileUser?.relationship && (
                  <div className="flex items-center gap-2">
                    <FaHeart />
                    <p className="">{profileUser?.relationship}</p>
                  </div>
                )
              )}
            </div>
          </div>
          {isUser &&
            (isOpenShowRelationship ? (
              <div className="flex justify-end gap-4">
                <button
                  className="bg-slate-200 text-black font-semibold py-[2px] px-2 rounded-lg hover:opacity-80 transition-all"
                  onClick={() => {
                    setRelationship(profileUser?.relationship);
                    setIsOpenShowRelationship(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-slate-200 text-black font-semibold py-[2px] px-2 rounded-lg hover:opacity-80 transition-all"
                  onClick={handleUpdateBio}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                className="bg-slate-200 text-black font-semibold py-[2px] rounded-sm hover:opacity-80 transition-all"
                onClick={() =>
                  setIsOpenShowRelationship(!isOpenShowRelationship)
                }
              >
                Edit Relationship
              </button>
            ))}
        </div>
        {/* BirthDay */}
        <div className="flex flex-col gap-2 ">
          <div className="flex flex-col mt-2">
            {/* <p className="font-bold text-md">Bio</p> */}
            <div>
              {isOpenSetBirthDay ? (
                <div className="">
                  <input
                    type="date"
                    value={dayjs(day).format("YYYY-MM-DD")}
                    onChange={setValueDate}
                    className="border border-gray-400 outline-none w-3/5 rounded mx-auto px-2"
                  />
                </div>
              ) : (
                profileUser?.birthDay && (
                  <div className="flex items-center gap-2">
                    <LiaBirthdayCakeSolid />
                    <p className="">
                      {dayjs(profileUser?.birthDay).format(
                        "DD/MMM/YYYY"
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
          {isUser &&
            (isOpenSetBirthDay ? (
              <div className="flex justify-end gap-4">
                <button
                  className="bg-slate-200 text-black font-semibold py-[2px] px-2 rounded-lg hover:opacity-80 transition-all"
                  onClick={() => {
                    setDay(profileUser?.birthDay);
                    setIsOpenSetBirthDay(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-slate-200 text-black font-semibold py-[2px] px-2 rounded-lg hover:opacity-80 transition-all"
                  onClick={handleUpdateBio}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                className="bg-slate-200 text-black font-semibold py-[2px] rounded-sm hover:opacity-80 transition-all"
                onClick={() =>
                  setIsOpenSetBirthDay(!isOpenSetBirthDay)
                }
              >
                Edit BirthDay
              </button>
            ))}
        </div>
      </div>
      {/* Friends */}
      <div className="flex gap-4 flex-col h-[360px] md:h-[480px] lg:h-[500px] bg-white rounded-lg py-4 overflow-hidden">
        <div className="flex justify-around items-center">
          <p
            className={`text-lg font-bold text-center cursor-pointer hover:text-[#0861F2] transition-all ${
              tabActive ? "text-[#0861F2]" : ""
            }`}
            onClick={() => setTabActive(true)}
          >
            Friends
          </p>
        </div>
        <div
          className={`w-full md:w-[280px] xl:w-[360px] grid grid-cols-3 gap-2 px-2 overflow-hidden overflow-y-scroll  duration-1000 transition-all cursor-pointer`}
        >
          {friends?.map((friend, index) => (
            <Link to={`/profile/${friend._id}`}>
              <img
                key={index}
                loading="lazy"
                src={friend?.avatar}
                className="w-full h-[100px] md:h-[90px] lg:h-[120px] object-cover"
                alt=""
              />
              <div className="flex flex-col">
                <span>{friend?.username}</span>
                <span>{friend?.id}</span>
                <span className="text-[#aaa] text-sm">
                  {friend?.mutualFriends?.length > 0
                    ? `(${friend?.mutualFriends?.length} mutual)`
                    : ""}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* User image */}
      <div className="flex gap-4 flex-col h-[360px] md:h-[480px] lg:h-[500px] bg-white rounded-lg py-4 overflow-hidden">
        <div className="flex justify-around items-center">
          <p
            className={`text-lg font-bold text-center cursor-pointer text-[#0861F2] transition-all
            }`}
          >
            Images
          </p>
        </div>
        {/* {!tabActive && ( */}
        {/* )} */}
        <div
          className={`w-full md:w-[280px] xl:w-[360px] grid grid-cols-3 gap-2 px-2 overflow-hidden overflow-y-scroll  duration-1000 transition-all cursor-pointer`}
        >
          {images?.map((image) =>
            image.map((item, index) =>
              item !== "" ? (
                <img
                  key={index}
                  loading="lazy"
                  src={item}
                  className="w-full h-[100px] md:h-[90px] lg:h-[120px] object-cover"
                  alt=""
                  onClick={() => setOpenImg(!openImg)}
                />
              ) : null
            )
          )}
        </div>
      </div>
      <div>
        {openImg && (
          <div className="fixed flex w-screen h-screen max-h-screen bg-slate-400 top-0 left-0 z-[9999]">
            <Swiper
              navigation={true}
              modules={[Navigation]}
              className="flex w-full mx-auto max-h-screen"
            >
              {images?.map((image) =>
                image?.map((item, index) => (
                  <SwiperSlide className="my-auto w-full h-full">
                    <div className="flex items-center justify-center w-full h-full">
                      <img
                        className="w-[88%] h-[88%] object-contain "
                        src={item}
                        alt=""
                      />
                    </div>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
            <div
              className="absolute top-[20px] left-[20px] bg-slate-300 opacity-50 p-2 rounded-full hover:opacity-95 cursor-pointer z-50"
              onClick={() => setOpenImg(!openImg)}
            >
              <AiOutlineClose />
            </div>
          </div>
        )}
      </div>

      {/* <div className="fixed w-screen h-screen bg-slate-300 z-50 top-0 opacity-50"></div> */}
    </div>
  );
};

export default ProfileLeftBar;
