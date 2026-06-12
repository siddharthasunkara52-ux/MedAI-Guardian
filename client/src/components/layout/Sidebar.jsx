import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  FileText,
  ScanEye,
  MessageSquare,
  Settings,
  Menu,
  X,
  Heart,
} from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/symptom-checker', label: 'Symptom Checker', icon: Stethoscope },
  { to: '/report-analyzer', label: 'Report Analyzer', icon: FileText },
  { to: '/image-analyzer', label: 'Image Analyzer', icon: ScanEye },
  { to: '/chat-history', label: 'Chat History', icon: MessageSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
      isActive
        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25'
        : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-dark-card dark:hover:text-primary-400'
    }`;

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo for mobile */}
      <div className="flex items-center gap-2 mb-6 md:hidden">
        <div className="p-1.5 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
          <Heart className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="font-bold text-primary-600 dark:text-primary-400">MedAI Guardian</span>
      </div>

      <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-muted">
        Navigation
      </p>

      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={linkClass}
          >
            <Icon className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-dark-border">
        <div className="px-4 py-3 bg-primary-50 rounded-xl dark:bg-primary-500/10">
          <p className="text-xs text-primary-700 dark:text-primary-300 leading-relaxed">
            💡 <strong>Tip:</strong> Always verify AI suggestions with a healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen((p) => !p)}
        className="fixed bottom-4 left-4 z-50 md:hidden p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-lg shadow-primary-500/25 cursor-pointer"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-4rem)] glass-card rounded-none border-t-0 border-l-0 border-b-0 p-4">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-full w-72 glass-card rounded-none z-50 p-5 animate-slide-down md:hidden overflow-y-auto">
            {SidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
