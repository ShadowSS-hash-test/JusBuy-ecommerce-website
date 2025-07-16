import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Menu, X } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === 'admin';
  const location = useLocation();
  const { cart } = useCartStore();

  const linkBase = 'px-2 py-1 rounded-md transition duration-200 flex items-center';
  const linkHover = 'hover:bg-gray-100';

  const getDesktopLinkClass = () => `${linkBase} text-black ${linkHover}`;
  const getMobileLinkClass = (to) => {
    const isActive = location.pathname === to;
    return `${linkBase} text-black ${linkHover} ${isActive ? 'bg-gray-200' : ''}`;
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-40 border-b border-gray-200">
      <div className="container mx-auto px-2 py-2 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-black px-2 py-1 hover:bg-gray-100 rounded-md transition duration-200">
          JusBuy
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link to="/" className={getDesktopLinkClass()}>Home</Link>
          <Link to="/cart" className={`${getDesktopLinkClass()} relative`}>
            <ShoppingCart size={18} />
            <span className="ml-1 hidden sm:inline text-sm">Cart</span>
            { 
              cart.length > 0 && 
               <span className="absolute -top-1 -left-2 bg-black text-white rounded-full px-1.5 py-0.5 text-xs">{cart.length}</span> }
         
          </Link>
          {isAdmin && (
            <Link to="/secret-dashboard" className={getDesktopLinkClass()}>
              <Lock size={16} className="mr-1" />
              <span className="hidden sm:inline text-sm">Dashboard</span>
            </Link>
          )}
          {user ? (
            <button onClick={logout} className={`${linkBase} text-black ${linkHover} `}>
              <LogOut size={16} className="mr-1" />
              <span  className="text-sm cursor-pointer">Log Out</span>
            </button>
          ) : (
            <>
              <Link to="/signup" className={getDesktopLinkClass()}>
                <UserPlus size={16} className="mr-1" />
                <span className="text-sm">Sign Up</span>
              </Link>
              <Link to="/login" className={getDesktopLinkClass()}>
                <LogIn size={16} className="mr-1"  hover:cursor-pointer />
                <span className="text-sm cursor-pointer">Login</span>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button className="sm:hidden text-black p-1 hover:bg-gray-100 rounded-md transition duration-200" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col px-2 py-1 gap-1">
            <Link to="/" className={getMobileLinkClass('/')}>Home</Link>
            <Link to="/cart" className={`${getMobileLinkClass('/cart')} relative`}>
              <ShoppingCart size={18} />
              <span className="ml-1 text-sm">Cart</span>{ 
              cart.length > 0 && 
               <span className="absolute -top-1 -left-2 bg-black text-white rounded-full px-1.5 py-0.5 text-xs">{cart.length}</span> }
             
            </Link>
            {isAdmin && (
              <Link to="/secret-dashboard" className={getMobileLinkClass('/secret-dashboard')}>
                <Lock size={16} className="mr-1" />
                <span className="text-sm">Dashboard</span>
              </Link>
            )}
            {user ? (
              <button onClick={logout} className={`${linkBase} text-black ${linkHover}`}>
                <LogOut size={16} className="mr-1" />
                <span className="text-sm">Log Out</span>
              </button>
            ) : (
              <>
                <Link to="/signup" className={getMobileLinkClass('/signup')}>
                  <UserPlus size={16} className="mr-1" />
                  <span className="text-sm">Sign Up</span>
                </Link>
                <Link to="/login" className={getMobileLinkClass('/login')}>
                  <LogIn size={16} className="mr-1" />
                  <span className="text-sm">Login</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
