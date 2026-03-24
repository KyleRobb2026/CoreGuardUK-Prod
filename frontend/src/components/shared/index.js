import React from 'react';

export function StatusBadge({ status, label }) {
  const config = {
    valid:         { dot: 'bg-[#22C55E]', text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
    active:        { dot: 'bg-[#22C55E]', text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
    compliant:     { dot: 'bg-[#22C55E]', text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
    completed:     { dot: 'bg-[#22C55E]', text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
    expiring_soon: { dot: 'bg-[#F59E0B]', text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
    warning:       { dot: 'bg-[#F59E0B]', text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
    scheduled:     { dot: 'bg-[#3B82F6]', text: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10' },
    expired:       { dot: 'bg-[#EF4444]', text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
    critical:      { dot: 'bg-[#EF4444]', text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
    missed:        { dot: 'bg-[#EF4444]', text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
    inactive:      { dot: 'bg-[#676767]', text: 'text-[#676767]', bg: 'bg-[#676767]/10' },
    suspended:     { dot: 'bg-[#EF4444]', text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
    incident:      { dot: 'bg-[#EF4444]', text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
    patrol:        { dot: 'bg-[#22C55E]', text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
    note:          { dot: 'bg-[#3B82F6]', text: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10' },
  };

  const cfg = config[status] || { dot: 'bg-[#676767]', text: 'text-[#a1a0a0]', bg: 'bg-[#676767]/10' };
  const displayLabel = label || status?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === 'active' ? 'status-dot-live' : ''}`} />
      {displayLabel}
    </span>
  );
}

export function StatCard({ label, value, icon: Icon, trend, color = 'default' }) {
  const colorMap = {
    default: 'text-white',
    success: 'text-[#22C55E]',
    warning: 'text-[#F59E0B]',
    critical: 'text-[#EF4444]',
    info: 'text-[#3B82F6]',
    yellow: 'text-[#f7b91c]',
  };

  return (
    <div className="bg-[#171717] border border-[#2e2e2e] rounded-lg p-4 flex flex-col gap-2 hover:border-[#3d3d3d] transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#676767] font-semibold">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#2d2d2d] flex items-center justify-center">
            <Icon size={15} className="text-[#a1a0a0]" />
          </div>
        )}
      </div>
      <div className={`text-3xl font-bold ${colorMap[color]}`}>{value}</div>
      {trend && <div className="text-xs text-[#676767]">{trend}</div>}
    </div>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#171717] border border-[#2e2e2e] rounded-lg ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 border-b border-[#2e2e2e] flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children }) {
  return <h3 className="text-sm font-bold text-white">{children}</h3>;
}

export function Button({ children, onClick, variant = 'default', size = 'md', disabled = false, className = '', type = 'button', ...props }) {
  const variants = {
    default:     'bg-[#f7b91c] hover:bg-[#e0a518] text-[#1e1e1e] font-bold',
    destructive: 'bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold',
    outline:     'border border-[#2e2e2e] bg-transparent hover:bg-[#2d2d2d] text-[#a1a0a0] hover:text-white font-semibold',
    ghost:       'hover:bg-[#2d2d2d] text-[#a1a0a0] hover:text-white font-semibold',
    success:     'bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold',
    warning:     'bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold',
    secondary:   'bg-[#2d2d2d] hover:bg-[#353535] text-white font-semibold',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-2.5 text-sm rounded-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-[#a1a0a0] font-semibold">{label}</label>}
      <input
        className={`bg-[#1e1e1e] border border-[#2e2e2e] focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]/30 rounded-lg h-10 px-3 text-sm text-white placeholder:text-[#676767] outline-none transition-all duration-150 ${error ? 'border-[#EF4444]' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-[#EF4444]">{error}</span>}
    </div>
  );
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-[#a1a0a0] font-semibold">{label}</label>}
      <select
        className={`bg-[#1e1e1e] border border-[#2e2e2e] focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]/30 rounded-lg h-10 px-3 text-sm text-white outline-none transition-all duration-150 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-[#EF4444]">{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-[#a1a0a0] font-semibold">{label}</label>}
      <textarea
        className={`bg-[#1e1e1e] border border-[#2e2e2e] focus:border-[#f7b91c] focus:ring-1 focus:ring-[#f7b91c]/30 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#676767] outline-none transition-all duration-150 resize-none ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-[#EF4444]">{error}</span>}
    </div>
  );
}

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default:  'bg-[#2d2d2d] text-[#a1a0a0]',
    success:  'bg-[#22C55E]/10 text-[#22C55E]',
    warning:  'bg-[#F59E0B]/10 text-[#F59E0B]',
    critical: 'bg-[#EF4444]/10 text-[#EF4444]',
    info:     'bg-[#3B82F6]/10 text-[#3B82F6]',
    yellow:   'bg-[#f7b91c]/10 text-[#f7b91c]',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className={`bg-[#171717] border border-[#2e2e2e] rounded-xl w-full ${sizes[size]} shadow-2xl animate-fade-in`}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#2e2e2e] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-[#676767] hover:text-white transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#2d2d2d]">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-xl bg-[#2d2d2d] flex items-center justify-center mb-4">
          <Icon size={24} className="text-[#676767]" />
        </div>
      )}
      <p className="text-sm text-[#676767]">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-7 h-7 border-2 border-[#2e2e2e] border-t-[#f7b91c] rounded-full animate-spin" />
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-base font-bold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-[#676767] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
