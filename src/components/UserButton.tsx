import { useState } from 'react';
import { useConvexAuth } from '../hooks/useConvexAuth';
import { logout } from '../lib/apiAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export function UserButton() {
  const { user } = useConvexAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/signin', { replace: true });
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || 
    user?.first_name?.charAt(0).toUpperCase() || 
    user?.last_name?.charAt(0).toUpperCase() || 
    'U';
  const userName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.first_name || user?.last_name || user?.email?.split('@')[0] || 'Usuario';

  const menuItems = [
    {
      name: 'Sign Out',
      link: '#',
      onClick: handleSignOut,
      icon: <LogOut className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-main hover:bg-mainAccent text-text transition-colors"
        aria-label="User menu"
      >
        {user?.profile_image_url ? (
          <img
            src={user.profile_image_url}
            alt={userName}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <span className="text-sm font-semibold">{userInitial}</span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <p className="font-medium">{userName}</p>
              {user?.company?.name && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.company.name}</p>
              )}
              {user?.email && !user?.company?.name && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

