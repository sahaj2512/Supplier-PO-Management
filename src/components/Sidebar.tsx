import React from 'react';
import { ViewState, PageView } from '../types';
import { LayoutDashboard, FileText, BarChart2, Bell } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const NavItem = ({ id, icon: Icon, label, badge, badgeVariant = 'amber' }: { id: PageView, icon: React.ElementType, label: string, badge?: number, badgeVariant?: 'red' | 'amber' }) => {
    const isActive = currentView.page === id;
    
    return (
      <button
        onClick={() => onNavigate({ page: id })}
        className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
          isActive 
            ? 'bg-[var(--color-primary)] text-white' 
            : 'text-white/60 hover:bg-[var(--color-sidebar-hover)] hover:text-white'
        }`}
      >
        <Icon size={18} />
        <span className="flex-1 text-left">{label}</span>
        {badge && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
            badgeVariant === 'red' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
          }`}>
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[var(--color-sidebar)] text-white flex flex-col z-50">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-sm bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg italic tracking-tight">
            V
          </div>
          <span className="text-xl font-bold tracking-tight uppercase">VAT Portal</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
          <div className="text-[9px] text-[var(--color-primary)] uppercase tracking-widest font-bold mb-1">Logged in as</div>
          <div className="font-semibold text-[12px]">VAT</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <div>
          <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold px-3 mb-2">My Overview</div>
          <div className="space-y-1">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" badge={3} badgeVariant="red" />
          </div>
        </div>

        <div>
          <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold px-3 mb-2">Purchase Orders</div>
          <div className="space-y-1">
            <NavItem id="pos" icon={FileText} label="Purchase Orders" badge={12} />
          </div>
        </div>

        <div>
          <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold px-3 mb-2">My Performance</div>
          <div className="space-y-1">
            <NavItem id="scorecard" icon={BarChart2} label="Scorecard" />
          </div>
        </div>
      </nav>

      <div className="p-6 border-t border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-xs font-bold text-white">JD</div>
        <div>
          <div className="text-sm font-semibold">Jane Doe</div>
          <div className="text-[10px] text-white/50">VAT Global Sourcing</div>
        </div>
      </div>
    </aside>
  );
}
