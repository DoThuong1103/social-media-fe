import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import coverImageDefault from "../../Images/groups-default.png";
import { GoPlus } from "react-icons/go";
import ContentPost from "../ContentPostContainer/ContentPost";
import PostContainer from "../PostContainer/PostContainer";
import PostLoading from "../CommonComponents/PostLoading/PostLoading";
import SearchIcon from "../../Images/search.png";
import { IoMdCloseCircle } from "react-icons/io";
import Icon from "../CommonComponents/Img/Icon";
import MemberContainer from "../MemberContainer/MemberContainer";
import { MdOutlineHorizontalRule } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { AiOutlineClose } from "react-icons/ai";
import { IoPencil } from "react-icons/io5";
import { notify } from "../../Redux/notify";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../../firebase";
import { FaCamera } from "react-icons/fa";
const dataTab = [
  {
    id: "discussion",
    name: "Discussion",
  },
  {
    id: "people",
    name: "People",
  },
  {
    id: "image",
    name: "Image",
  },
];
const GroupDetail = ({
  groupId,
  tabActive,
  setTabActive,
  setIsOpenInviteFriendDiaLog,
}) => {
  const [groupDetail, setGroupDetail] = useState();
  const { accessToken, user } = useSelector((state) => state.user);
  const [posts, setPosts] = useState({
    result: [],
    totalPost: 0,
  });
  const [isFetching, setIsFetching] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(1);
  const [visibleMembers, setVisibleMembers] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [images, setImages] = useState();
  const [openImg, setOpenImg] = useState(false);
  const [isEditNameGroup, setIsEditNameGroup] = useState(false);
  const [nameGroup, setNameGroup] = useState("");
  const [coverImage, setCoverImage] = useState();
  const [isUploadCoverImage, setIsUploadCoverImage] = useState(false);

  const id = user._id;

  const divRef = useRef();
  const memberRef = useRef();
  const isAdmin = groupDetail?.users?.some(
    (item) =>
      item?.user?._id === user?._id &&
      (item?.role === "admin" || item?.role === "groupCreator")
  );
  // is member
  const isMember =
    isAdmin ||
    groupDetail?.users?.some((item) => item?.user?._id === user?._id);
  const getGroupDetail = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/group/groupDetail/${groupId}`,
        {
          headers: {
            token: accessToken,
          },
        }
      );
      setGroupDetail(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getPost = async () => {
    setIsFetching(true);
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/post/postsGroup/${groupId}`,
        {
          params: {
            page: visiblePosts || 1,
            pageSize: 3,
          },
        },
        {
          headers: {
            token: accessToken,
          },
        }
      );
      setPosts((prevPosts) => {
        // If it's page 1, replace the existing data
        if (visiblePosts === 1) {
          return {
            result: res.data.result,
            totalPost: res.data.totalPost,
          };
        }

        // Otherwise, append the new data
        return {
          result: [...prevPosts.result, ...res.data.result],
          totalPost: res.data.totalPost,
        };
      });

      setIsFetching(false);
    } catch (error) {}
  };

  const getImages = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/group/images/${groupId}`,
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
    if (tabActive === "image") {
      getImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabActive]);

  useEffect(() => {
    if (tabActive === "discussion") {
      getPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, visiblePosts]);
  useEffect(() => {
    getGroupDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const showMorePosts = () => {
    if (
      posts?.result?.length < posts?.totalPost &&
      posts?.result?.length > 0
    ) {
      setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 1);
    }
  };
  const showMoreMembers = () => {
    if (visibleMembers < groupDetail?.users.length) {
      setVisibleMembers((prevVisiblePosts) => prevVisiblePosts + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const { current } = divRef;
      if (current) {
        // Kiểm tra xem đã scroll đến cuối cùng hay chưa
        if (
          current.scrollTop + current.clientHeight + 500 >=
            current.scrollHeight &&
          isFetching === false &&
          tabActive === "discussion"
        ) {
          // Gọi lại hàm getPost khi scroll đến cuối cùng
          // getPost();
          showMorePosts();
        }
      }
    };

    // Gắn sự kiện scroll cho divRef.current
    const currentDiv = divRef.current;
    if (currentDiv) {
      currentDiv.addEventListener("scroll", handleScroll);
    }

    // Loại bỏ sự kiện khi component unmount
    return () => {
      if (currentDiv) {
        currentDiv.removeEventListener("scroll", handleScroll);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divRef, posts]);

  useEffect(() => {
    const handleScroll = () => {
      const { current } = memberRef;
      if (current) {
        if (
          current.scrollTop + current.clientHeight + 150 >=
          current.scrollHeight
        ) {
          showMoreMembers();
        }
      }
    };

    // Gắn sự kiện scroll cho divRef.current
    const currentDiv = memberRef.current;
    if (currentDiv) {
      currentDiv.addEventListener("scroll", handleScroll);
    }

    // Loại bỏ sự kiện khi component unmount
    return () => {
      if (currentDiv) {
        currentDiv.removeEventListener("scroll", handleScroll);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberRef, groupDetail]);

  useEffect(() => {
    if (!groupDetail?.users) return;
    const cloneMember = groupDetail?.users?.map((item) => {
      return {
        ...item,
      };
    });
    const sortedMember = cloneMember?.sort((a, b) =>
      a?.username?.localeCompare(b.username, undefined, {
        sensitivity: "base",
      })
    );
    const results = sortedMember?.filter((user) =>
      user?.user?.username?.toLowerCase()?.includes(searchTerm)
    );
    setSearchResults(results);
  }, [searchTerm, groupDetail?.users]);
  const changeNameGroup = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACK_END_URL}/group/updateGroup/${groupId}`,
        {
          groupName: nameGroup,
        },
        {
          headers: {
            token: accessToken,
          },
        }
      );
      // After successfully leaving the group, fetch the updated list of groups
      getGroupDetail();
      setIsEditNameGroup(false);
      notify("success", "Update name group successfully");
    } catch (error) {
      console.error("Error leaving group:", error.message);
    }
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const joinGroup = async () => {
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
      getGroupDetail();
    } catch (error) {
      console.error("Error leaving group:", error.message);
    }
  };

  const leaveGroup = async () => {
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
      getGroupDetail();
    } catch (error) {
      console.error("Error leaving group:", error.message);
    }
  };

  useEffect(() => {
    const handlePost = async (e) => {
      // e.preventDefault();
      if (coverImage) {
        setIsUploadCoverImage(true);
        const filename = new Date().getTime() + coverImage?.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(
          storageRef,
          coverImage
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
                    `${process.env.REACT_APP_BACK_END_URL}/group/updateGroup/${groupId}`,
                    {
                      coverImage: downloadURL,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        token: accessToken,
                      },
                    }
                  )
                  .then((data) => {
                    setIsUploadCoverImage(false);
                    getGroupDetail();
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
  }, [coverImage]);

  return (
    <div
      className="w-full flex-1 flex flex-col gap-4 overflow-hidden overflow-y-scroll max-h-screen -mr-2 overflow-x-hidden pb-8 "
      // style={{ maxHeight: "calc(100vh - 72px)" }}
      ref={divRef}
    >
      <div className="w-full flex flex-col bg-white  gap-6 pb-2">
        <div className="relative flex justify-center  h-60 md:h-96">
          {isUploadCoverImage ? (
            <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-slate-300 opacity-40 z-10">
              <l-tailspin
                size="40"
                stroke="4"
                speed="1"
                color="black"
              ></l-tailspin>
            </div>
          ) : null}
          <img
            src={groupDetail?.coverImage || coverImageDefault}
            className="w-[96%] h-full -ml-[6px] object-cover"
            alt=""
          />
          {isAdmin && (
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
                onChange={handleCoverImageChange}
              />
            </label>
          )}
        </div>
        <div className="flex flex-col gap-4 ">
          <div className="flex justify-between items-center mx-8 md:px-12 lg:px-10 ">
            <div className="flex gap-1 items-center">
              <span className="font-semibold text-xl md:text-2xl lg:text-3xl">
                {groupDetail?.groupName}
              </span>
              {!isEditNameGroup && (
                <div
                  className=" p-1 rounded-full bg-slate-200 hover:opacity-80 cursor-pointer"
                  onClick={() => setIsEditNameGroup(true)}
                >
                  <IoPencil />
                </div>
              )}
              {isEditNameGroup && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Edit group name"
                    value={nameGroup}
                    onChange={(e) => setNameGroup(e.target.value)}
                    className="border border-[#aaa] rounded px-2 py-1 outline-none"
                  />
                  <button
                    className="py-1 px-2 bg-slate-200  hover:bg-slate-300 rounded "
                    onClick={() => setIsEditNameGroup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-[#0861F2] px-2 hover:bg-[#b6d2ff] bg-[#cadeff] rounded"
                    onClick={changeNameGroup}
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
            {isMember ? (
              <div className="flex flex-col md:flex-row gap-2">
                <button
                  className="flex gap-1 items-center bg-[#0861F2] px-3 py-1 rounded-md hover:opacity-80 text-white transition-all group"
                  onClick={() => setIsOpenInviteFriendDiaLog(true)}
                >
                  <GoPlus className="group-hover:rotate-90 transition-all duration-500 w-5 h-5" />
                  <span className="text-sm md:text-base">Invite</span>
                </button>
                <button
                  className="flex gap-1 items-center bg-[#0861F2] px-3 py-1 rounded-md hover:opacity-80 text-white transition-all group"
                  onClick={leaveGroup}
                >
                  <MdOutlineHorizontalRule className=" transition-all duration-500 w-5 h-5" />
                  <span className="text-sm md:text-base">Leave</span>
                </button>
              </div>
            ) : (
              <button
                className="flex gap-1 items-center bg-[#0861F2] px-3 py-1 rounded-md hover:opacity-80 text-white transition-all group"
                onClick={joinGroup}
              >
                <span className="text-sm md:text-base">Join</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 mx-8 md:px-10 lg:px-12">
          <hr />
          <div className="flex gap-2">
            {dataTab.map((tab) => (
              <span
                className={`text-sm md:text-base px-4 py-1 hover:bg-slate-200 cursor-pointer transition-all rounded font-semibold ${
                  tabActive === tab.id ? "text-[#0861F2] " : ""
                }`}
                onClick={() => setTabActive(tab.id)}
              >
                {tab.name}
                <div
                  className={`pt-2 ${
                    tabActive === tab.id
                      ? "border-b-[2px] border-b-[#0861F2]"
                      : ""
                  }`}
                ></div>
              </span>
            ))}
          </div>
        </div>
      </div>
      {tabActive === "discussion" && (
        <div className="max-w-[650px] mx-auto flex flex-col gap-2 px-2 sm:px-10 w-full">
          {isMember && (
            <div>
              <ContentPost groupId={groupId} getPost={getPost} />
            </div>
          )}
          <div className="flex flex-col gap-4 w-full pt-2" id="test">
            {posts?.result?.map((post) => {
              return (
                <PostContainer
                  key={post._id}
                  post={post}
                  getPost={getPost}
                />
              );
            })}
          </div>
          {isFetching && <PostLoading />}
        </div>
      )}
      {tabActive === "people" && (
        <div className="max-w-[600px] flex flex-col gap-2 mx-auto w-full ">
          <div className="flex flex-col gap-2 w-full bg-white px-4 py-2 h-[600px] ">
            <div>
              <span>{groupDetail?.users?.length} member</span>
            </div>
            <div className="relative flex w-full items-center bg-slate-200 p-1 md:px-2 rounded-full md:rounded-lg gap-1">
              <Icon
                src={SearchIcon}
                alt=""
                pointer={true}
                size="medium"
              />
              <input
                className="bg-transparent  w-full rounded-md p-[2px] outline-none"
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
            <div
              className="max-h-[500px] flex flex-col gap-2 overflow-hidden overflow-y-scroll min-h-[400px] "
              ref={memberRef}
            >
              {searchResults
                ?.slice(0, visibleMembers)
                ?.map((friend, index) => (
                  <div className="last:pb-30">
                    <MemberContainer
                      friend={friend}
                      groupId={groupId}
                      getGroupDetail={getGroupDetail}
                      isAdmin={isAdmin}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {tabActive === "image" && (
        <div className="max-w-[600px] flex flex-col gap-2 mx-auto w-full ">
          <div className="flex flex-col gap-2 w-full bg-white px-4 py-2 h-[600px] ">
            <div className="flex justify-around items-center">
              <p
                className={`text-lg font-bold text-center cursor-pointer text-[#0861F2] transition-all
            }`}
              >
                Images
              </p>
            </div>
            <div
              className={`w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 px-2 overflow-hidden overflow-y-scroll  duration-1000 transition-all cursor-pointer`}
            >
              {images
                ?.slice(0, 30)
                ?.map((image) =>
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
        </div>
      )}
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
    </div>
  );
};

export default GroupDetail;
