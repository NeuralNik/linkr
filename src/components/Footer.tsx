import { Github, Linkedin, Heart, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import linkrLogo from '@/assets/linkr-logo.png';

export function Footer() {
  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/writetosagnik', icon: Github },
    { name: 'Reddit', href: 'https://www.reddit.com/user/Comfortable-Web-5719/', icon: MessageSquare },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/sagnik-pal-930160277/', icon: Linkedin },
  ];

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={linkrLogo} 
                alt="linkr logo" 
                className="h-6 w-6 object-contain"
              />
              <h3 className="text-lg font-semibold text-neon-green">linkr</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Generate high-quality QR codes from any URL instantly. Fast, free, and secure.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-neon-green transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/developer" className="text-muted-foreground hover:text-neon-green transition-colors duration-300">
                  Know Developer
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border hover:border-neon-green hover:bg-secondary transition-all duration-300 hover:glow-effect"
                  aria-label={link.name}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500" /> by{' '}
            <Link to="/developer" className="text-neon-green hover:text-neon-green-bright transition-colors duration-300">
              Sagnik
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}