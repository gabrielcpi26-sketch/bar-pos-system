'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';

export default function PublicMenu() {
  const [products, setProducts] = useState([]);
  const [table, setTable] = useState('mesa-1');
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabaseBrowser
      .from('products')
      .select('id, name, price, category_id')
      .then(({ data }) => setProducts(data || []));
  }, []);

  const addItem = (product) => {
    const existing = items.find((i) => i.product_id === product.id);
    if (existing) {
      setItems(items.map((i) => (i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setItems([...items, { product_id: product.id, quantity: 1, name: product.name, price: product.price }]);
    }
  };

  const sendOrder = async () => {
    setMessage('Enviando...');
    const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    await supabaseBrowser.from('orders').insert({ table_id: table, status: 'open', total });
    setItems([]);
    setMessage('Orden enviada a tu mesero.');
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <section className="md:col-span-2 card">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs uppercase">Menú del bar</p>
            <h2 className="text-xl font-semibold">Escanea y pide</h2>
          </div>
          <select value={table} onChange={(e) => setTable(e.target.value)} className="bg-surface border border-white/10 rounded px-3 py-2 text-sm">
            <option value="mesa-1">Mesa 1</option>
            <option value="mesa-2">Mesa 2</option>
            <option value="barra">Barra</option>
          </select>
        </header>
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          {products.map((product) => (
            <button key={product.id} onClick={() => addItem(product)} className="card text-left hover:border-primary/50">
              <p className="text-sm text-white/60">${product.price}</p>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-xs text-primary mt-1">Añadir</p>
            </button>
          ))}
        </div>
      </section>
      <section className="card space-y-3">
        <h3 className="text-lg font-semibold">Mi cuenta</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.product_id} className="flex justify-between text-sm">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <p className="text-white/60 text-sm">Total: ${items.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)}</p>
        <button onClick={sendOrder} className="btn w-full">Enviar orden</button>
        {message && <p className="text-xs text-primary">{message}</p>}
      </section>
    </div>
  );
}
