import { Link } from 'react-router-dom';

const socialLinks = [
  { label: 'INSTAGRAM', href: 'https://instagram.com' },
  { label: 'YOUTUBE', href: 'https://youtube.com' },
  { label: 'WHATSAPP', href: 'https://wa.me/919999999999' },
];

const footerNav = [
  { label: 'Works', to: '/works' },
  { label: 'Fashion', to: '/fashion' },
  { label: 'Events', to: '/events' },
  { label: 'Contact', to: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0e0e0e] border-t border-[#c41e3a]/30 pt-16 pb-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="font-serif italic text-3xl text-[#e5e2e1] mb-4">FRAME 4 STUDIOS</div>
            <p className="font-body text-sm font-light text-[#e3bebd]/70 leading-relaxed">
              A premium cinematic creative agency crafting stories that brands remember.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="font-ui text-[10px] tracking-[0.4em] text-[#c41e3a] mb-6 uppercase">Navigation</p>
            <div className="flex flex-col gap-3">
              {footerNav.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="font-ui text-xs tracking-[0.15em] text-[#e3bebd] hover:text-[#ffb3b4] transition-colors duration-300"
                >
                  {label.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-ui text-[10px] tracking-[0.4em] text-[#c41e3a] mb-6 uppercase">Contact</p>
            <div className="flex flex-col gap-2">
              <a href="mailto:frame4studios@gmai.com" className="font-body text-sm text-[#e3bebd]/70 hover:text-[#ffb3b4] transition-colors">
                frame4studios@gmai.com
              </a>
              <a href="tel:7416522435" className="font-body text-sm text-[#e3bebd]/70 hover:text-[#ffb3b4] transition-colors">
                7416522435, 8074582063
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="font-ui text-[10px] tracking-[0.4em] text-[#c41e3a] mb-6 uppercase">Follow</p>
            <div className="flex flex-col gap-3">
              {socialLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui text-[11px] tracking-[0.2em] text-[#e3bebd] hover:text-[#ffb3b4] transition-colors duration-300"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-[#5b4040]/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-ui text-[10px] tracking-[0.35em] text-[#e3bebd]/40">
            © {new Date().getFullYear()} FRAME 4 STUDIOS. CRAFTED WITH INTENTION.
          </p>
          <Link
            to="/admin/login"
            className="font-ui text-[9px] tracking-[0.2em] text-[#5b4040] hover:text-[#c41e3a] transition-colors"
          >
            ADMIN
          </Link>
        </div>
      </div>
    </footer>
  );
}
