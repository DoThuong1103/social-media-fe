import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import ProfileLeftBar from "../../Components/ProfileLeftSideContainer/ProfileLeftBar";
import ProfileRightBar from "../../Components/ProfileRightSideContainer/ProfileRightBar";
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
import { useSelector } from "react-redux";
import ProfileImg from "../../Components/CommonComponents/Img/ProfileImg";
import { tailspin } from "ldrs";

const Profile = () => {
  const userDetails = useSelector((state) => state.user);
  const user = userDetails?.user.other;
  const accessToken = userDetails.user.accessToken;
  const [profileUser, setProfileUser] = useState("");
  const [isUpload, setIsUpload] = useState(false);
  const [image, setImage] = useState();
  const { id } = useParams();
  const getProfileUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/user/profile/${id}`
      );
      setProfileUser(res.data);
    } catch (error) {
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

  useEffect(() => {
    const handlePost = async (e) => {
      // e.preventDefault();
      if (image) {
        setIsUpload(true);
        const filename = new Date().getTime() + image.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

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
                    `http://localhost:5000/api/user/updateProfile`,
                    {
                      coverImage: downloadURL,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        token: userDetails.user.accessToken,
                      },
                    }
                  )
                  .then((data) => {
                    setIsUpload(false);
                    setImage(null);
                    getProfileUser();
                  });
              }
            );
          }
        );
      }
    };
    handlePost();
  }, [image]);

  const handleFollowing = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/user/following/${id}`,
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

  return (
    <div className="bg-slate-200 min-h-screen scroll-smooth">
      <Navbar />
      <div className="flex flex-col justify-center mx-auto pt-16 w-11/12">
        <div className="relative flex flex-col w-full lg:w-5/6 mx-auto">
          <div className="w-full">
            <div className="relative flex w-full h-60 md:h-96 mx-auto">
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
                {profileUser.coverImage ? (
                  <img
                    className="object-cover rounded-t-md w-full"
                    src={profileUser.coverImage}
                    alt=""
                  />
                ) : (
                  <div className="w-full bg-gradient-to-r from-[rgba(155,198,247,0.17)] from-0% via-[#7db8fb] via-50% to-[#00d5ffdb] to-100%"></div>
                )}
              </div>
              {id === user._id && (
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
            <div className="relative flex items-end pb-2 pl-2 md:pb-0 md:pl-0 md:items-center md:justify-end bg-white w-full h-28 md:h-24 rounded-b-lg pr-10">
              <div className="absolute -top-8 left-2 lg:-top-20 lg:left-6 flex gap-4 items-end">
                <div className="relative">
                  <ProfileImg
                    src={profileUser.avatar}
                    size="large"
                  ></ProfileImg>
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
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <div className="pb-6">
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold">
                    {profileUser.username}
                  </p>
                  {/* <p className="text-sm md:text-base text-[#aaa]">
                    Follower: {profileUser?.Followers?.length}
                  </p> */}
                </div>
              </div>
              {id !== user._id && (
                <button
                  className="bg-[#0861F2] px-3 py-1 rounded-md hover:opacity-80 hover:font-semibold text-white transition-all"
                  onClick={handleFollowing}
                >
                  {profileUser?.Followers?.includes(user._id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between mx-auto w-full md:gap-8">
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
