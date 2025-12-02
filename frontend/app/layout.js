import './globals.css';

export const metadata = {
  title: 'BAR POS System',
  description: 'Plataforma integral para bares con POS, inventarios y pedidos móviles'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body className="text-white bg-surface">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <header className="flex items-center justify-between pb-6">
            <div>
              <p className="text-xs uppercase text-white/60">Bar POS</p>
              <h1 className="text-2xl font-bold">Panel omnicanal</h1>
            </div>
            <nav className="flex gap-3 text-sm text-white/80">
              <a href="/" className="hover:text-primary">Inicio</a>
              <a href="/admin" className="hover:text-primary">Administración</a>
              <a href="/mesero" className="hover:text-primary">Mesero</a>
              <a href="/barra" className="hover:text-primary">Barra</a>
              <a href="/cocina" className="hover:text-primary">Cocina</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
