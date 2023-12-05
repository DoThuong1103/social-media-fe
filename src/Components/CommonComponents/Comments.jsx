import React, { useEffect, useState } from "react";
import ProfileImg from "./Img/ProfileImg";
import { AiOutlineSend } from "react-icons/ai";
import { useSelector } from "react-redux";
import CommentContainer from "./CommentContainer";

const Comments = ({ handleComment, post, comments, maxHight }) => {
  const userDetails = useSelector((state) => state.user);
  const userId = userDetails.user._id;
  const [isShowMore, setIsShowMore] = useState(false);
  const [commentWriting, setCommentWriting] = useState("");
  // const [comments, setComments] = useState(post.comments);
  const [visibleComments, setVisibleComments] = useState(5);
  useEffect(() => {
    if (comments?.length > 5) {
      setIsShowMore(true);
    }
    if (visibleComments >= comments?.length) {
      setIsShowMore(false);
    }
  }, [visibleComments, comments?.length]);

  const handleShowMoreComment = () => {
    setVisibleComments(visibleComments + 5);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 ">
        <ProfileImg src={userDetails.user.avatar} alt="" />
        <div className="flex items-center px-2 rounded-lg flex-1 bg-slate-200">
          <input
            className="w-full outline-none bg-transparent"
            type="text"
            placeholder="Write your comment"
            value={commentWriting}
            onChange={(e) => setCommentWriting(e.target.value)}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter" && commentWriting) {
            //     handleComment({
            //       postId: post._id,
            //       userId,
            //       comment: commentWriting,
            //     });
            //     setCommentWriting("");
            //   }
            // }}
          />
          <AiOutlineSend
            className={`text-2xl cursor-pointer ${
              commentWriting
                ? "opacity-100"
                : "opacity-80 cursor-not-allowed"
            }`}
            onClick={
              commentWriting
                ? () => {
                    handleComment({
                      postId: post._id,
                      userId,
                      comment: commentWriting,
                      userIdCmt: post.user._id,
                    });
                    setCommentWriting("");
                  }
                : null
            }
          />
        </div>
      </div>
      <div
        className={`pb-2 ${
          maxHight
            ? "max-h-[70vh] overflow-auto overflow-y-scroll"
            : ""
        }`}
      >
        <div className="flex flex-col flex-1 gap-2 ">
          {comments &&
            comments
              ?.slice(0, visibleComments)
              ?.map((comment, index) => (
                <div key={userId + index}>
                  <CommentContainer
                    userId={userId}
                    postId={post._id}
                    comment={comment}
                    handleComment={handleComment}
                  />
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
    </div>
  );
};

export default Comments;
