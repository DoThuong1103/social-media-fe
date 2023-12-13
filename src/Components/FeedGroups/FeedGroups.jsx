import React, { useEffect, useRef, useState } from "react";
import PostContainer from "../PostContainer/PostContainer";
import axios from "axios";
import { useSelector } from "react-redux";
import PostLoading from "../CommonComponents/PostLoading/PostLoading";

const FeedGroups = () => {
  const [posts, setPosts] = useState({
    result: [],
    totalPost: 0,
  });
  const [isFetching, setIsFetching] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(1);

  const { accessToken } = useSelector((state) => state.user);

  const divRef = useRef();
  const getPost = async () => {
    setIsFetching(true);
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/post/allPostGroups`,
        {
          params: {
            page: visiblePosts || 1,
            pageSize: 5,
          },
          headers: {
            token: accessToken,
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

  const showMorePosts = () => {
    if (
      posts?.result?.length < posts?.totalPost &&
      posts?.result?.length > 0
    ) {
      setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const { current } = divRef;
      if (current) {
        // Kiểm tra xem đã scroll đến cuối cùng hay chưa
        if (
          current.scrollTop + current.clientHeight + 500 >=
            current.scrollHeight &&
          isFetching === false
        ) {
          // Gọi lại hàm getPost khi scroll đến cuối cùng
          // getPost();
          showMorePosts();
        }
      }
    };

    // Gắn sự kiện scroll cho divRef.current
    const currentDiv = divRef.current;
    if (currentDiv) {
      currentDiv.addEventListener("scroll", handleScroll);
    }

    // Loại bỏ sự kiện khi component unmount
    return () => {
      if (currentDiv) {
        currentDiv.removeEventListener("scroll", handleScroll);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divRef, posts]);
  console.log();
  return posts.totalPost === 0 && !isFetching ? (
    <div className="w-full flex-1 flex m-auto items-center justify-center ">
      <span className="text-2xl text-[#aaa] opacity-80">
        You haven't joined any group yet. Join a group to see more
        posts.
      </span>
    </div>
  ) : (
    <div
      className="w-full flex-1 flex flex-col gap-4 overflow-hidden overflow-y-scroll max-h-screen -mr-2 overflow-x-hidden py-8 "
      ref={divRef}
    >
      <div className="max-w-[650px] mx-auto flex flex-col gap-2 px-2 sm:px-10 w-full">
        <div className="flex flex-col gap-4 w-full pt-2" id="test">
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
    </div>
  );
};

export default FeedGroups;
