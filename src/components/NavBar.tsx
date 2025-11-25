import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../api/auth';
import type { User } from '../types';

const NavBar: React.FC = () => {
  const userIdRaw = localStorage.getItem('userId');
  const userId = userIdRaw ? parseInt(userIdRaw, 10) : null;
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (userId && !isNaN(userId)) {
      getUserProfile(userId).then(setUser).catch(() => {});
    }
  }, [userId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const displayName = user?.businessName || user?.contactPerson || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <nav className="bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Bookfair Reservation
            </Link>
            <span className="hidden md:inline text-xs text-gray-500">Manage stalls & reservations</span>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center space-x-2 focus:outline-none group"
              >
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold shadow ring-2 ring-white">
                  {avatarLetter}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 max-w-[120px] truncate">{displayName}</span>
                  <span className="text-xs text-gray-500">{user?.role || localStorage.getItem('userRole') || 'GUEST'}</span>
                </div>
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-gray-200 shadow-lg py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
