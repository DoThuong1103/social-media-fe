import React, { useEffect, useState } from "react";
import ProfileImg from "./Img/ProfileImg";
import Time from "./Time";
import { AiOutlineSend } from "react-icons/ai";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
const CommentContainer = ({
  comment,
  handleComment,
  postId,
  userId,
}) => {
  const [showReply, setShowReply] = useState();
  const [commentWriting, setCommentWriting] = useState("");
  const [isShowMore, setIsShowMore] = useState(false);
  const [showCommentsReply, setShowCommentsReply] = useState(false);
  const [visibleComments, setVisibleComments] = useState(5);
  useEffect(() => {
    if (comment?.replies?.length > 5) {
      setIsShowMore(true);
    }
    if (visibleComments >= comment?.replies?.length) {
      setIsShowMore(false);
    }
  }, [visibleComments, comment?.replies?.length]);

  const handleShowMoreComment = () => {
    setVisibleComments(visibleComments + 5);
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <ProfileImg src={comment.user.avatar} size="medium" alt="" />
        <div className="flex flex-1 flex-col items-start gap-3 ">
          <div className="flex flex-col gap-1">
            <div>
              <div className="flex flex-col w-fit bg-slate-200 px-2 py-[4px] rounded-2xl">
                <p className="font-semibold">
                  {comment.user.username}
                </p>
                <p>{comment.comment}</p>
              </div>
            </div>
            <div className="flex flex-1  gap-2">
              <p
                className="text-[#aaa] cursor-pointer text-xs"
                onClick={() => setShowReply(!showReply)}
              >
                Reply
              </p>
              <Time times={comment.createdAt} />

              <p
                className={`${
                  comment?.replies?.length > 0 ? "block" : "hidden"
                } text-[#aaa] cursor-pointer text-xs`}
                onClick={() =>
                  setShowCommentsReply(!showCommentsReply)
                }
              >
                {showCommentsReply ? (
                  <div className="flex items-center gap-[1px]">
                    <span>Hidden</span>
                    <MdKeyboardArrowUp />
                  </div>
                ) : (
                  <div className="flex items-center gap-[1px]">
                    <span>Show more</span>
                    <MdKeyboardArrowDown />
                  </div>
                )}
              </p>
            </div>
          </div>
          {showReply && (
            <div className="flex w-full items-center px-2 py-2 rounded-lg flex-1 bg-slate-200 transition-all">
              <input
                className="w-full outline-none bg-transparent"
                type="text"
                placeholder="Write your comment"
                value={commentWriting}
                onChange={(e) => setCommentWriting(e.target.value)}
              />
              <AiOutlineSend
                className={`text-2xl cursor-pointer `}
                onClick={() => {
                  handleComment({
                    postId: postId,
                    userId: userId,
                    userIdCmt: comment?.user?._id,
                    cmtMain: comment?._id,
                    comment: commentWriting,
                  });
                  setCommentWriting("");
                  setShowCommentsReply(true);
                }}
              />
            </div>
          )}
        </div>
      </div>
      {showCommentsReply && (
        <div className="pl-4 flex flex-col gap-3">
          {comment?.replies?.length > 0 &&
            comment?.replies
              ?.slice(0, visibleComments)
              ?.map((reply, index) => {
                return (
                  <div key={index}>
                    <CommentContainer
                      comment={reply}
                      handleComment={handleComment}
                      postId={postId}
                      userId={userId}
                    />
                  </div>
                );
              })}
          {isShowMore && (
            <p
              className="cursor-pointer opacity-80 text-sm"
              onClick={handleShowMoreComment}
            >
              Show more...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentContainer;
