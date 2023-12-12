import React, { useEffect, useState } from "react";
import LikeIcon from "../../Images/like.png";
import LikeIconActive from "../../Images/setLike.png";
import UserImg from "../../Images/icons8-user-100.png";
import CommentIcon from "../../Images/speech-bubble.png";
import ShareIcon from "../../Images/share.png";
import MoreOption from "../../Images/more.png";
import { AiOutlineSend } from "react-icons/ai";
import axios from "axios";
import ProfileImg from "../CommonComponents/Img/ProfileImg";
import Icon from "../CommonComponents/Img/Icon";
const ProfilePostContainer = ({ post }) => {
  const userId = "654f49d81d0d3aa555cc20ac";
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NTQ4M2ZkOGU2NGYwNTUzOTQyMjc1YiIsInVzZXJuYW1lIjoiYWRtaW4xIiwiaWF0IjoxNzAwMDM4NzYwfQ.8fGgRVuQtnSidggH8Tk9x_2jzv9mCyFC9lei0huxMOc";
  const [like, setLike] = useState(
    post?.like?.includes(userId) ? LikeIconActive : LikeIcon
  );
  const [count, setCount] = useState(post?.like?.length);
  const [comments, setComments] = useState(post.comments);
  const [commentWriting, setCommentWriting] = useState("");
  const [isShowComment, setIsShowComment] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);
  const [visibleComments, setVisibleComments] = useState(5);
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACK_END_URL}/user/post/user/details/${post.user}`
        );
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [post.user]);
  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };
  const handleLike = async () => {
    if (like === LikeIcon) {
      await fetch(`${process.env.REACT_APP_BACK_END_URL}/post/${post._id}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application.Json",
          token: accessToken,
        },
      });
      setLike(LikeIconActive);
      setCount(count + 1);
    } else {
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
      setLike(LikeIcon);
      setCount(count - 1);
    }
  };
  const handleComment = async () => {
    const res = await axios.put(
      `${process.env.REACT_APP_BACK_END_URL}/post/comment`,
      {
        postid: post._id,
        content: commentWriting,
      },
      {
        headers: {
          token: accessToken,
        },
      }
    );
    setComments(res.data.comments);
    setCommentWriting("");
  };
  const handleShowComment = () => {
    setIsShowComment(!isShowComment);
  };
  const handleShowMoreComment = () => {
    setVisibleComments(visibleComments + 10);
  };

  useEffect(() => {
    if (comments?.length > 10) {
      setIsShowMore(true);
    }
    if (visibleComments >= comments?.length) {
      setIsShowMore(false);
    }
  }, [visibleComments, comments?.length]);
  return (
    <div>
      <div className="w-full mx-auto bg-white my-5 rounded-lg p-3">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            {user?.profile ? (
              <ProfileImg src={user?.profile} size="medium" alt="" />
            ) : (
              <ProfileImg src={UserImg} size="medium" alt="" />
            )}

            <div>
              <p>{user?.username}</p>
              <p className="text-xs text-[#aaa]">
                Following by sumam
              </p>
            </div>
            <img
              src={MoreOption}
              className="w-5 ml-auto cursor-pointer"
              alt=""
            />
          </div>
          <div>
            <p
              className={`${
                post.title.length > 200 ? "line-clamp-3" : ""
              }   ${isExpanded ? "line-clamp-none" : ""}`}
            >
              {post.title}
            </p>
            <button
              className={` hover:underline text-sm ${
                post.title.length > 200 ? "block" : "hidden"
              } `}
              onClick={toggleText}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          </div>
          <img
            src={post.image}
            className="w-[90%] h-[90%] object-contain mx-auto  rounded-sm overflow-hidden"
            alt=""
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 cursor-pointer ">
                <Icon
                  src={like}
                  pointer
                  alt=""
                  onClick={handleLike}
                />
                <p>{count} Likes</p>
              </div>
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={handleShowComment}
              >
                <Icon src={CommentIcon} pointer alt="" />
                <p>{comments?.length} Comments</p>
              </div>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <Icon src={ShareIcon} pointer alt="" />
              <p>100K Share</p>
            </div>
          </div>
          {isShowComment && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 ">
                {user?.profile ? (
                  <ProfileImg
                    src={user?.profile}
                    size="medium"
                    alt=""
                  />
                ) : (
                  <ProfileImg src={UserImg} size="medium" alt="" />
                )}
                <div className="flex items-center px-2 rounded-lg flex-1 bg-slate-200">
                  <input
                    className="w-full outline-none bg-transparent"
                    type="text"
                    placeholder="Write your comment"
                    value={commentWriting}
                    onChange={(e) =>
                      setCommentWriting(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && commentWriting) {
                        handleComment();
                      }
                    }}
                  />
                  <AiOutlineSend
                    className={`text-2xl cursor-pointer ${
                      commentWriting
                        ? "opacity-100"
                        : "opacity-80 cursor-not-allowed"
                    }`}
                    onClick={commentWriting ? handleComment : null}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {[...comments]
                  .reverse()
                  ?.slice(0, visibleComments)
                  ?.map((comment, index) => (
                    <div
                      className="flex items-start gap-3 "
                      key={index}
                    >
                      {comment?.profile ? (
                        <ProfileImg
                          src={comment?.profile}
                          size="medium"
                          alt=""
                        />
                      ) : (
                        <ProfileImg
                          src={UserImg}
                          size="medium"
                          alt=""
                        />
                      )}
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-col bg-slate-200 px-2 py-[6px] rounded-2xl">
                          <p className="font-semibold">
                            {comment.username}
                          </p>
                          <p>{comment.comment}</p>
                        </div>
                        <div>
                          <p className="text-[#aaa] cursor-pointer text-xs">
                            Reply
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {isShowMore && (
                <p
                  className="cursor-pointer opacity-80"
                  onClick={handleShowMoreComment}
                >
                  Show more...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePostContainer;
