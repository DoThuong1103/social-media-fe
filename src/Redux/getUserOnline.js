import { io } from 'socket.io-client';
import { getOnline } from './userReducer';

export const getUserOnline = (userId, dispatch) => {
  const socket = io(process.env.REACT_APP_BACK_END_IO_URL);

  socket.emit("addUser", userId);

  // Listen for online and offline users from the server
  socket.on("onlineUsers", (users) => {
    // Dispatch the action to update online users in the Redux store
    dispatch(getOnline(users));
  });

  // You can add more socket listeners for other events if needed

  return socket;
};
