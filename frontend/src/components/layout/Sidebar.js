import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Users, MapPin, Calendar, FileText,
  PhoneCall, Shield, ClipboardList, Settings, LogOut,
  ChevronLeft, ChevronRight, BookOpen, Menu, X
} from 'lucide-react';

const adminNavItems = [
  { path: '/dashboard', label: 'Command Centre', icon: LayoutDashboard },
  { path: '/personnel', label: 'Personnel', icon: Users },
  { path: '/sites', label: 'Sites', icon: MapPin },
  { path: '/rota', label: 'Rota Builder', icon: Calendar },
  { path: '/logs', label: 'Daily Logs', icon: BookOpen },
  { path: '/forms', label: 'Forms', icon: FileText },
  { path: '/check-calls', label: 'Check Calls', icon: PhoneCall },
  { path: '/compliance', label: 'Compliance', icon: Shield },
  { path: '/audit', label: 'Audit Log', icon: ClipboardList },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const officerNavItems = [
  { path: '/officer/dashboard', label: 'My Shifts', icon: LayoutDashboard },
  { path: '/officer/logs', label: 'Log Entry', icon: BookOpen },
  { path: '/officer/check-calls', label: 'Check Call', icon: PhoneCall },
  { path: '/officer/forms', label: 'Forms', icon: FileText },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout, isOfficer } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = isOfficer ? officerNavItems : adminNavItems;

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo area */}
      <div className={`sidebar-separator-top px-4 py-4 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-[#f7b91c] flex items-center justify-center flex-shrink-0">
          <Shield size={16} className="text-[#1e1e1e]" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-sm leading-tight">CoreGuard</div>
            <div className="text-[#676767] text-[10px] font-mono">SMS Platform</div>
          </div>
        )}
      </div>

      {/* User card (sidebar-card-top style) */}
      {!collapsed && user && (
        <div className="mx-3 my-2 rounded-lg px-3 py-2.5 sidebar-separator-top" style={{ backgroundColor: '#353535' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f7b91c] flex items-center justify-center text-xs font-bold text-[#1e1e1e] flex-shrink-0">
              {(user.first_name?.[0] || '?').toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-bold truncate">
                {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.email}
              </div>
              <div className="text-[#a1a0a0] text-[10px]">
                {isOfficer ? 'Field Officer' : (user.role?.charAt(0).toUpperCase() + user.role?.slice(1)) || 'Admin'}
              </div>
            </div>
          </div>
        </div>
      )}

      {collapsed && user && (
        <div className="flex justify-center py-2">
          <div className="w-8 h-8 rounded-full bg-[#f7b91c] flex items-center justify-center text-xs font-bold text-[#1e1e1e]">
            {(user.first_name?.[0] || '?').toUpperCase()}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : ''}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={({ isActive }) =>
                `sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150
                ${isActive ? 'sidebar-item-selected' : 'text-[#676767]'}
                ${collapsed ? 'justify-center px-2' : ''}`
              }
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${collapsed ? '' : ''}`}
                style={{ background: '#2d2d2d' }}>
                <Icon size={14} />
              </div>
              {!collapsed && <span className="font-semibold">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="sidebar-separator-bottom p-2 space-y-1">
        <button
          onClick={handleLogout}
          className={`sidebar-item flex items-center gap-3 w-full px-3 py-2 text-sm text-[#676767] hover:text-[#EF4444] rounded-lg transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
          data-testid="logout-btn"
          title="Logout"
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#2d2d2d' }}>
            <LogOut size={14} />
          </div>
          {!collapsed && <span className="font-semibold">Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden md:flex sidebar-item items-center gap-3 w-full px-3 py-2 text-sm text-[#676767] hover:text-[#a1a0a0] rounded-lg transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#2d2d2d' }}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </div>
          {!collapsed && <span className="font-semibold">Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 rounded-lg p-2 border border-[#2e2e2e]"
        style={{ background: '#171717' }}
        onClick={() => setMobileOpen(!mobileOpen)}
        data-testid="mobile-menu-toggle"
      >
        {mobileOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-[#676767]" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/70 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-60 z-40 transition-transform duration-200 border-r border-[#2e2e2e] ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#1e1e1e' }}>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden md:flex flex-col h-screen sticky top-0 transition-all duration-200 flex-shrink-0 border-r border-[#2e2e2e] ${collapsed ? 'w-14' : 'w-56'}`}
        style={{ background: '#1e1e1e' }}
      >
        <SidebarContent />
      </div>
    </>
  );
}
