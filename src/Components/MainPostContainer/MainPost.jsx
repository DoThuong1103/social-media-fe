import React, { createRef, useEffect, useState } from "react";
import axios from "axios";
import ContentPost from "../ContentPostContainer/ContentPost";
import PostContainer from "../PostContainer/PostContainer";
import { useSelector } from "react-redux";
import PostLoading from "../CommonComponents/PostLoading/PostLoading";

const MainPost = () => {
  const [posts, setPosts] = useState({
    result: [],
    totalPost: 0,
  });
  const [isFetching, setIsFetching] = useState(false);
  const userDetails = useSelector((state) => state.user);
  const [scrollLength, setScrollLength] = useState(0);
  const [heightPost, setHeightPost] = useState(0);
  const [visiblePosts, setVisiblePosts] = useState(1);
  const divRef = createRef();

  const showMorePosts = () => {
    if (posts?.result?.length < posts?.totalPost) {
      setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 1);
    }
  };

  useEffect(() => {
    if (divRef?.current && posts) {
      const divHeight = divRef.current.clientHeight;
      setHeightPost(divHeight);
    }
  }, [divRef, posts]);

  useEffect(() => {
    if (
      heightPost > 0 &&
      scrollLength + 1000 > heightPost &&
      !isFetching
    ) {
      showMorePosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollLength, heightPost]);
  const getPost = async () => {
    setIsFetching(true);
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/post/allPost`,
        {
          params: {
            page: visiblePosts || 1,
            pageSize: 10,
          },
          headers: {
            token: userDetails.accessToken,
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
  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visiblePosts]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollLength = window.scrollY;
      setScrollLength(currentScrollLength);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-8 md:flex-1 w-full max-w-[650px] mx-auto">
      <ContentPost getPost={getPost} />
      <div className="flex flex-col gap-4 w-full pt-2" ref={divRef}>
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
  );
};

export default MainPost;
