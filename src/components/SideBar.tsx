import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { getUserProfile } from '../api/auth';
import type { User } from '../types';

const SideBar: React.FC = () => {
  const rawRole = localStorage.getItem('userRole') || '';
  const role = rawRole.toUpperCase();
  const isAdmin = role === 'ADMIN';
  const isUser = role === 'USER';
  const userIdRaw = localStorage.getItem('userId');
  const userId = userIdRaw ? parseInt(userIdRaw, 10) : null;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (userId && !isNaN(userId)) {
      getUserProfile(userId)
        .then(setUser)
        .catch(() => {});
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <aside className="hidden md:block md:w-64 bg-white border-r border-gray-200">
      <div className="h-full px-4 py-6 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <Link to="/profile" className="group">
              <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow ring-2 ring-white group-hover:scale-105 transition-transform">
                {(user?.businessName || user?.contactPerson || role || 'U').charAt(0).toUpperCase()}
              </div>
            </Link>
            <div className="min-w-0">
              {isUser && user?.businessName && (
                <div className="text-sm font-semibold bg-linear-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text truncate">{user.businessName}</div>
              )}
              {!user?.businessName && user?.contactPerson && (
                <div className="text-sm font-semibold text-gray-900 truncate">{user.contactPerson}</div>
              )}
              {user?.email && (
                <div className="text-xs text-gray-500"><span className="font-medium text-gray-700 truncate">{user.email}</span></div>
              )}
              {!user?.email && (
                <div className="text-xs text-gray-500"><span className="font-medium text-gray-700">N/A</span></div>
              )}
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          

          

          {isUser && (
            <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
              end
            >
              <span className="ml-2">Dashboard</span>
            </NavLink>

            <NavLink
              to="/stalls"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span className="ml-2">Stalls</span>
            </NavLink>

            <NavLink
              to="/myreservations"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span className="ml-2">My Reservations</span>
            </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                end
              >
                <span className="ml-2">Dashboard</span>
              </NavLink>

              <NavLink
                to="/stalls"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="ml-2">Stalls</span>
              </NavLink>

              <NavLink
                to="/admin/reservations"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="ml-2">Reservations</span>
              </NavLink>
              {/* <NavLink
                to="/users"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="ml-2">Users</span>
              </NavLink> */}

              {/* <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="ml-2">Reports</span>
              </NavLink> */}

             
            </>
          )}

          {/* <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="ml-2">Settings</span>
          </NavLink> */}

          <button type="button" onClick={handleLogout} className="w-full text-left flex items-center px-3 py-2 text-red-600 rounded hover:bg-red-50">
            <span className="ml-2">Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default SideBar;