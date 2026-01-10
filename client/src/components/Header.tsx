import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import LogoPrelude from "@/components/LogoPrelude";
import { navItems } from "@/data/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPrelude, setShowPrelude] = useState(false);
  const [location, navigate] = useLocation();

  // Triggers the logo animation sequence
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPrelude(true);
  };

  // Resets state and navigates home after animation finishes
  const handlePreludeComplete = () => {
    setShowPrelude(false);
    if (location !== "/") {
      navigate("/");
    }
  };

  return (
    <>
      <LogoPrelude isVisible={showPrelude} onComplete={handlePreludeComplete} />
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          background: "rgba(3, 18, 31, 0.8)",
          backdropFilter: "blur(8px)",
          borderBottom: "2px solid rgba(33, 80, 100, 0.96)",
          marginBottom: "3px"
        }}
        className="px-4 lg:px-8 py-2"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogoClick}
              className="hover:scale-105 transition-transform duration-300 cursor-pointer bg-transparent border-none outline-none"
            >
              <div className="w-[72px] h-13 bg-[linear-gradient(to_br,rgb(0,120,255,0.2),rgb(0,40,120,0.4))] backdrop-blur-sm border border-[rgba(0,120,255,0.3)] rounded-lg flex items-center justify-center shadow-lg shadow-[rgba(0,120,255,0.1)] hover:shadow-[rgba(0,120,255,0.2)] transition-all duration-300 overflow-hidden" >
                <img src="/assets/Viksha2.jpg" alt="VIKSHA Logo" />
              </div>
            </button>

            <a
              href="https://rvu.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block"
            >
              <img
                src="/assets/rv-logo.png"
                alt="RV University Logo"
                className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              />
            </a>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative hover:text-[rgb(151_192_246_/0.85)] transition-all duration-300 group ${location === item.path ? "text-[rgb(0_180_255_/0.85)]" : "text-white"
                  }`}
              >
                {location === item.path ? `{ ${item.label} }` : item.label}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[linear-gradient(to_right,rgb(0,80,200),rgb(0,180,255))] transform transition-transform duration-300 ${location === item.path
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                    }`}
                />
              </Link>
            ))}
          </nav>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-blue-300 hover:bg-blue-500/20 hover:text-white transition-all duration-300 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X size={22} className="transition-transform duration-300 rotate-90" />
            ) : (
              <Menu size={22} />
            )}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-800 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-left hover:text-blue-400 transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-blue-500/10 ${location === item.path
                    ? "text-blue-400 bg-blue-500/10"
                    : "text-white"
                    }`} >
                  {location === item.path ? `{ ${item.label} }` : item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
