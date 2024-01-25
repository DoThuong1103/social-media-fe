import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import ProfileLeftBar from "../../Components/ProfileLeftSideContainer/ProfileLeftBar";
import ProfileMainPost from "../../Components/ProfileMainPostContainer/ProfileMainPost";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import ProfileImg from "../../Components/CommonComponents/Img/ProfileImg";
import { notify } from "../../Redux/notify";
import { getUserProfile } from "../../Redux/apiCall";

const Profile = () => {
  const userDetails = useSelector((state) => state.user);
  const [profileUser, setProfileUser] = useState(null);
  const [isUpload, setIsUpload] = useState(false);
  const [isUpLoadAvatar, setIsUpLoadAvatar] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [image, setImage] = useState();
  const [avatar, setAvatar] = useState();
  const [btn1, setBtn1] = useState();
  const [btn2, setBtn2] = useState();

  const user = userDetails?.user;
  const accessToken = userDetails.accessToken;
  const dispatch = useDispatch();
  const { id } = useParams();
  const getProfileUser = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/user/profile/${id}`
      );
      setProfileUser(res.data);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.error("Error fetching posts:", error);
    }
  };
  useEffect(() => {
    getProfileUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  useEffect(() => {
    const handlePost = async (e) => {
      // e.preventDefault();
      if (image || avatar) {
        image && setIsUpload(true);
        avatar && setIsUpLoadAvatar(true);
        const filename =
          new Date().getTime() + image?.name
            ? image.name
            : avatar.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(
          storageRef,
          image || avatar
        );

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            // eslint-disable-next-line default-case
            switch (snapshot.state) {
              case "paused":
                // console.log("Upload is paused");
                break;
              case "running":
                // console.log("Upload is running");
                break;
            }
            return progress;
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(
              (downloadURL) => {
                axios
                  .put(
                    `${process.env.REACT_APP_BACK_END_URL}/user/updateProfile`,
                    {
                      avatar: avatar
                        ? downloadURL
                        : profileUser?.avatar,
                      coverImage: image
                        ? downloadURL
                        : profileUser?.coverImage,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        token: userDetails.accessToken,
                      },
                    }
                  )
                  .then((data) => {
                    setIsUpload(false);
                    setIsUpLoadAvatar(false);
                    setImage(null);
                    setAvatar(null);
                    getProfileUser();
                    getUserProfile(dispatch, user?._id);
                  })
                  .catch((error) => {
                    notify(
                      "error",
                      "Something went wrong. Please try again later."
                    );
                  });
              }
            );
          }
        );
      }
    };
    handlePost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, avatar]);

  const handleReqFriend = async (params) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACK_END_URL}/user/${params}/${id}`,
        {},
        {
          headers: {
            token: `${accessToken}`,
          },
        }
      );
      getProfileUser();
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (profileUser) {
      if (profileUser?.friends?.includes(user?._id)) {
        setBtn1(null);
        setBtn2({ id: "unFriend", value: "Unfriend" });
      } else if (profileUser?.friendRequest?.includes(user?._id)) {
        setBtn1(null);
        setBtn2({ id: "cancelAddFriend", value: "Cancel" });
      } else if (profileUser?.addFriends?.includes(user?._id)) {
        setBtn1({ id: "acceptFriend", value: "Confirm" });
        setBtn2({ id: "deleteRequestFriend", value: "Delete" });
      } else {
        setBtn1({ id: "addFriend", value: "Add Friend" });
        setBtn2(null);
      }
    }
  }, [profileUser, user?._id, id]);
  return (
    <div className="bg-slate-200 min-h-screen scroll-smooth pb-8">
      <Navbar />
      <div className="flex flex-col justify-center mx-auto pt-16 w-11/12">
        <div className="relative flex flex-col gap-6 w-full lg:w-5/6 mx-auto">
          <div className="w-full">
            <div className="relative flex w-full h-60 md:h-96 mx-auto rounded-t-md overflow-hidden">
              <div className="flex w-full">
                {isUpload ? (
                  <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-slate-300 opacity-40 z-10">
                    <l-tailspin
                      size="40"
                      stroke="4"
                      speed="1"
                      color="black"
                    ></l-tailspin>
                  </div>
                ) : null}
                {profileUser?.coverImage ? (
                  <img
                    loading="lazy"
                    id="yourElementId"
                    className={`opacity-100 object-cover w-full`}
                    style={{ objectPosition: "center center" }}
                    src={profileUser?.coverImage}
                    alt=""
                  />
                ) : (
                  <div className="w-full bg-gradient-to-r from-[rgba(155,198,247,0.17)] from-0% via-[#7db8fb] via-50% to-[#00d5ffdb] to-100%"></div>
                )}
              </div>
              {id === user?._id && (
                <label htmlFor="image">
                  <div className="absolute bottom-4 right-4 flex gap-2 items-center bg-[rgba(0,0,0,0.4)] px-4 py-2 cursor-pointer hover:bg-[rgba(0,0,0,0.8)] transition-all rounded-md">
                    <FaCamera className="text-white" />
                    <p className="text-white">Add cover photo</p>
                  </div>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    style={{ display: "none" }}
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            <div className="relative flex items-end pb-2 pl-2 md:pb-0 md:pl-0 md:items-center md:justify-end bg-white w-full h-28 md:h-24 rounded-b-lg pr-10 z-20">
              <div className="absolute -top-8 left-2 lg:-top-20 lg:left-6 flex gap-4 items-end">
                <div className="relative">
                  <ProfileImg
                    src={profileUser?.avatar}
                    size="large"
                  ></ProfileImg>
                  {id === user?._id && (
                    <label
                      htmlFor="avatar"
                      className="absolute flex items-center justify-center bottom-4 right-1 border-2 bg-slate-200 rounded-full p-[4px] hover:bg-slate-100 cursor-pointer"
                      title="Change avatar"
                    >
                      <FaCamera className="" />
                      <input
                        type="file"
                        name="avatar"
                        id="avatar"
                        style={{ display: "none" }}
                        accept="image/*"
                        multiple
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}

                  {isUpLoadAvatar ? (
                    <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-slate-300 opacity-40 z-10 rounded-full">
                      <l-tailspin
                        size="40"
                        stroke="4"
                        speed="1"
                        color="black"
                      ></l-tailspin>
                    </div>
                  ) : null}
                </div>
                <div className="pb-6">
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold">
                    {profileUser?.username}
                  </p>
                  {/* <p className="text-sm md:text-base text-[#aaa]">
                    Follower: {profileUser?.Followers?.length}
                  </p> */}
                </div>
              </div>
              {id !== user?._id && !isFetching && profileUser && (
                <div className="flex gap-2">
                  {btn1?.value && (
                    <button
                      className="bg-[#0861F2] px-3 py-1 rounded-md hover:opacity-80 text-white transition-all"
                      onClick={() => handleReqFriend(btn1?.id)}
                    >
                      {btn1?.value}
                    </button>
                  )}
                  {btn2?.value && (
                    <button
                      className="bg-[#0861F2] px-3 py-1 rounded-md hover:opacity-80 text-white transition-all"
                      onClick={() => handleReqFriend(btn2?.id)}
                    >
                      {btn2?.value}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between mx-auto w-full md:gap-4 lg:gap-8">
            <ProfileLeftBar />
            <ProfileMainPost />
          </div>
        </div>

        {/* <ProfileRightBar /> */}
      </div>
    </div>
  );
};

export default Profile;
