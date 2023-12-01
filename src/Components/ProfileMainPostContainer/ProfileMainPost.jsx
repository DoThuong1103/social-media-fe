import React, { useEffect, useState } from "react";
import ContentPost from "../ContentPostContainer/ContentPost";
// import ProfileImage from "../../Images/Profile.png";
// import ProfilePostContainer from "../ProfilePostContainer/ProfilePostContainer";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PostContainer from "../PostContainer/PostContainer";

const ProfileMainPost = () => {
  const userDetails = useSelector((state) => state.user);

  const accessToken = userDetails.user.accessToken;
  const { id } = useParams();
  const [posts, setPosts] = useState();
  const getPost = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/post/userPost/${id}`,
        {
          headers: {
            token: `${accessToken}`,
          },
        }
      );
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken]);

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full mx-auto">
        {id === userDetails.user._id && <ContentPost />}
      </div>
      {posts?.map((post, index) => (
        <PostContainer key={post._id} post={post} getPost={getPost} />
      ))}
    </div>
  );
};

export default ProfileMainPost;
