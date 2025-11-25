import React from 'react';
import { NavLink } from 'react-router-dom';

const SideBar: React.FC = () => {
  const rawRole = localStorage.getItem('userRole') || '';
  const role = rawRole.toUpperCase();
  const isAdmin = role === 'ADMIN';
  const isUser = role === 'USER';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <aside className="hidden md:block md:w-64 bg-white border-r border-gray-200">
      <div className="h-full px-4 py-6 overflow-y-auto">
        <div className="mb-6">
          <div className="text-sm font-semibold text-gray-700">Navigation</div>
          <div className="mt-2 text-xs text-gray-500">Role: <span className="font-medium text-gray-700">{role || 'GUEST'}</span></div>
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
              <NavLink
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
              </NavLink>

              <NavLink
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
              </NavLink>

             
            </>
          )}

          <NavLink
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
          </NavLink>

          <button type="button" onClick={handleLogout} className="w-full text-left flex items-center px-3 py-2 text-red-600 rounded hover:bg-red-50">
            <span className="ml-2">Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default SideBar;