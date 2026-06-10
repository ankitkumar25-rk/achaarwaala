import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Search } from 'lucide-react';
import { useAuthStore, useCartStore } from '../store';
import logoImg from '../assets/images/logo.png';

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);

  const location = useLocation();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/our-story', label: 'Our Story' },
    { to: '/categories-info', label: 'Categories Info' },
    { to: '/contact', label: 'Contact Us' },
  ];

  const headerClass = `sticky top-0 z-50 transition-all duration-300 ${
    isScrolled
      ? 'bg-[#F7F1E3]/95 border-b border-[#E8E2D8] backdrop-blur-md shadow-xs'
      : 'bg-[#F7F1E3] border-b border-[#E8E2D8]'
  }`;

  return (
    <header className={headerClass}>
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-20 md:h-24">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={logoImg} alt="Achaarwaala Logo" className="h-10 md:h-12 w-auto object-contain mix-blend-multiply" />
          </Link>

          {/* Center Nav - COLLECTIONS · HERITAGE · PROCESS · JOURNAL (uppercase, small, spaced) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((l, index) => {
              const isActive = location.pathname === l.to;
              return (
                <div key={l.label} className="flex items-center">
                  <Link
                    to={l.to}
                    className={`font-sans text-[14px] uppercase tracking-[0.12em] transition-colors py-2 ${
                      isActive
                        ? 'text-[#D98C00]'
                        : 'text-[#2E5731] hover:text-[#E5B800]'
                    }`}
                  >
                    {l.label}
                  </Link>
                  {index < navLinks.length - 1 && (
                    <span className="text-[#E8E2D8] text-[8px] mx-3 lg:mx-4">•</span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right: Search, Account, Cart icons */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <Link
              to="/products"
              className="p-2 text-[#2E5731] hover:text-[#E5B800] transition-colors"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" />
            </Link>

            {/* Account Icon */}
            <div className="flex items-center">
              {user ? (
                <div className="relative group">
                  <button className="p-2 text-[#2E5731] hover:text-[#E5B800] transition-colors flex items-center gap-1.5">
                    <User className="w-4.5 h-4.5" />
                    <span className="text-[10px] font-sans uppercase tracking-wider hidden sm:inline-block max-w-[80px] truncate text-[#6B6560]">
                      {user.name?.split(' ')[0] || 'User'}
                    </span>
                  </button>
                  <div className="absolute right-0 top-10 w-44 bg-[#FFFFFF] border border-[#E8E2D8] py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg">
                    <Link to="/account" className="block px-4 py-2 text-[10px] uppercase tracking-[0.1em] text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#FAFAF4]">My Account</Link>
                    {['ADMIN', 'SUPER_ADMIN'].includes(user.role) && (
                      <a href="https://admin.achaarwaala.com" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-[10px] uppercase tracking-[0.1em] text-[#C8922A] hover:bg-[#FAFAF4] font-bold">Admin Panel</a>
                    )}
                    <Link to="/orders" className="block px-4 py-2 text-[10px] uppercase tracking-[0.1em] text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#FAFAF4]">My Orders</Link>
                    <hr className="my-1 border-[#E8E2D8]" />
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-[0.1em] text-red-500 hover:bg-red-50">Logout</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="p-2 text-[#2E5731] hover:text-[#E5B800] transition-colors"
                  aria-label="Login"
                >
                  <User className="w-4.5 h-4.5" />
                </button>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="p-2 relative text-[#2E5731] hover:text-[#E5B800] transition-colors"
              aria-label="Cart"
              id="cart-link-btn"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D98C00] text-[#FFFFFF] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="p-2 text-[#2E5731] hover:text-[#E5B800] transition-colors"
                aria-label="Menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-0 left-0 w-full h-screen z-100 bg-[#F7F1E3] p-6 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <img src={logoImg} alt="Achaarwaala Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
            <button onClick={() => setMenuOpen(false)} className="p-2 text-[#2E5731] hover:text-[#E5B800]">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-6 flex flex-col mt-4">
            {navLinks.map((l) => {
              const isActive = location.pathname === l.to;
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={`text-[14px] uppercase tracking-[0.12em] font-medium py-2 border-b border-[#E8E2D8] transition-colors ${
                    isActive ? 'text-[#D98C00]' : 'text-[#2E5731] hover:text-[#E5B800]'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            {user && (
              <>
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="text-[14px] uppercase tracking-[0.12em] font-medium py-2 border-b border-[#E8E2D8] text-[#2E5731] hover:text-[#E5B800]"
                >
                  My Account
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="text-[14px] uppercase tracking-[0.12em] font-medium py-2 border-b border-[#E8E2D8] text-[#2E5731] hover:text-[#E5B800]"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full text-left text-[14px] uppercase tracking-[0.12em] font-medium py-2 text-red-500"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <button
                onClick={() => { setMenuOpen(false); openAuthModal(); }}
                className="btn-primary w-full justify-center text-[12px] py-3 mt-4"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
