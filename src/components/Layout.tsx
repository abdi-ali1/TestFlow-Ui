import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Book, Files, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 glass-card border-r border-dark-300/50">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 text-transparent bg-clip-text">
              TestFlow
            </h1>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="px-3 py-2 space-y-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-gray-400 hover:bg-dark-400/50 hover:text-gray-200'
                  }`
                }
              >
                <Files className="h-5 w-5" />
                <span>Test Builder</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/library"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-gray-400 hover:bg-dark-400/50 hover:text-gray-200'
                  }`
                }
              >
                <Book className="h-5 w-5" />
                <span>Test Library</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-gray-400 hover:bg-dark-400/50 hover:text-gray-200'
                  }`
                }
              >
                <Activity className="h-5 w-5" />
                <span>Reports</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-dark-300/50">
          <button className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-dark-300/50 md:hidden">
        <div className="flex justify-around">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center pt-2 pb-1 ${
                isActive ? 'text-primary-400' : 'text-gray-400'
              }`
            }
          >
            <Files className="h-6 w-6" />
            <span className="text-xs mt-1">Builder</span>
          </NavLink>
          <NavLink
            to="/library"
            className={({ isActive }) =>
              `flex flex-col items-center pt-2 pb-1 ${
                isActive ? 'text-primary-400' : 'text-gray-400'
              }`
            }
          >
            <Book className="h-6 w-6" />
            <span className="text-xs mt-1">Library</span>
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex flex-col items-center pt-2 pb-1 ${
                isActive ? 'text-primary-400' : 'text-gray-400'
              }`
            }
          >
            <Activity className="h-6 w-6" />
            <span className="text-xs mt-1">Reports</span>
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-6 md:p-8 pb-20 md:pb-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;