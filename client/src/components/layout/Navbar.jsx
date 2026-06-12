import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Heart,
  Menu,
  X,
  Sun,
  Moon,
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = isAuthenticated
    ? [
        { to: '/', label: 'Home' },
        { to: '/dashboard', label: 'Dashboard' },
      ]
    : [
        { to: '/', label: 'Home' },
      ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-500/10'
        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-dark-card'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-shadow">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              MedAI Guardian
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-dark-card transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth buttons / User menu */}
            {isAuthenticated ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-card transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass-card p-2 animate-slide-down shadow-xl">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-dark-border mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-dark-muted truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-dark-card transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-dark-card transition-colors"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm px-4 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-72 glass-card rounded-none z-50 animate-slide-down md:hidden overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-lg text-primary-600 dark:text-primary-400">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card cursor-pointer">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {isAuthenticated && (
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-dark-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-dark-muted">{user?.email}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={linkClass}
                  >
                    {link.label}
                  </NavLink>
                ))}
                {isAuthenticated && (
                  <>
                    <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className={linkClass}>
                      <span className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Dashboard</span>
                    </NavLink>
                    <NavLink to="/settings" onClick={() => setMobileOpen(false)} className={linkClass}>
                      <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Settings</span>
                    </NavLink>
                  </>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-dark-border">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-danger-50 text-danger-600 rounded-xl font-semibold text-sm hover:bg-danger-100 transition-colors cursor-pointer dark:bg-danger-500/10"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full text-center text-sm py-2.5">
                      Sign In
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center text-sm py-2.5">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
