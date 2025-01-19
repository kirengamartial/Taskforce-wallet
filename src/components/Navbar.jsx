import React from 'react';
import { Menu } from 'lucide-react';
import NotificationPopup from './NotificationPopUp';
import { useSelector } from 'react-redux';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {

  const {userInfo} = useSelector(state => state.auth)


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
        
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
