import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { LogOut, Music2, Home, User, Shield, Info } from "lucide-react";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";

const LOGO_URL = "https://media.base44.com/images/public/6a34d828818454f364333b8f/5e2267f63_logo.png";

export default function Navbar({ user }) {
  const handleLogout = () => {
    base44.auth.logout("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/40">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 select-none">
          <img src={LOGO_URL} alt="Car Song Generator" className="w-10 h-10 object-contain" onError={(e) => { e.target.style.display='none'; }} />
          <div className="hidden sm:block">
            <p className="font-heading text-primary text-xs tracking-widest uppercase font-bold leading-tight">Car Song Generator</p>
            <p className="text-muted-foreground text-[10px] tracking-wider">Your Car. Your Song. Your Story.</p>
          </div>
        </Link>

        {/* Nav links — hidden on mobile (BottomTabBar used instead) */}
        <div className="flex items-center gap-1 sm:gap-3">
          <Link to="/" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1.5 text-xs select-none">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
          <Link to="/about" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1.5 text-xs select-none">
              <Info className="w-4 h-4" />
              About
            </Button>
          </Link>
          <Link to="/generator" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1.5 text-xs select-none">
              <Music2 className="w-4 h-4" />
              Generator
            </Button>
          </Link>
          {user && (
            <Link to="/profile" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1.5 text-xs select-none">
                <User className="w-4 h-4" />
                Profile
              </Button>
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1.5 text-xs select-none">
                <Shield className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          )}
          {user && <DeleteAccountDialog />}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-primary gap-1.5 text-xs select-none"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log Out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}