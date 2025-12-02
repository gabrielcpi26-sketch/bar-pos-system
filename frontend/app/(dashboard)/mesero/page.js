'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../../lib/supabaseClient';

export default function MeseroPage() {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    supabaseBrowser.from('tables').select('*').then(({ data }) => setTables(data || []));
    supabaseBrowser
      .from('orders')
      .select('id, table_id, status, total')
      .order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data || []));
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Mesas</h2>
        <div className="grid grid-cols-2 gap-2">
          {tables.map((table) => (
            <div key={table.id} className="bg-surface/60 border border-white/5 rounded p-3">
              <p className="text-sm text-white/60">{table.status || 'libre'}</p>
              <p className="text-lg font-semibold">Mesa {table.number}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Órdenes recientes</h2>
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between bg-surface/60 p-3 rounded border border-white/5">
              <div>
                <p className="text-sm text-white/60">Mesa {order.table_id}</p>
                <p className="font-semibold capitalize">{order.status}</p>
              </div>
              <p className="text-primary font-semibold">${order.total || 0}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
