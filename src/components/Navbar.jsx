import React from 'react';
import { Menu } from 'lucide-react';
import NotificationPopup from './NotificationPopUp';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../slices/userSlices/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          className="lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-4">
          <NotificationPopup />
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">{userInfo.username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
