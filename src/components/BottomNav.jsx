import React from 'react';
import { Home, UserCheck, Truck, UserPlus } from 'lucide-react';

export default function BottomNav({ currentView, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'supplier-portal', label: 'Marketer Desk', icon: UserCheck },
    { id: 'driver-cockpit', label: 'Driver Cockpit', icon: Truck },
    { id: 'register', label: 'Register', icon: UserPlus, highlight: true }
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="grid grid-cols-4 items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          if (item.highlight) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center py-1 text-center group"
                aria-label={item.label}
              >
                <div className={`w-10 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isActive 
                    ? 'bg-cas-slate text-white' 
                    : 'bg-cas-amber text-slate-900 shadow-sm'
                }`}>
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className={`text-[10px] font-extrabold mt-1 tracking-tight ${
                  isActive ? 'text-cas-slate' : 'text-slate-700'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center py-1 text-center group"
              aria-label={item.label}
            >
              <div className={`p-1 rounded-lg transition-colors ${
                isActive ? 'text-cas-slate font-bold' : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} aria-hidden="true" />
              </div>
              <span className={`text-[10px] font-medium tracking-tight ${
                isActive ? 'text-cas-slate font-bold' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
