import React from 'react';
import { Button } from './ui';
import { Bell } from 'lucide-react';

export default function Topbar({ title = '' }: { title?: string }) {
  return (
    <header className="sticky top-0 z-40 h-16 bg-[var(--color-card)] border-b border-gray-200 px-8 flex items-center justify-between shadow-xs">
      <h1 className="text-lg font-bold tracking-tight text-[var(--color-text-main)] font-sans">{title}</h1>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-0.5">App Status</p>
          <div className="text-xs text-green-600 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span> 
            ERP Sync: Live
          </div>
        </div>
        <Button variant="ghost" size="md" className="gap-2 focus:ring-0 whitespace-nowrap">
          <Bell size={14} />
          Notifications (3)
        </Button>
      </div>
    </header>
  );
}
