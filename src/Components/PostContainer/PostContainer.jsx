import React, { useState } from "react";
import axios from "axios";
import { tailspin } from "ldrs";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import ImagesContainer from "../CommonComponents/Img/ImagesContainer";
import Time from "../CommonComponents/Time";
import Comments from "../CommonComponents/Comments";
import ProfileImg from "../CommonComponents/Img/ProfileImg";
import Icon from "../CommonComponents/Img/Icon";
import UserImg from "../../Images/icons8-user-100.png";
import { TbMessageCircle2Filled } from "react-icons/tb";
import { TbMessageCircle2 } from "react-icons/tb";
import ShareIcon from "../../Images/share.png";
import MoreOption from "../../Images/more.png";
import { FaHeart } from "react-icons/fa6";
import coverImage from "../../Images/groups-default.png";
tailspin.register();

// Default values shown

const PostContainer = ({ post }) => {
  const userDetails = useSelector((state) => state.user);
  const userId = userDetails.user._id;
  const accessToken = userDetails.accessToken;
  const [like, setLike] = useState(post?.like?.includes(userId));
  const [count, setCount] = useState(post?.like?.length);
  const [comments, setComments] = useState(post.comments);
  const [countComment, setCountComment] = useState(post.countComment);
  const [isShowComment, setIsShowComment] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoadLike, setIsLoadLike] = useState(false);

  let params = useParams();
  // eslint-disable-next-line no-unused-vars
  const { org, "*": splat } = params;
  const groupId =
    splat?.includes("group/detail") && splat?.split("/")[1];

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };
  const handleLike = async () => {
    if (!like) {
      setIsLoadLike(true);
      await fetch(
        `${process.env.REACT_APP_BACK_END_URL}/post/${post._id}/like`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application.Json",
            token: accessToken,
          },
        }
      );
      setIsLoadLike(false);
      setLike(true);
      setCount(count + 1);
    } else {
      setIsLoadLike(true);
      await fetch(
        `${process.env.REACT_APP_BACK_END_URL}/post/${post._id}/dislike`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application.Json",
            token: accessToken,
          },
        }
      );
      setIsLoadLike(false);
      setLike(false);
      setCount(count - 1);
    }
  };
  const handleComment = async ({
    postId,
    userId,
    userIdCmt,
    comment,
    cmtMain,
  }) => {
    const res = await axios.put(
      `${process.env.REACT_APP_BACK_END_URL}/post/comment`,
      {
        postId: postId,
        userId: userId,
        userIdCmt: userIdCmt,
        content: comment,
        cmtMain: cmtMain,
      },
      {
        headers: {
          token: accessToken,
        },
      }
    );
    // setComments(res.data.comments);
    setComments(res.data.comments);
    setCountComment(res.data.countComment);
    // getPost();
  };
  const handleShowComment = () => {
    setIsShowComment(!isShowComment);
  };

  const TextWithLinks = ({ data }) => {
    const MAX_LINK_LENGTH = 100;
    // Sử dụng biểu thức chính quy để tìm liên kết trong văn bản
    const textWithLinks = data?.title?.replace(
      /(https?:\/\/[^\s]+)/g,
      (url) => {
        const displayText =
          url.length > MAX_LINK_LENGTH
            ? `${url.slice(0, MAX_LINK_LENGTH)}...`
            : url;
        return `<a href="${url}" target="_blank" class = "text-[#0861F2]">${displayText}</a>`;
      }
    );

    // Sử dụng dangerouslySetInnerHTML để hiển thị HTML được tạo động
    return (
      <div
        className="w-full"
        dangerouslySetInnerHTML={{ __html: textWithLinks }}
      />
    );
  };
  return (
    <div>
      <div className="w-full mx-auto bg-white rounded-lg p-3 pb-0">
        <div className="flex flex-col gap-4">
          {post?.group && !groupId ? (
            <div className="flex gap-2 items-center">
              <Link
                to={`/groups/detail/${post?.group?._id}`}
                className="flex "
              >
                <ProfileImg
                  src={post?.group?.coverImage || coverImage}
                  size="medium1"
                />
              </Link>
              <div className="flex items-center justify-between w-full flex-1">
                <div className="flex flex-col">
                  <Link
                    to={`/groups/detail/${post?.group?._id}`}
                    className="flex gap-2 justify-between items-center"
                  >
                    <p className=" font-semibold">
                      {post?.group?.groupName?.length > 20 ? (
                        <>{post?.group?.groupName?.slice(0, 20)}...</>
                      ) : (
                        post?.group?.groupName
                      )}
                    </p>
                  </Link>
                  <Link
                    to={`/profile/${post?.user?._id}`}
                    className="flex gap-2 items-center"
                  >
                    {post.user?.avatar ? (
                      <ProfileImg src={post?.user?.avatar} alt="" />
                    ) : (
                      <ProfileImg
                        src={UserImg}
                        size="medium"
                        alt=""
                      />
                    )}

                    <div>
                      <p className="text-xs text-[#aaa]">
                        {post?.user?.username}
                      </p>
                      <Time times={post?.createdAt}></Time>
                    </div>
                  </Link>
                </div>
                <img
                  src={MoreOption}
                  className="w-5 ml-auto cursor-pointer"
                  alt=""
                />
              </div>
            </div>
          ) : (
            <Link
              to={`/profile/${post.user._id}`}
              className="flex gap-2 items-center"
            >
              {post.user?.avatar ? (
                <ProfileImg
                  src={post.user?.avatar}
                  size="medium"
                  alt=""
                />
              ) : (
                <ProfileImg src={UserImg} size="medium" alt="" />
              )}

              <div>
                <p>{post?.user?.username}</p>
                <Time times={post?.createdAt}></Time>
              </div>
              <img
                src={MoreOption}
                className="w-5 ml-auto cursor-pointer"
                alt=""
              />
            </Link>
          )}

          <div className="flex flex-col items-start w-full">
            <div
              className={`w-full ${
                post?.title?.length > 200 ? "line-clamp-3" : ""
              }   ${isExpanded ? "line-clamp-none" : ""}`}
            >
              <TextWithLinks data={post} />
              {/* {post.title} */}
            </div>
            <button
              className={` hover:underline text-sm ${
                post?.title?.length > 200 ? "block" : "hidden"
              } `}
              onClick={toggleText}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          </div>
          <div className="">
            {post.images && (
              <ImagesContainer
                post={post}
                images={post?.images}
                handleComment={handleComment}
                comments={comments}
                setShow={true}
              />
            )}
            {post?.video && (
              <video
                className="w-full h-full max-h-[500px] rounded-sm"
                controls
              >
                <source src={`${post?.video}`} type="video/mp4" />
              </video>
            )}
          </div>
          <div className="flex md:hidden justify-between items-center">
            <div
              className={`${
                count === 0 ? "opacity-0" : ""
              } flex items-center gap-2`}
            >
              <FaHeart className="text-red-500" />
              <span>{count}</span>
            </div>
            <div className="flex items-center gap-2">
              <TbMessageCircle2Filled className="w-4 h-4 text-slate-500 " />
              <span> {countComment}</span>
            </div>
          </div>
          <div className="flex justify-between md:justify-around items-center border-t-[1px] py-1">
            <div
              className="md:flex-1 flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-200 p-1 md:p-0 py-1 rounded-md transition-all"
              onClick={handleLike}
            >
              {isLoadLike ? (
                <l-tailspin
                  size="20"
                  stroke="3"
                  speed="1"
                  color="black"
                ></l-tailspin>
              ) : (
                <FaHeart
                  className={`w-4 h-4 md:w-5 md:h-5 ${
                    like ? "text-red-500" : "text-slate-500"
                  }`}
                />
              )}
              <div className="flex items-center gap-1">
                <span className="hidden md:block">{count}</span>{" "}
                <span>Likes</span>
              </div>
            </div>
            <div className="h-6 w-[1px] bg-[#dfdede] hidden md:block"></div>
            <div
              className="md:flex-1 flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-200 p-1 md:p-0 py-1 rounded-sm transition-all"
              onClick={handleShowComment}
            >
              <TbMessageCircle2 className="w-4 h-4 md:w-5 md:h-5" />
              <div className="flex items-center gap-1">
                <span className="hidden md:block">
                  {countComment}
                </span>{" "}
                <span>Comments</span>
              </div>
            </div>
            <div className="h-6 w-[1px] bg-[#dfdede] hidden md:block"></div>

            <div className="md:flex-1 flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-200 py-1 rounded-sm transition-all">
              <Icon src={ShareIcon} pointer alt="" />
              <p> Share</p>
            </div>
          </div>
          {isShowComment && (
            <Comments
              handleComment={handleComment}
              post={post}
              comments={comments}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostContainer;
