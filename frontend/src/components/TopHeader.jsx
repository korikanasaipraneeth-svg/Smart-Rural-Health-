import { safeParseUser } from '../utils/authUtils';
import React, { useState, useEffect } from 'react';
import { Search, Bell, MessageSquare, Moon, Sun, Globe, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TopHeader = () => {
  const { t, i18n } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
  };

  const user = safeParseUser() || { name: 'Admin User' };

  return (
    <header className="h-[70px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
      {/* Left side: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
          SRH
        </div>
        <span className="font-bold text-xl text-gray-900 hidden sm:block">{t('Smart Rural Health')}</span>
      </div>

      {/* Middle: Search */}
      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder={t('Search')} 
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-10 pr-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
          >
            <Globe size={20} />
          </button>
          
          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <button onClick={() => changeLanguage('en')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">English</button>
              <button onClick={() => changeLanguage('hi')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">हिंदी</button>
              <button onClick={() => changeLanguage('te')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">తెలుగు</button>
            </div>
          )}
        </div>
        <button onClick={toggleDarkMode} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 rounded-full transition-colors hidden sm:block">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
          <MessageSquare size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>

        <Link to="/dashboard/admin/profile" className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-full pr-4 transition-colors">
          <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold border border-indigo-200 uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-semibold text-gray-700 leading-tight">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Administrator'}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default TopHeader;
