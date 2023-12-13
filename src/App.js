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
import { getUserOnline } from './Redux/getUserOnline';
import { ToastContainer } from 'react-toastify';
import SearchFriend from './Pages/FriendPage/FriendPage';
import { getAllGroup, getAllUser } from './Redux/apiCall';
import ScrollToTop from './Components/CommonComponents/ScrollToTop';
import VideoPage from './Pages/VideoPage/VideoPage';
import GroupsPage from './Pages/GroupsPage/GroupsPage';

function App() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user);
  const [isOpenDialog, setIsOpenDialog] = useState(true)
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
      getAllGroup(dispatch, accessToken)
    }
  }, [accessToken, dispatch])

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, []);
  return (
    <BrowserRouter >
      {/* <Navbar /> */}
      {isOpenDialog && accessToken && (
        <div className='fixed w-screen h-screen z-[8888] flex justify-center items-center' >
          <div className='absolute w-screen h-screen bg-slate-500 opacity-10' onClick={() => setIsOpenDialog(false)}></div>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-96 h-52 bg-white shadow-lg border border-[#dbdbdb] flex flex-col items-center justify-center gap-8 rounded z-[9999]'>
            <p
              className="text-lg md:text-xl  lg:text-3xl text-center font-bold"
            > Welcome to
              Soc<span className="text-blue-500">ial</span>
            </p>
            <button className="bg-[#0861F2] px-3 py-1 rounded-md hover:opacity-80 text-white transition-all" onClick={() => setIsOpenDialog(false)}>Oki</button>
          </div>
        </div>
      )}
      <ScrollToTop />
      <Routes>
        <Route path="">
          <Route path="/" element={userDetails?.verified === true ? <Home /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/profile/:id" element={userDetails?.verified === true ? <Profile /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/post/:id" element={userDetails?.verified === true ? <PostSearch /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/chat" element={userDetails?.verified === true ? <Chat /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/friends/*" element={userDetails?.verified === true ? <SearchFriend /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/videos" element={userDetails?.verified === true ? <VideoPage /> : <Navigate to={"/login"} replace={true} />}></Route>
          <Route path="/groups/*" element={userDetails?.verified === true ? <GroupsPage /> : <Navigate to={"/login"} replace={true} />}></Route>
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
