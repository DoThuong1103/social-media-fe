import React, { useState } from "react";
import ProfileImg from "../CommonComponents/Img/ProfileImg";
import Icon from "../CommonComponents/Img/Icon";
import LikeIcon from "../../Images/like.png";
import LikeIconActive from "../../Images/setLike.png";
import UserImg from "../../Images/icons8-user-100.png";
import CommentIcon from "../../Images/speech-bubble.png";
import ShareIcon from "../../Images/share.png";
import MoreOption from "../../Images/more.png";
import axios from "axios";
import { useSelector } from "react-redux";
import ImagesContainer from "../CommonComponents/Img/ImagesContainer";
import Time from "../CommonComponents/Time";
import { tailspin } from "ldrs";
import Comments from "../CommonComponents/Comments";
import { Link } from "react-router-dom";

tailspin.register();

// Default values shown

const PostContainer = ({ post, getPost }) => {
  const userDetails = useSelector((state) => state.user);
  const userId = userDetails.user.other._id;
  const accessToken = userDetails.user.accessToken;
  const [like, setLike] = useState(
    post?.like?.includes(userId) ? LikeIconActive : LikeIcon
  );
  const [count, setCount] = useState(post?.like?.length);
  const [comments, setComments] = useState(post.comments);
  const [countComment, setCountComment] = useState(post.countComment);
  const [isShowComment, setIsShowComment] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoadLike, setIsLoadLike] = useState(false);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };
  const handleLike = async () => {
    if (like === LikeIcon) {
      setIsLoadLike(true);
      await fetch(`http://localhost:5000/api/post/${post._id}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application.Json",
          token: accessToken,
        },
      });
      setIsLoadLike(false);
      setLike(LikeIconActive);
      setCount(count + 1);
    } else {
      setIsLoadLike(true);
      await fetch(
        `http://localhost:5000/api/post/${post._id}/dislike`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application.Json",
            token: accessToken,
          },
        }
      );
      setIsLoadLike(false);
      setLike(LikeIcon);
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
      `http://localhost:5000/api/post/comment`,
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

  return (
    <div>
      <div className="w-full mx-auto bg-white my-5 rounded-lg p-3 pb-0">
        <div className="flex flex-col gap-4">
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
          <div>
            <p
              className={`${
                post?.title?.length > 200 ? "line-clamp-3" : ""
              }   ${isExpanded ? "line-clamp-none" : ""}`}
            >
              {post.title}
            </p>
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
              />
            )}
            {post?.video && (
              <video className="w-full h-full rounded-sm" controls>
                <source src={`${post?.video}`} type="video/mp4" />
              </video>
            )}
          </div>
          <div className="flex justify-around items-center border-t-[1px] py-1">
            <div
              className="flex-1 flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-200 py-1 rounded-md transition-all"
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
                <Icon src={like} pointer alt="" />
              )}
              <p>{count} Likes</p>
            </div>
            <div className="h-6 w-[1px] bg-[#dfdede]"></div>
            <div
              className="flex-1 flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-200 py-1 rounded-sm transition-all"
              onClick={handleShowComment}
            >
              <Icon src={CommentIcon} pointer alt="" />
              <p>{countComment} Comments</p>
            </div>
            <div className="h-6 w-[1px] bg-[#dfdede]"></div>

            <div className="flex-1 flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-200 py-1 rounded-sm transition-all">
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
