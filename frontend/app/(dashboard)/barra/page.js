'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../../lib/supabaseClient';

export default function BarraPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    supabaseBrowser
      .from('bar_tickets')
      .select('id, status, order_id')
      .order('created_at', { ascending: false })
      .then(({ data }) => setTickets(data || []));
  }, []);

  const markReady = async (id) => {
    await supabaseBrowser.from('bar_tickets').update({ status: 'listo' }).eq('id', id);
    setTickets(tickets.map((t) => (t.id === id ? { ...t, status: 'listo' } : t)));
  };

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/60 uppercase">Barra</p>
          <h2 className="text-lg font-semibold">Comandas activas</h2>
        </div>
      </div>
      {tickets.map((ticket) => (
        <div key={ticket.id} className="flex justify-between bg-surface/60 p-3 rounded border border-white/5">
          <div>
            <p className="text-sm text-white/60">Orden #{ticket.order_id}</p>
            <p className="font-semibold capitalize">{ticket.status}</p>
          </div>
          {ticket.status !== 'listo' && (
            <button className="btn" onClick={() => markReady(ticket.id)}>
              Marcar listo
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
