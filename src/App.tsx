import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Highlights } from './components/Highlights';
import { About } from './components/About';
import { MenuSection } from './components/MenuSection';
import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { FloatingBar } from './components/FloatingBar';
import { StructuredData } from './components/StructuredData';

export default function App() {
  return (
    // ToastProvider englobe CartProvider : l'ajout au panier déclenche une notification.
    <ToastProvider>
      <CartProvider>
        <StructuredData />

        {/* Lien d'évitement pour la navigation au clavier */}
        <a
          href="#menu"
          className="sr-only rounded-full bg-forest-800 px-5 py-3 text-cream-50 focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90]"
        >
          Aller au menu
        </a>

        <Header />

        <main>
          <Hero />
          <Highlights />
          <About />
          <MenuSection />
          <Gallery />
          <Contact />
        </main>

        <Footer />

        <CartDrawer />
        <FloatingBar />
      </CartProvider>
    </ToastProvider>
  );
}
