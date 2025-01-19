import React, { useState, useEffect } from 'react';
import { Bell, X, DollarSign, CreditCard, AlertCircle, Check, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';

const NotificationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const fetchNotifications = async () => {
    try {

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.accessToken}`,
      };

      const response = await fetch(`/api/notifications/${userInfo.userId}`, 
        {
          method: 'GET',
          headers,
        }
      );
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
      setHasUnread(data.some(notification => !notification.read));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isOpen]);

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'transaction':
        return <DollarSign className="h-6 w-6 text-green-500" />;
      case 'account':
        return <CreditCard className="h-6 w-6 text-blue-500" />;
      case 'alert':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="relative">
      <button 
        className="relative flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-6 w-6 text-gray-500" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                {hasUnread && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                    New
                  </span>
                )}
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 px-6 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <span className="flex-shrink-0 ml-2">
                                <span className="h-2 w-2 bg-blue-500 rounded-full" />
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {getTimeAgo(notification.timestamp)}
                            </span>
                            {notification.read && (
                              <span className="flex items-center text-xs text-gray-500">
                                <Check className="h-3 w-3 mr-1" />
                                Read
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
              <button
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => {/* Mark all as read logic */}}
              >
                Mark all as read
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;