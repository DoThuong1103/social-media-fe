import React, { useEffect, useRef, useState } from "react";
import ContentPost from "../ContentPostContainer/ContentPost";
// import ProfileImage from "../../Images/Profile.png";
// import ProfilePostContainer from "../ProfilePostContainer/ProfilePostContainer";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PostContainer from "../PostContainer/PostContainer";
import PostLoading from "../CommonComponents/PostLoading/PostLoading";

const ProfileMainPost = () => {
  const userDetails = useSelector((state) => state.user);
  const [isFetching, setIsFetching] = useState(false);
  const [posts, setPosts] = useState({
    result: [],
    totalPost: 0,
  });
  const [scrollLength, setScrollLength] = useState(0);
  const [heightPost, setHeightPost] = useState(0);
  const [visiblePosts, setVisiblePosts] = useState(1);

  const accessToken = userDetails.accessToken;
  const { id } = useParams();
  const divRef = useRef();

  useEffect(() => {
    if (divRef.current && posts) {
      const divHeight = divRef.current.clientHeight;
      setHeightPost(divHeight);
    }
  }, [divRef, posts]);

  const showMorePost = () => {
    if (
      posts?.result?.length < posts?.totalPost &&
      posts?.result?.length > 0
    ) {
      setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 1);
    }
  };

  useEffect(() => {
    if (
      heightPost > 0 &&
      scrollLength + 1000 > heightPost &&
      !isFetching
    ) {
      showMorePost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollLength, heightPost]);

  const getPost = async (page) => {
    setIsFetching(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/post/userPost/${id}`,
        {
          params: {
            page: page || visiblePosts || 1,
            pageSize: 10,
          },
        },
        {
          headers: {
            token: accessToken,
          },
        }
      );
      setPosts((prevPosts) => {
        if (visiblePosts === 1 || page) {
          return {
            result: res.data.result,
            totalPost: res.data.totalPost,
          };
        }
        return {
          result: [...prevPosts.result, ...res.data.result],
          totalPost: res.data.totalPost,
        };
      });
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // setIsFetching(false);
    }
  };

  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, visiblePosts]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollLength = window.scrollY;
      setScrollLength(currentScrollLength);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      {id === userDetails.user._id && (
        <div className="w-full mx-auto">
          <ContentPost getPost={getPost} />
        </div>
      )}
      {isFetching && <PostLoading />}
      <div className="flex flex-col gap-4 w-full" ref={divRef}>
        {!isFetching && posts && posts?.result?.length === 0 && (
          <div className="text-center font-semibold text-2xl">
            No posts found
          </div>
        )}
        {posts?.result?.map((post, index) => (
          <PostContainer key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default ProfileMainPost;
