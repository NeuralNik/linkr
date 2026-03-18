import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import linkrLogo from "@/assets/linkr-logo.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.batch"), href: "/batch" },
    { name: t("nav.templates"), href: "/templates" },
    { name: t("nav.history"), href: "/history" },
    { name: t("nav.developer"), href: "/developer" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className='sticky top-0 z-50 glass-effect'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-3 group'>
            <img
              src={linkrLogo}
              alt='linkr logo'
              className='h-8 w-8 object-contain group-hover:animate-glow transition-all duration-300'
            />
            <span className='text-xl font-bold text-glow group-hover:text-neon-green-bright transition-colors duration-300'>
              linkr
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive(item.href) ? "text-neon-green text-glow" : "text-foreground hover:text-neon-green-bright"
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary animate-glow' />
                )}
              </Link>
            ))}
            <LanguageSwitcher />
            <ThemeToggle />
          </nav>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center space-x-2'>
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='h-10 w-10 border border-border hover:bg-secondary hover:glow-effect transition-all duration-300'
            >
              {isMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden border-t border-border'>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                    isActive(item.href)
                      ? "text-neon-green bg-secondary text-glow"
                      : "text-foreground hover:text-neon-green-bright hover:bg-secondary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
