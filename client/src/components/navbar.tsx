import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <img 
            src="/assets/logo.png" 
            alt="Afiliados.ao Logo" 
            className="w-8 h-8 object-contain brightness-0 invert" 
          />
          <span className="text-xl font-medium tracking-tight">afiliados.ao</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400 font-['Poppins']">
          <a href="#how-it-works" className="hover:text-white transition-colors">Como Funciona</a>
          <a href="#applications" className="hover:text-white transition-colors">Aplicações</a>
          <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-6 font-medium">
          Entrar
        </Button>
      </div>
    </nav>
  );
}
