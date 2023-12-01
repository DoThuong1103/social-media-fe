import React, { useEffect, useState } from "react";
import axios from "axios";
import ContentPost from "../ContentPostContainer/ContentPost";
import PostContainer from "../PostContainer/PostContainer";
import { useSelector } from "react-redux";
import PostLoading from "../CommonComponents/PostLoading/PostLoading";

const MainPost = () => {
  const [posts, setPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const userDetails = useSelector((state) => state.user);
  const getPost = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/post/allPost",
        {
          headers: {
            token: userDetails.user.accessToken,
          },
        }
      );
      setPosts(res.data);
      setIsFetching(false);
    } catch (error) {}
  };
  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex-[3] min-w-[450px] max-w-[650px] mx-auto">
      <ContentPost getPost={getPost} />
      {isFetching && <PostLoading />}
      {posts?.map((post) => {
        return (
          <PostContainer
            key={post._id}
            post={post}
            getPost={getPost}
          />
        );
      })}
    </div>
  );
};

export default MainPost;
