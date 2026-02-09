import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#how-it-works", label: "Como Funciona" },
    { href: "#applications", label: "Aplicações" },
    { href: "#features", label: "Funcionalidades" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-lg py-3 border-b border-white/10" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 md:gap-3 group cursor-pointer shrink-0">
          <div className="relative">
            <img 
              src="/assets/logo.png" 
              alt="Afiliados.ao Logo" 
              className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-110" 
            />
          </div>
          <span className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-white">
            afiliados<span className="text-white/60">.ao</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-400">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href} 
              className="hover:text-white transition-colors relative group py-2"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full px-6">
            Entrar
          </Button>
          <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-6 font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-105 active:scale-95">
            Cadastrar
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black border-b border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href} 
                  className="text-lg font-medium text-zinc-400 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-white/5 my-2" />
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 w-full h-12 rounded-xl">
                  Entrar
                </Button>
                <Button className="bg-white text-black hover:bg-zinc-200 w-full h-12 rounded-xl font-bold">
                  Cadastrar Grátis
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
