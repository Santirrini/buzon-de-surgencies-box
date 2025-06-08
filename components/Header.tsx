
import React from 'react';
import ShieldCheckIcon from './icons/ShieldCheckIcon';

interface HeaderProps {
  isAdminLoggedIn: boolean;
  onAdminLoginClick: () => void;
  onAdminLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdminLoggedIn, onAdminLoginClick, onAdminLogoutClick }) => {
  return (
    <header className="bg-slate-800 text-white p-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Public Suggestion Box</h1>
        {isAdminLoggedIn ? (
          <button
            onClick={onAdminLogoutClick}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
          >
            <ShieldCheckIcon className="mr-2" />
            Admin Logout
          </button>
        ) : (
          <button
            onClick={onAdminLoginClick}
            className="flex items-center bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
          >
             <ShieldCheckIcon className="mr-2" />
            Admin Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
