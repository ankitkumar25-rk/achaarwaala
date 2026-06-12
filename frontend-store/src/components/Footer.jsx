import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import logoImg from '../assets/images/logo_black.svg';

export default function Footer() {
  return (
    <footer className="bg-[#FAFAF4] text-[#6B6560] border-t border-[#E8E2D8] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 text-left">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoImg} alt="Achaarwaala Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
            </Link>
            <p className="text-[#6B6560] text-sm leading-relaxed max-w-sm">
              Artisanal Indian pickles crafted with patience. Preserving traditional, sun-cured family recipes from Lohagaal, Rajasthan. Slow-made, small-batch, precious.
            </p>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#9A8A70] mb-5">
              EXPLORE
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link to="/products" className="text-[#6B6560] hover:text-[#1A1A1A] transition-colors">
                  Signature Series
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-[#6B6560] hover:text-[#1A1A1A] transition-colors">
                  Rare Batches
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-[#6B6560] hover:text-[#1A1A1A] transition-colors">
                  Our Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Assistance */}
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#9A8A70] mb-5">
              ASSISTANCE
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link to="/contact" className="text-[#6B6560] hover:text-[#1A1A1A] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-[#6B6560] hover:text-[#1A1A1A] transition-colors">
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#6B6560] hover:text-[#1A1A1A] transition-colors">
                  Returns & Claims
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Provenance */}
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#9A8A70] mb-5">
              PROVENANCE
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link to="/our-story" className="text-[#6B6560] hover:text-[#1A1A1A] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="text-[#6B6560] hover:text-[#1A1A1A] transition-colors">
                  Sun-Curing Process
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#6B6560] hover:text-[#1A1A1A] transition-colors">
                  Rajasthan Estates
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Address and Credentials */}
        <div className="mt-12 pt-8 border-t border-[#E8E2D8] grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-left">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-wider text-[#1A1A1A] font-medium">
              Lohagaal Village, Rajasthan, India 333012
            </p>
            <p className="text-[9px] uppercase tracking-widest text-[#9A8A70]">
              FSSAI Lic. No. 22224059000854
            </p>
          </div>
          <div className="md:text-right text-[10px] uppercase tracking-widest text-[#9A8A70]">
            EST. 1946 · LOHAGAAL, RAJASTHAN
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#FAFAF4] border-t border-[#E8E2D8] py-6 text-xs text-center text-[#6B6560]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Achaarwaala. Crafted in small batches.</p>
          <p className="flex items-center gap-1.5 justify-center">
            Made with <Heart className="w-3.5 h-3.5 text-[#C8922A] fill-[#C8922A]" /> in Rajasthan
          </p>
        </div>
      </div>
    </footer>
  );
}
