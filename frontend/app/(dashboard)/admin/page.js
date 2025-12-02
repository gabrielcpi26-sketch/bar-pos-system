'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../../lib/supabaseClient';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: 0, category_id: null });
  const [report, setReport] = useState(null);

  const load = async () => {
    const { data } = await supabaseBrowser.from('products').select('*');
    setProducts(data || []);
  };

  const saveProduct = async () => {
    await supabaseBrowser.from('products').insert(form);
    setForm({ name: '', price: 0, category_id: null });
    load();
  };

  useEffect(() => {
    load();
    supabaseBrowser.from('orders').select('total').then(({ data }) => {
      const total = (data || []).reduce((acc, o) => acc + Number(o.total || 0), 0);
      setReport({ total });
    });
  }, []);

  return (
    <div className="space-y-6">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Crear producto</h2>
        <div className="grid md:grid-cols-3 gap-2">
          <input className="bg-surface border border-white/10 rounded px-3 py-2" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="bg-surface border border-white/10 rounded px-3 py-2" placeholder="Precio" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <button className="btn" onClick={saveProduct}>Guardar</button>
        </div>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Inventario y menú</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.id} className="flex justify-between bg-surface/60 p-3 rounded border border-white/5">
              <div>
                <p className="text-sm text-white/60">${product.price}</p>
                <p className="font-semibold">{product.name}</p>
              </div>
              <span className="text-xs text-primary">{product.status || 'activo'}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Reporte del día</h2>
        <p className="text-white/70 text-sm">Ventas del día: ${report?.total?.toFixed(2) || '0.00'}</p>
      </section>
    </div>
  );
}
