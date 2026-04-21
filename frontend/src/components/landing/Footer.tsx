import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-transparent border-t border-white/5 mt-auto relative z-10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {['Twitter', 'GitHub', 'LinkedIn'].map((item) => (
            <a key={item} href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">
              {item}
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 relative rounded-full bg-white/5 border border-white/10 overflow-hidden shadow-inner">
              <img src="/logo.png" alt="VaultVision Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-white tracking-tight text-xl">VaultVision</span>
          </div>
          <p className="text-center text-sm leading-5 text-slate-500">
            &copy; {new Date().getFullYear()} VaultVision Inc. Premium Rights Protection.
          </p>
        </div>
      </div>
    </footer>
  );
}
