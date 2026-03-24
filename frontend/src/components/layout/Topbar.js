import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Topbar({ title, alerts = 0 }) {
  const { user, isOfficer } = useAuth();

  return (
    <div className="sticky top-0 z-30 border-b border-[#2e2e2e] px-6 py-3 flex items-center justify-between"
      style={{ background: 'rgba(30,30,30,0.9)', backdropFilter: 'blur(12px)' }}>
      <div>
        <h1 className="text-base font-bold text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {!isOfficer && (
          <div className="hidden md:flex items-center gap-2 rounded-lg px-3 py-1.5 border border-[#2e2e2e] w-44"
            style={{ background: '#171717' }}>
            <Search size={13} className="text-[#676767]" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-xs text-white placeholder:text-[#676767] outline-none w-full"
              data-testid="topbar-search"
            />
          </div>
        )}
        {alerts > 0 && (
          <div className="relative">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#2e2e2e] cursor-pointer hover:border-[#EF4444] transition-colors"
              style={{ background: '#171717' }}>
              <Bell size={14} className="text-[#676767]" />
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] rounded-full text-white text-[9px] font-bold flex items-center justify-center">
              {alerts > 9 ? '9+' : alerts}
            </span>
          </div>
        )}
        <div className="w-8 h-8 rounded-full bg-[#f7b91c] flex items-center justify-center text-xs font-bold text-[#1e1e1e]">
          {(user?.first_name?.[0] || user?.email?.[0] || '?').toUpperCase()}
        </div>
      </div>
    </div>
  );
}
