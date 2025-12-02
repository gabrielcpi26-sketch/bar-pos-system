export default function Home() {
  const cards = [
    {
      title: 'Punto de Venta',
      href: '/admin',
      description: 'Cobro rápido, descuentos, propinas y cierre de caja.',
    },
    {
      title: 'Mesero',
      href: '/mesero',
      description: 'Abrir mesas, dividir cuentas y enviar comandas.',
    },
    {
      title: 'Barra',
      href: '/barra',
      description: 'Control de tickets de barra y recetas automáticas.',
    },
    {
      title: 'Cocina',
      href: '/cocina',
      description: 'Órdenes activas ordenadas por tiempo de espera.',
    },
    {
      title: 'Pedidos cliente',
      href: '/public',
      description: 'Mini-app móvil con QR por mesa.',
    }
  ];

  return (
    <main className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <a key={card.title} href={card.href} className="card hover:border-primary/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <span className="text-primary">→</span>
          </div>
          <p className="text-white/70 text-sm mt-2">{card.description}</p>
        </a>
      ))}
    </main>
  );
}
