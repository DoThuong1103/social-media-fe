import React, { createRef, useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import LeftBar from "../../Components/LeftSideContainer/LeftBar";
import RightBar from "../../Components/RightSideContainer/RightBar";
import PostContainer from "../../Components/PostContainer/PostContainer";
import axios from "axios";
import { useSelector } from "react-redux";
import PostLoading from "../../Components/CommonComponents/PostLoading/PostLoading";

const VideoPage = () => {
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

  const getPost = async () => {
    setIsFetching(true);
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/post/videos`,
        {
          params: {
            page: visiblePosts || 1,
            pageSize: 4,
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
            result: res?.data?.result,
            totalPost: res?.data?.totalPost,
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

  // useEffect(() => {
  //   window.location.reload();
  // }, []);
  return (
    <div className="bg-slate-200 min-h-screen scroll-smooth">
      <Navbar />
      <div className="flex md:justify-between mx-auto px-2 md:px-4 lg:px-0 pt-20 w-full lg:w-[92%] md:gap-4">
        <div className="hidden md:block sticky top-20">
          <LeftBar />
        </div>
        <div className="flex flex-col gap-4 pb-8 md:flex-1 w-full max-w-[650px] mx-auto">
          <div
            className="flex flex-col gap-4 w-full pt-2"
            ref={divRef}
          >
            {posts?.result?.map((post, index) => {
              return (
                <PostContainer
                  key={post._id}
                  post={post}
                  getPost={getPost}
                  index={index}
                />
              );
            })}
          </div>
          {isFetching && <PostLoading />}
        </div>
        <div className="hidden md:block sticky top-20 md:w-1/5">
          <RightBar />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
