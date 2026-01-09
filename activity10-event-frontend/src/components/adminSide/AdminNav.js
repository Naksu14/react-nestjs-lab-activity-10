import React, { memo, useCallback, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import profileLogo from '../assets/profileicon.png'
import { FiSearch, FiSun, FiMoon } from 'react-icons/fi'
import { FaFilm, FaUsers } from 'react-icons/fa'

function Nav({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search Movies...'
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAdmin } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const [showDropdown, setShowDropdown] = useState(false)
  const isAdminPage = location.pathname.startsWith('/admin')
  const isMoviesPage = location.pathname.includes('/admin/movies')
  const isUsersPage = location.pathname.includes('/admin/users')

  const handleLogout = useCallback(() => {
    logout()
    navigate('/login')
    setShowDropdown(false)
  }, [logout, navigate])

  const handleLogin = useCallback(() => {
    navigate('/login')
  }, [navigate])

  const [internalSearch, setInternalSearch] = useState('')
  const currentSearch = searchValue !== undefined ? searchValue : internalSearch

  const handleSearchChange = (e) => {
    const value = e.target.value
    setInternalSearch(value)
    if (onSearchChange) onSearchChange(value)
  }

  return (
    <div className="flex items-center justify-between bg-[var(--bg-card)] border-b border-[var(--border-color)] px-4 py-2">
      
      {/* LOGO (Link is faster than navigate) */}
      <Link
        to={isAdmin ? "/admin/movies" : "/movies"}
        className="whitespace-nowrap text-base font-semibold text-[var(--text-primary)] hover:text-[var(--accent-color)]"
      >
        Movies Website
      </Link>

      <div className={`flex items-center ${isAdminPage ? 'justify-end' : 'justify-between'} ${isAdminPage ? 'w-full' : 'w-[85%]'} gap-4`}>
        
        {/* SEARCH (hidden on admin pages) */}
        {!isAdminPage && (
          <div className="relative flex items-center">
            <FiSearch className="absolute left-[25px] text-[var(--text-muted)] text-[16px]" />
            <input
              className="ml-5 pr-[10px] pl-[30px] h-[35px] text-sm rounded-[5px] border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] outline-none w-[300px] placeholder:text-[var(--text-muted)]"
              placeholder={searchPlaceholder}
              value={currentSearch}
              onChange={handleSearchChange}
            />
          </div>
        )}

        <div className="flex items-center mr-[30px] gap-4">
          
          {/* ADMIN BUTTONS */}
          {isAdmin && (
            <div className="flex gap-2">
              <Link
                to="/admin/movies"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isMoviesPage
                    ? 'bg-[var(--accent-color)] text-white shadow-md'
                    : 'text-[var(--accent-color)] bg-[var(--bg-secondary)] hover:bg-[var(--border-color)]'
                }`}
              >
                <FaFilm size={16} />
                Movies
              </Link>
              <Link
                to="/admin/users"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isUsersPage
                    ? 'bg-[var(--accent-color)] text-white shadow-md'
                    : 'text-[var(--accent-color)] bg-[var(--bg-secondary)] hover:bg-[var(--border-color)]'
                }`}
              >
                <FaUsers size={16} />
                Users
              </Link>
            </div>
          )}

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-primary)]"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* USER */}
          {user ? (
            <div className="relative">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img className="w-[20px] mr-[10px]" src={profileLogo} alt="profile-logo" />
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {user.username || user.email}
                </h3>
              </div>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] rounded-md shadow-lg border border-[var(--border-color)] z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border-t border-[var(--border-color)]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className="flex items-center cursor-pointer"
              onClick={handleLogin}
            >
              <img className="w-[20px] mr-[10px]" src={profileLogo} alt="profile-logo" />
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Login</h3>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default memo(Nav)
