import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

const MainPost = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [friends, setFriends] = useState(null);

  let params = useParams();
  const { org, "*": splat } = params;
  const userDetails = useSelector((state) => state.user);
  const accessToken = userDetails.user.accessToken;

  const getFriend = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(
        `https://social-media-be-mcqg.onrender.com/api/user/${
          splat ? splat : "allFriend"
        }`,
        {
          headers: {
            token: accessToken,
          },
        }
      );
      setFriends(res.data);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFriend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splat]);
  console.log(friends);
  return <div></div>;
};

export default MainPost;
