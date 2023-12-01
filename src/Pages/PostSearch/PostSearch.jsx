import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PostLoading from "../../Components/CommonComponents/PostLoading/PostLoading";
import PostContainer from "../../Components/PostContainer/PostContainer";
import RightBar from "../../Components/RightSideContainer/RightBar";
import LeftBar from "../../Components/LeftSideContainer/LeftBar";

const PostSearch = () => {
  const [post, setPost] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const userDetails = useSelector((state) => state.user);
  const { id } = useParams();
  const getPost = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/post/${id}`,
        {
          headers: {
            token: userDetails.user.accessToken,
          },
        }
      );
      setPost(res.data);
      setIsFetching(false);
    } catch (error) {}
  };
  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <div className="bg-slate-200 min-h-screen scroll-smooth">
      <Navbar />
      <div className="flex justify-between mx-auto pt-14 w-[96%] lg:w-[92%] gap-8">
        <div className="sticky top-20">
          <LeftBar />
        </div>
        <div className="flex flex-col gap-2 w-full md:max-w-[650px] mx-auto">
          {isFetching && <PostLoading />}
          {post && (
            <PostContainer
              key={post._id}
              post={post}
              getPost={getPost}
            />
          )}
        </div>
        <RightBar />
      </div>
    </div>
  );
};

export default PostSearch;
