import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Music2, Info } from "lucide-react";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/generator", icon: Music2, label: "Generator" },
  { to: "/about", icon: Info, label: "About" },
];

export default function BottomTabBar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-background/95 backdrop-blur-md border-t border-border/40 pb-safe">
      <div className="flex">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 select-none transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-heading tracking-wider">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}