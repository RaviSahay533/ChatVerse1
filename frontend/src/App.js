import Signup from './components/Signup';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { setOnlineUsers } from './redux/userSlice';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/login",
    element: <Login />
  },
]);

function App() {
  const authUser = useSelector(store => store.user.authUser);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (authUser && !socketRef.current) {
      const socketio = io(`http://localhost:8080`, {
        query: {
          userId: authUser._id
        }
      });

      socketRef.current = socketio;

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        if (socketRef.current) {
          socketio.off('getOnlineUsers');
          socketio.close();
          socketRef.current = null;
        }
      };
    }
  }, [authUser, dispatch]);

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
