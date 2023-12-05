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
import { useEffect, useRef } from 'react';
import { getUserOnline } from './Redux/getUserOnline';
import { ToastContainer } from 'react-toastify';
import SearchFriend from './Pages/FriendPage/FriendPage';
import { getAllUser } from './Redux/apiCall';
import ScrollToTop from './Components/CommonComponents/ScrollToTop';

function App() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user);
  let user = userDetails?.user;
  const accessToken = userDetails?.accessToken;
  const socket = useRef();
  const id = user?._id;


  useEffect(() => {
    socket.current = getUserOnline(id, dispatch);

    // Cleanup when the component unmounts
    return () => {
      socket.current.disconnect();
    };
  }, [dispatch, id]);

  // Get all user 
  useEffect(() => {
    if (accessToken) {
      getAllUser(dispatch, accessToken)
    }
  }, [accessToken, dispatch])

  return (
    <BrowserRouter >
      {/* <Navbar /> */}
      <ScrollToTop />
      <Routes>
        <Route path="">
          <Route path="/" element={userDetails?.verified === true ? <Home /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/profile/:id" element={userDetails?.verified === true ? <Profile /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/post/:id" element={userDetails?.verified === true ? <PostSearch /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/chat" element={userDetails?.verified === true ? <Chat /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/friends/*" element={userDetails?.verified === true ? <SearchFriend /> : <Navigate to={"/login"} replace={true} />}></Route>
        </Route>
        <Route path="/login" element={userDetails?.verified === true ? <Navigate to={"/"} replace={true} /> : <Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/verify/email" element={userDetails?.Status === 'Pending' ? <Verifyemail /> : userDetails?.verified === true ? <Navigate to={"/"} replace={true} /> : <Login />}></Route>
        <Route path="/forgot/password" element={<Forgotpassword />}></Route>
        <Route path="/reset/password" element={<Resetpassword />}></Route>
      </Routes>
      <ToastContainer />

    </BrowserRouter>
  );
}

export default App;
