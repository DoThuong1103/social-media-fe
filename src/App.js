import './App.css';
import Home from './Pages/Home/Home';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Profile from './Pages/Profile/Profile';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import { useDispatch, useSelector } from 'react-redux';
import Verifyemail from './Components/VerifyEmail/Verifyemail';
import Forgotpassword from './Components/Forgotpassword/Forgotpassword';
import Resetpassword from './Components/Resetpassword/Resetpassword';
import PostSearch from './Pages/PostSearch/PostSearch';
import Chat from './Pages/Chat/Chat';
import { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import { getUserOnline } from './Redux/getUserOnline';
import { ToastContainer } from 'react-toastify';
import SearchFriend from './Pages/FriendPage/FriendPage';

function App() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user);
  let user = userDetails?.user;
  const socket = useRef();
  const id = user?.other?._id;
  console.log(id);

  useEffect(() => {
    socket.current = getUserOnline(id, dispatch);

    // Cleanup when the component unmounts
    return () => {
      socket.current.disconnect();
    };
  }, [dispatch, id]);
  return (
    <BrowserRouter >
      {/* <Navbar /> */}
      <Routes>
        <Route path="">
          <Route path="/" element={user?.other?.verifed === true ? <Home /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/profile/:id" element={user?.other?.verifed === true ? <Profile /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/post/:id" element={user?.other?.verifed === true ? <PostSearch /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/chat" element={user?.other?.verifed === true ? <Chat /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/friends/*" element={user?.other?.verifed === true ? <SearchFriend /> : <Navigate to={"/login"} replace={true} />}></Route>
        </Route>
        <Route path="/login" element={user?.other?.verifed === true ? <Navigate to={"/"} replace={true} /> : <Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/verify/email" element={user?.Status === 'Pending' ? <Verifyemail /> : user?.other?.verifed === true ? <Navigate to={"/"} replace={true} /> : <Login />}></Route>
        <Route path="/forgot/password" element={<Forgotpassword />}></Route>
        <Route path="/reset/password" element={<Resetpassword />}></Route>
      </Routes>
      <ToastContainer />

    </BrowserRouter>
  );
}

export default App;
