import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Shield, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/auth');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return '';
    
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className="bg-pink-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="font-heading font-bold text-xl md:text-2xl">CryptoBank</span>
          </div>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden text-white hover:bg-pink-600" 
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <a className="font-medium hover:text-pink-200 transition duration-200">Dashboard</a>
            </Link>
            <Link href="/#transactions">
              <a className="font-medium hover:text-pink-200 transition duration-200">Transactions</a>
            </Link>
            <Link href="/#settings">
              <a className="font-medium hover:text-pink-200 transition duration-200">Settings</a>
            </Link>
            
            {/* User menu - desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-pink-600">
                  <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center">
                    <span className="font-medium text-sm">{getUserInitials()}</span>
                  </div>
                  <span className="font-medium">{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Link href="/profile">
                    <a className="flex items-center w-full">
                      <i className="text-pink-500 mr-2">👤</i> Profile
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/security">
                    <a className="flex items-center w-full">
                      <i className="text-pink-500 mr-2">🔒</i> Security
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/support">
                    <a className="flex items-center w-full">
                      <i className="text-pink-500 mr-2">❓</i> Support
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <i className="text-pink-500 mr-2">🚪</i> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            <div className="flex flex-col space-y-3">
              <Link href="/">
                <a className="font-medium hover:text-pink-200 transition">Dashboard</a>
              </Link>
              <Link href="/#transactions">
                <a className="font-medium hover:text-pink-200 transition">Transactions</a>
              </Link>
              <Link href="/#settings">
                <a className="font-medium hover:text-pink-200 transition">Settings</a>
              </Link>
              <Link href="/profile">
                <a className="font-medium hover:text-pink-200 transition">Profile</a>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-left font-medium hover:text-pink-200 transition"
              >
                Logout
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
